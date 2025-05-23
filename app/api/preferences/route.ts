import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Temporary debug user ID
const DEBUG_USER_ID = "debug-user-123";

export async function GET() {
  try {
    // const { user } = await withAuth();
    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: DEBUG_USER_ID },
    });

    return NextResponse.json(preferences || {});
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // const { user } = await withAuth();
    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const data = await request.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: DEBUG_USER_ID },
      update: {
        name: data.name,
        language: data.language,
        tone: data.tone,
        interests: data.interests,
        apiKey: data.apiKey,
      },
      create: {
        userId: DEBUG_USER_ID,
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