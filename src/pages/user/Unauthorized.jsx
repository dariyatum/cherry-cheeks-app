import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-serif text-4xl text-gray-900">403 – Access denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-cherry px-6 py-3 text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}