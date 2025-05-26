import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Temporary debug user ID
const DEBUG_USER_ID = "debug-user-123";

export async function GET() {
  try {
    const { user } = await withAuth();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
    const { user } = await withAuth();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: DEBUG_USER_ID },
      update: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        generalPreferences: data.generalPreferences,
        privacySettings: data.privacySettings,
        dataSharing: data.dataSharing,
        apiKeys: data.apiKeys,
        tokens: data.tokens,
      },
      create: {
        userId: DEBUG_USER_ID,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        generalPreferences: data.generalPreferences,
        privacySettings: data.privacySettings,
        dataSharing: data.dataSharing,
        apiKeys: data.apiKeys,
        tokens: data.tokens,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 