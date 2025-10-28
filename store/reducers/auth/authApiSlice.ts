import { apiSlice } from '@/store/api/apiSlice'

interface RefreshToken {
  roles: []
  accessToken: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  emial: string
  passsword: string
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<RefreshToken, LoginCredentials>({
      query: (credentials) => ({
        url: '/api/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation<Boolean, RegisterCredentials>({
      query: (credentials) => ({
        url: '/api/register',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = authApiSlice
