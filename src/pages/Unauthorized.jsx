import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold">403 – Access denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
      <Link to="/login" className="text-blue-600 hover:underline">
        Back to login
      </Link>
    </div>
  );
}