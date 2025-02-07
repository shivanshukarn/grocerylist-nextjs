'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

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
          <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
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
