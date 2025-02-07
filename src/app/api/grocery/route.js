import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import GroceryList from '@/lib/models/GroceryList';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lists = await GroceryList.find({
    $or: [
      { user: session.user.id },
      { sharedWith: session.user.id }
    ]
  }).populate('user', 'name avatar');

  return NextResponse.json(lists);
}

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const list = await GroceryList.create({
      ...body,
      user: session.user.id,
      sharedWith: []
    });
    
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId'); // Grocery list ID
    const itemId = searchParams.get('itemId'); // Item ID
    const { name, quantity, completed } = await request.json();

    if (!listId || !itemId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // ✅ Update only the specific item within the array
    const updatedList = await GroceryList.findOneAndUpdate(
      { _id: listId, 'items._id': itemId },
      {
        $set: {
          'items.$.name': name,
          'items.$.quantity': quantity,
          'items.$.completed': completed,
        },
      },
      { new: true }
    );

    if (!updatedList) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, list: updatedList });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const listId = searchParams.get('listId');
    const itemId = searchParams.get('itemId');

    if (!listId) {
      return NextResponse.json({ error: 'listId is required' }, { status: 400 });
    }

    if (itemId) {
      // ✅ Delete a single item
      const updatedList = await GroceryList.findOneAndUpdate(
        { _id: listId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );

      if (!updatedList) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, list: updatedList });
    } else {
      // ✅ Delete the entire grocery list
      const deletedList = await GroceryList.findByIdAndDelete(listId);
      if (!deletedList) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}