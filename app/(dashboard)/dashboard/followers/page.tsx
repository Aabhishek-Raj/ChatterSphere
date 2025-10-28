'use client';
import { useGetFollowersQuery } from '@/store/reducers/followers/followersApiSlice';
import Link from 'next/link';
import React from 'react';

const Followers = () => {
  const { data: users, isLoading, isSuccess, isError, error } = useGetFollowersQuery();

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = (
      <section className="flex items-center justify-center flex-col">
        <h1>Followers List</h1>
        <ul className="bg-slate-500 p-3 border-r-4">
          {users.map((user, i) => {
            return (
              <li key={i}>
                {user.name} - {user.email}
              </li>
            );
          })}
        </ul>
        <Link href="/dashboard">Back to Dashboard</Link>
      </section>
    );
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return content;
};

export default Followers;
