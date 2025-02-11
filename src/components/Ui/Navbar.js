'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const logoutPromise = signOut({ redirect: false });

    toast.promise(logoutPromise, {
      loading: 'Logging out...',
      success: 'Logged out successfully!',
      error: 'Logout failed. Please try again.',
    });

    await logoutPromise;
    router.push('/auth/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Title */}
      <div className="text-xl font-bold">
        <Link href="/">GroceryList</Link>
      </div>

      {/* Navigation Links */}
      <div className="space-x-6 hidden md:flex">
        <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        <Link href="/dashboard/profile" className="hover:underline">Profile</Link>
      </div>

      {/* Auth Buttons */}
      <div>
        {session ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
