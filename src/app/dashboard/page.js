'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import CreateForm from '@/components/GroceryList/CreateForm';
import ListItem from '@/components/GroceryList/ListItem';
import toast from 'react-hot-toast';

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: lists, mutate, error } = useSWR('/api/grocery', fetcher);

  if (error) toast.error('Failed to load grocery list. Try again!');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>
      <CreateForm
        onSuccess={() => {
          toast.success('Item added successfully!');
          mutate();
        }}
        onError={() => toast.error('Failed to add item. Try again!')}
      />

      <div className="mt-8 space-y-4">
        {Array.isArray(lists) && lists.length > 0 ? (
          lists.map(list => (
            <ListItem
              key={list._id}
              list={list}
              onUpdate={() => {
                toast.success('Item updated successfully!');
                mutate();
              }}
              onError={() => toast.error('Operation failed. Try again!')}
            />
          ))
        ) : (
          <p className="text-gray-500">No grocery items found.</p>
        )}
      </div>
    </div>
  );
}
