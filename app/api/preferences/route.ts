import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(preferences || {});
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        name: data.name,
        language: data.language,
        tone: data.tone,
        interests: data.interests,
        apiKey: data.apiKey,
      },
      create: {
        userId: user.id,
        name: data.name,
        language: data.language,
        tone: data.tone,
        interests: data.interests,
        apiKey: data.apiKey,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 