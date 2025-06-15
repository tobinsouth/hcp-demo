import { withAuth } from "@workos-inc/authkit-nextjs";
import { PreferencesSection } from "@/components/context/sections/preferences-section";

export default async function PreferencesPage() {
  const { user } = await withAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <PreferencesSection userId={user.id} />
    </div>
  );
} 