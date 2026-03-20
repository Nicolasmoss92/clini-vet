'use client';

import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <button
      className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => signIn('google')}
    >
      Login with Google
    </button>
  );
}