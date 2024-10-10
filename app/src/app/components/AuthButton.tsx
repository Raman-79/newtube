import { signIn } from 'next-auth/react';

export default function AuthButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="bg-white text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100"
    >
      {/* <img src='/public/assests/icons8-google.svg' alt="Google" */}
      Sign in with Google🌏
    </button>
  );
}
