import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ConnectPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md mt-8">
        <Link href="/context">
          <Button variant="ghost" className="mb-6">
            ← Back
          </Button>
        </Link>
        <Card className="p-8 flex flex-col items-center gap-4 shadow-lg border border-neutral-800 bg-neutral-950">
          <h1 className="text-2xl font-bold mb-2 text-foreground">Connect to MCP Servers</h1>
          <p className="text-neutral-400 text-center">
            Here you will find instructions and options to connect to MCP servers. This page will be populated soon.
          </p>
        </Card>
      </div>
    </div>
  );
} 