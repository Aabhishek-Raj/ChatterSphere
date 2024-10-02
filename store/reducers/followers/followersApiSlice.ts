import { apiSlice } from '@/store/api/apiSlice';

export const followersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFollowers: builder.query({
      query: () => '/api/followers',
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetFollowersQuery } = followersApiSlice;
