"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} className="ml-auto">
        Sign out
      </Button>
    );
  }
  return (
    <Button onClick={() => signIn("google")} className="ml-auto">
      Sign in with Google
    </Button>
  );
}
