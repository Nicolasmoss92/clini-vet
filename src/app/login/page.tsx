'use client';

import { OutlookSignInButton } from "@/components/login/Azure";
import { GoogleSignInButton } from "@/components/login/Google";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <GoogleSignInButton />
        <OutlookSignInButton />
      </div>
    </div>
  );
}
