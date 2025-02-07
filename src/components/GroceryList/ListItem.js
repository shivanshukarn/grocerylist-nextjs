'use client';
import { useState } from 'react';

export default function ListItem({ list, onUpdate }) {
  const [items, setItems] = useState(list.items);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ name: '', quantity: 0 });

  // ✅ Toggle Item Completion
  const toggleItemStatus = async (listId, itemId, index) => {
    try {
      const updatedItems = [...items];
      updatedItems[index].completed = !updatedItems[index].completed;

      const response = await fetch(`/api/grocery?listId=${listId}&itemId=${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedItems[index].completed }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setItems(updatedItems);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // ✅ Enable Edit Mode
  const startEdit = (index, item) => {
    setEditIndex(index);
    setEditData({ name: item.name, quantity: item.quantity });
  };

  // ✅ Save Edited Item
  const saveEdit = async (listId, itemId, index) => {
    try {
      const updatedItems = [...items];
      updatedItems[index].name = editData.name;
      updatedItems[index].quantity = editData.quantity;

      const response = await fetch(`/api/grocery?listId=${listId}&itemId=${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error('Failed to update item');

      setItems(updatedItems);
      setEditIndex(null);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // ✅ Delete an Item
  const deleteItem = async (listId, itemId, index) => {
    try {
      const response = await fetch(`/api/grocery?listId=${listId}&itemId=${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setItems(prevItems => prevItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // ✅ Delete the entire list
  const deleteList = async () => {
    try {
      const res = await fetch(`/api/grocery?listId=${list._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete list');
      onUpdate(); // Refresh UI after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between">
      <h3 className="font-medium text-gray-900">{new Date(list.date).toDateString()}</h3>
      <button onClick={deleteList} className="text-red-500 hover:text-red-700">🗑 Delete List</button>
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item, index) => (
          <div key={item._id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
            {editIndex === index ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="border p-1 rounded"
                />
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={e => setEditData({ ...editData, quantity: Number(e.target.value) })}
                  className="border p-1 rounded w-16"
                />
                <button onClick={() => saveEdit(list._id, item._id, index)} className="bg-green-500 text-white px-2 py-1 rounded">
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className={`text-lg ${item.completed ? 'line-through text-gray-500' : 'text-black'}`}>
                  {item.name} ({item.quantity})
                </span>
                <button onClick={() => startEdit(index, item)} className="text-blue-500">✏️</button>
              </div>
            )}

            <div className="flex space-x-2">
              <button 
                onClick={() => toggleItemStatus(list._id, item._id, index)}
                className={`px-2 py-1 rounded ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                {item.completed ? '✔ Taken' : 'Take'}
              </button>
              <button onClick={() => deleteItem(list._id, item._id, index)} className="text-red-500">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
