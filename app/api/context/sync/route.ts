import { NextResponse } from 'next/server';
import { withAuth } from "@workos-inc/authkit-nextjs";
import { syncUserIdentity } from '@/lib/humanContext';

export async function POST() {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const context = await syncUserIdentity(user);
    return NextResponse.json(context);
  } catch (error) {
    console.error('Error syncing user identity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 