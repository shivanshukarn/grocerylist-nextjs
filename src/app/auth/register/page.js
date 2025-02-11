'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations';
import toast from 'react-hot-toast';
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading('Registering...');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        router.push('/auth/login');
        toast.success('User Registered Successifully', { id: toastId });
      } else {
        const error = await res.json();
        throw new Error(error.error);
      }
    } catch (error) {
      toast.error('Failed to register user. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            {...register('name')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            {...register('phone')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
        <div className='mt-2'>
          <Link href='/auth/login' className='text-blue-600 hover:underline'>Already Registered? Login!</Link>
        </div>
      </form>
    </div>
  );
}