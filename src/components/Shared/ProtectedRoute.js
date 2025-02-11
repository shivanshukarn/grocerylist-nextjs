'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      toast.loading('Checking authentication...', { id: 'auth-check' });
    }

    if (status === 'unauthenticated') {
      toast.error('You must be logged in to access this page.');
      router.push('/auth/login');
    }

    if (status === 'authenticated') {
      toast.dismiss('auth-check');
    }
  }, [status, router]);

  if (status === 'loading') {
    toast.loading('Checking authentication...', { id: 'auth-check' });
  }

  return status === 'authenticated' ? children : null
}