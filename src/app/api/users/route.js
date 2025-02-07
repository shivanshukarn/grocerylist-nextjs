import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { authOptions } from '../auth/[...nextauth]/route';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await User.findById(session.user.id).select('-password');
  return NextResponse.json(user);
}

export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, phone, password } = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    return Response.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const file = data.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using a Promise wrapper
    const uploadImage = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "grocerylist/avatars" },
          async (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer); // End stream with the file buffer
      });

    const result = await uploadImage();

    // Update user profile with avatar URL
    const user = await User.findById(session.user.id);
    user.avatar = result.secure_url;
    await user.save();

    return NextResponse.json({ avatarUrl: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}