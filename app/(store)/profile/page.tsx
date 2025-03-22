import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  useAuth("customer"); // Restrict access to customers

  return (
    <div>
      <h1 className="text-3xl font-bold">Your Profile</h1>
    </div>
  );
}
