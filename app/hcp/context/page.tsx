import { withAuth } from "@workos-inc/authkit-nextjs";
import { MyContext } from "@/components/context/my-context";

export default async function ContextPage() {
  const { user } = await withAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <MyContext userId={user.id} />
    </div>
  );
} 