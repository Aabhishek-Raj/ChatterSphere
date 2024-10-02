import { BaseQueryApi, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '@/store/reducers/auth/authSlice';
import { RootState } from '../store';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { register } from 'module';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState; // Cast getState to RootState
    console.log(state, 'st');
    const token = state.auth.token;
    console.log('token in state', token);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string, // Args for the query
  api: BaseQueryApi, // Typed `api`
  extraOptions: { [key: string]: any } // Extra options if needed
) => {
  console.log('sendin refresh token..');
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result?.error?.status === 403) {
    console.log('sending refresh token');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/api/refresh', api, extraOptions);
    console.log(refreshResult, '??--');
    if (refreshResult?.data) {
      const user = (api.getState() as RootState).auth.user;
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
