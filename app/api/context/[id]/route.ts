import { NextResponse } from 'next/server';
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getHumanContextById, updateHumanContext } from '@/lib/humanContext';
import type { HumanContextData } from '@/lib/humanContext';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  routeContext: RouteContext
) {
  try {
    const { user } = await withAuth();
    const { id } = await routeContext.params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userContext = await getHumanContextById(id);
    
    if (!userContext) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    return NextResponse.json(userContext);
  } catch (error) {
    console.error('Error getting user context:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  routeContext: RouteContext
) {
  try {
    const { user } = await withAuth();
    const { id } = await routeContext.params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json() as HumanContextData;
    const userContext = await updateHumanContext(id, data);
    
    return NextResponse.json(userContext);
  } catch (error) {
    console.error('Error updating user context:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 