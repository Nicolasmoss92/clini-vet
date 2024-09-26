"use client";

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>
        <button
          onClick={() => signIn('google')}
          className="w-full py-2 px-4 border rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200"
        >
          <FcGoogle className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
