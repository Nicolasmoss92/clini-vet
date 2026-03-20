'use client';

import { signIn } from "next-auth/react";

export function OutlookSignInButton() {
  return (
    <button
      className="w-full p-2 bg-blue-700 text-white rounded hover:bg-blue-800"
      onClick={() => signIn('azure-ad')}
    >
      Login with Outlook
    </button>
  );
}
