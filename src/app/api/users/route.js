import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findById(session.user.id).select('-password');
  return NextResponse.json(user);
}

export async function PUT(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      body,
      { new: true }
    ).select('-password');
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}