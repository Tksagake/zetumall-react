import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  useAuth("admin"); // Restrict access to admins

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </div>
  );
}
