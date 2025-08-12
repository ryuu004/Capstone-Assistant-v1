import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'Database connected successfully!' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Failed to connect to the database.' },
      { status: 500 }
    );
  }
}