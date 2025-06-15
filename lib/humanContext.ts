import { PrismaClient } from '@prisma/client';
import { User } from "./with-authkit";
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

/**
 * Types for the human context data
 */
export type IdentityData = {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  city?: string;
};

export type HumanContextData = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  city?: string;
  publicAbout?: string;
  privateAbout?: string;
  privateMemories?: string[];
  privatePreferences?: Record<string, any>;
  secureInfo?: Record<string, any>;
  customRules?: string;
};

/**
 * Syncs the user's identity data from AuthKit with the human context database
 * Creates a new entry if one doesn't exist, updates if it does
 */
export async function syncUserIdentity(user: User) {
  const identityData: IdentityData = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    // Note: country and city are not provided by AuthKit by default
    // They would need to be set separately if needed
  };

  // Check if user already exists by id
  const existingContext = await prisma.HumanContext.findUnique({
    where: { id: user.id },
  });

  if (existingContext) {
    // Update existing user's identity data by id
    return prisma.HumanContext.update({
      where: { id: user.id },
      data: {
        firstName: identityData.firstName,
        lastName: identityData.lastName,
        email: identityData.email,
        // Don't update id as it's the unique identifier
      },
    });
  } else {
    // Create new user context with id
    return prisma.HumanContext.create({
      data: {
        id: user.id,
        ...identityData,
        // Initialize other fields with empty values
        publicAbout: "",
        privateAbout: "",
        privateMemories: [],
        privatePreferences: {},
        secureInfo: {},
        customRules: "",
      },
    });
  }
}

/**
 * Creates a new user context with a random ID
 */
export async function createNewUserContext(data: HumanContextData) {
  const userId = randomUUID();
  return prisma.HumanContext.create({
    data: {
      id: userId,
      ...data,
      publicAbout: data.publicAbout || "",
      privateAbout: data.privateAbout || "",
      privateMemories: data.privateMemories || [],
      privatePreferences: data.privatePreferences || {},
      secureInfo: data.secureInfo || {},
      customRules: data.customRules || "",
    },
  });
}

/**
 * Retrieves a human context by ID
 */
export async function getHumanContextById(id: string) {
  return prisma.HumanContext.findUnique({
    where: { id },
  });
}

/**
 * Updates a human context by ID, creates it if it doesn't exist
 */
export async function updateHumanContext(id: string, data: Partial<HumanContextData>) {
  // First check if the context exists
  const existingContext = await prisma.HumanContext.findUnique({
    where: { id },
  });

  if (!existingContext) {
    // If it doesn't exist, create it
    return prisma.HumanContext.create({
      data: {
        id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        country: data.country,
        city: data.city,
        publicAbout: data.publicAbout || "",
        privateAbout: data.privateAbout || "",
        privateMemories: data.privateMemories || [],
        privatePreferences: data.privatePreferences || {},
        secureInfo: data.secureInfo || {},
        customRules: data.customRules || "",
      },
    });
  }

  // If it exists, update it
  return prisma.HumanContext.update({
    where: { id },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.email && { email: data.email }),
      ...(data.country && { country: data.country }),
      ...(data.city && { city: data.city }),
      publicAbout: data.publicAbout,
      privateAbout: data.privateAbout,
      privateMemories: data.privateMemories,
      privatePreferences: data.privatePreferences,
      secureInfo: data.secureInfo,
      customRules: data.customRules,
    },
  });
}

/**
 * Deletes a human context by ID
 */
export async function deleteHumanContext(id: string) {
  return prisma.HumanContext.delete({
    where: { id },
  });
}

/**
 * Updates only the private memories array
 */
export async function updatePrivateMemories(id: string, memories: string[]) {
  return prisma.HumanContext.update({
    where: { id },
    data: { privateMemories: memories },
  });
}

/**
 * Updates only the private preferences
 */
export async function updatePrivatePreferences(id: string, preferences: Record<string, any>) {
  return prisma.HumanContext.update({
    where: { id },
    data: { privatePreferences: preferences },
  });
}

/**
 * Updates only the secure information
 */
export async function updateSecureInfo(id: string, secureInfo: Record<string, any>) {
  return prisma.HumanContext.update({
    where: { id },
    data: { secureInfo },
  });
}

export async function getHumanContextFromApi(userId: string): Promise<HumanContextData> {
  const response = await fetch(`/api/context/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch context data: ${response.statusText}`);
  }
  return response.json();
}

export async function updateHumanContextViaApi(userId: string, data: HumanContextData): Promise<HumanContextData> {
  const response = await fetch(`/api/context/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update context data: ${response.statusText}`);
  }
  return response.json();
} 