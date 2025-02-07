'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import CreateForm from '@/components/GroceryList/CreateForm';
import ListItem from '@/components/GroceryList/ListItem';

const fetcher = url => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: lists, mutate } = useSWR('/api/grocery', fetcher);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Grocery Lists</h1>
      <CreateForm onSuccess={mutate} />

      <div className="mt-8 space-y-4">
        {Array.isArray(lists) && lists.map(list => (
          <ListItem key={list._id} list={list} onUpdate={mutate} />
        ))}
      </div>
    </div>
  );
}