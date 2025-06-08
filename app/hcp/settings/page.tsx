import { UserProfile, WorkOsWidgets } from "@workos-inc/widgets";
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function SettingsPage() {
    const { user } = await withAuth();

  return (
    <WorkOsWidgets>
      <UserProfile authToken={user?.authToken} />
    </WorkOsWidgets>
  )
}