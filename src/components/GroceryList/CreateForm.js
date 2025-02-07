'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  items: z.array(z.object({
    name: z.string().min(2, "Item name must be at least 2 characters"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    completed: z.boolean().default(false)
  })).min(1, "At least one item is required")
});

export default function CreateForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ name: '', quantity: 1, completed: false }] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data) => {
    const response = await fetch('/api/grocery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      onSuccess(); // Refresh grocery lists after adding
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Date Field */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Date</label>
        <input
          type="date"
          {...register('date')}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      {/* Items List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-gray-700 font-medium">Items</h3>
          <button
            type="button"
            onClick={() => append({ name: '', quantity: 1, completed: false })}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add Item
          </button>
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            {/* Item Name */}
            <input
              type="text"
              {...register(`items.${index}.name`)}
              placeholder="Item Name"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.items?.[index]?.name && (
              <p className="text-red-500 text-sm">{errors.items[index].name.message}</p>
            )}

            {/* Quantity */}
            <input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="w-20 p-2 border rounded-md text-center"
              min="1"
            />
            {errors.items?.[index]?.quantity && (
              <p className="text-red-500 text-sm">{errors.items[index].quantity.message}</p>
            )}

            {/* Remove Item Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create List
      </button>
    </form>
  );
}
