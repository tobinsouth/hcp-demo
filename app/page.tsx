import { LandingPage } from "@/components/landing-page/landing-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <LandingPage />
        </Suspense>
      </main>
    </div>
  );
}
