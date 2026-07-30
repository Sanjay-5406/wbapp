import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ManagerClient from "@/app/manager/ManagerClient";

export default async function ManagerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // TODO:
  // Replace this with your admin check later.
  // Example:
  // const { data: profile } = await supabase
  //   .from("profiles")
  //   .select("role")
  //   .eq("id", user.id)
  //   .single();
  //
  // if (profile?.role !== "admin") {
  //   redirect("/");
  // }

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">
          Manager Dashboard
        </h1>

        <ManagerClient
          initialJobs={jobs ?? []}
          userId={user.id}
        />
      </div>
    </div>
  );
}