import { withAuth } from "@workos-inc/authkit-nextjs";
import { CustomRulesSection } from "@/components/context/sections/custom-rules-section";

export default async function SettingsPage() {
  const { user } = await withAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <CustomRulesSection userId={user.id} />
    </div>
  );
}