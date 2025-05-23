import { withAuth } from "@workos-inc/authkit-nextjs";
import { PreferencesForm } from "@/components/preferences/preferences-form";

export default async function PreferencesPage() {
  await withAuth();

  return <PreferencesForm />;
} 