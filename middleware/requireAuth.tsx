'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // use next/navigation for App Router instead of next/router
import { useSelector } from 'react-redux'; // Or your preferred state management
import { RootState } from '@/store/store'; // Adjust the path to your store

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  console.log('cllein...');
  const token = useSelector((state: RootState) => state.auth.token); // Replace with your token selector
  const router = useRouter(); // Import from next/navigation for app directory routing
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !token) {
      console.log('[redirecting by requireAuth..]');
      router.push(`/login?from=${router.asPath}`); // Redirect to login
    }
  }, [isMounted, token, router]);

  // If no token, return null or a loader to prevent the page from rendering
  if (!isMounted || !token) {
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
