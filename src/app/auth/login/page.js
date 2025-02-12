'use client';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Logging In...');

    const result = await signIn('credentials', {
      redirect: false,
      ...data
    });

    if (result?.ok) {
      toast.success('Logged in successfully!', { id: toastId });
      router.refresh();
    } else {
      toast.error(result?.error || 'Login failed. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email or Phone</label>
          <input
            {...register('identifier')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <div className='mt-2'>
          <Link href='/auth/register' className='text-blue-600 hover:underline'>New User? Register!</Link>
        </div>
      </form>
    </div>
  );
}