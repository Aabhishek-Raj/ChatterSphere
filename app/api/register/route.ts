import { db } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Save the new user
  const savedUser = await db.profile.create({
    data: {
      name,
      imageUrl: 'https://4kwallpapers.com/images/walls/thumbs_3t/17094.jpg',
      userId: uuid4(),
      email: email,
      password: hashedPassword,
    },
  });
  console.log(savedUser, 'Saved-user');

  // Create a response and set the cookie
  const response = NextResponse.json(true);

  return response;
}
