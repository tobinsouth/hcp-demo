import { getSignInUrl, withAuth } from "@workos-inc/authkit-nextjs";
import { PreferencesForm } from "@/components/preferences/preferences-form";

export default async function PreferencesPage() {
  const { user } = await withAuth();
 
  
    return <div>Hello</div>;
} 