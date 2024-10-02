'use server'

import { db } from '@/lib/db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import apiService from '../services/apiServices';

interface params {
  email: string,
  password: string
}

export async function signup({ email, password }: params) {
  try {
    console.log(email, password, "EMAIL")
    if (!email || !password) {
      throw new Error("Email is required to find a profile");
    }

    // const saveCoreUser = await apiService.post('api/auth/registerUser', { email, password })
    const existingUser = await db.profile.findUnique({ where: { email: email } });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists ! Please try with different email",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const savedUser = await db.profile.create({
      data: {
        name: 'No name',
        userId: '494949494idkdi',
        imageUrl: 'http://default-image-url.com',
        email: email,
        password: hashedPassword
      }
    })
    console.log(savedUser, 'Saved-user')

    const sessionId = await bcrypt.hash(savedUser.id, 10)

    const getCookies = cookies();
    getCookies.set("token", sessionId);

    handleLogin(savedUser.id,)

    return {
      success: true,
      message: "Login is successfull",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong! please try again",
    };
  }
}

export async function handleLogin(accessToken: string, email, password) {

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required."
    }
  }

  const foundUser = await db.profile.findUnique({ where: { email } })

  if (!foundUser) return {
    success: false,
     message: "User not found."
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return {
      success: false,
      message: "Incorrect password."
    };
  }

  if (match) {
    const roles = Object.values(foundUser.roles || {}).filter(Boolean);
    
    const cookieStore = cookies();

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "username": foundUser.name,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    );

    const newRefreshToken = jwt.sign(
      { "userId": foundUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    let newRefreshTokenArray =
      !accessToken
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== accessToken);

    if (accessToken) {

      /* 
      Scenario added here: 
          1) User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      // const refreshToken = cookies.jwt;
      const foundToken = await db.profile.findFirst({
        where: {
            refreshToken: {
                some: { token: accessToken}
            }
        }
    });
    

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log('attempted refresh token reuse at login!')
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      cookieStore.set('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'none',
        maxAge: 0 // This clears the cookie
      });
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

    const result = await db.profile.update({
      where: { email },
      data: { refreshToken: foundUser.refreshToken }
    });
    console.log(result);
    console.log(roles);

    // Creates Secure Cookie with refresh token
     cookieStore.set("jwt", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set true in production
      sameSite: 'none', // Correct case for 'none'
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send authorization roles and access token to user
    return {
      success: true,
      roles,
      accessToken
    };
  } 
}

export async function handleRefreshToken(refreshToken) {

  const cookieStore = cookies();

  if (!refreshToken)  return {
    success: false,
    message: "Not Authourized."
  };
  cookieStore.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'none',
    maxAge: 0 // This clears the cookie
  });

  const foundUser = await db.profile.findFirst({
    where: {
        refreshToken: {
            some: {token: refreshToken}
        }
    }
});

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (error, decoded) => {
              if (error) return {success: false, message: "Forbidden"}; //Forbidden
              console.log('attempted refresh token reuse!')
              // const hackedUser = await db.profile.findUnique({where: { id: decoded.userId }})
              // hackedUser.refreshToken = [];
              const hackedUserUpdate = await db.profile.update({
                where: { id: decoded.userId },
                data: { refreshToken: [] }
              });
              console.log(hackedUserUpdate);
          }
      )
      return {
        sucess: false,
        message: "Forbidden"
      }; //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

   // evaluate jwt 
   jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
        if (err) {
            console.log('expired refresh token')
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await db.profile.update({
              where: { id: decoded.userId },
              data: { refreshToken: [...newRefreshTokenArray] }
            });
            console.log(result);
        }
        if (err || foundUser.id !== decoded.userId) {
          return {
            sucess: false,
            message: "Forbidden"
          }
        }

        // Refresh token was still valid
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.name,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );

        const newRefreshToken = jwt.sign(
            { "username": foundUser.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        const result = await db.profile.findUnique({
          where: { id: foundUser.id },
          data: { refreshToken: [...newRefreshTokenArray, newRefreshToken]}
        })

        // Creates Secure Cookie with refresh token
        cookieStore.set('jwt', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000
        })

        return {
          success: true,
          roles,
          accessToken
        };
    }
);
}

const handleLogout = async (refreshToken) => {
  const cookieStore = cookies()
  // On client, also delete the accessToken

  if (!refreshToken) return {
    success: false,
    }

  // Is refreshToken in db?
  const foundUser = await db.profile.findFirst({
    where: { refreshToken: { has: refreshToken } } // Assumes refreshToken is stored in an array or list
});
  if (!foundUser) {
    cookieStore.set('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'none',
      maxAge: 0 // This clears the cookie
    });
      
    return {
      sucess: false,
    }
  }

  // Delete refreshToken in db
  const updateRefreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
  const result = await db.profile.update({
    where: {id: foundUser.id},
    data: { refreshToken: updateRefreshToken}
  })
  console.log(result);

  cookieStore.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'none',
    maxAge: 0 // This clears the cookie
  });
  return {
    success: true,
  }
}

export async function handleLoginx(userId: string, accessToken: string, refreshToken: string) {
  cookies().set('session_userid', userId, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
  });

  cookies().set('session_access_token', accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60, // 60 minutes
    path: '/'
  });

  cookies().set('session_refresh_token', refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
  });
}