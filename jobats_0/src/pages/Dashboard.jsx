import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Resume ATS</h1>
      <button
        onClick={() => signOut(auth)}
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
