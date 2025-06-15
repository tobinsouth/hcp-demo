import { withAuth } from "@workos-inc/authkit-nextjs";
import { MemoriesSection } from "@/components/context/sections/memories-section";

export default async function MemoriesPage() {
  const { user } = await withAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <MemoriesSection userId={user.id} />
    </div>
  );
} 