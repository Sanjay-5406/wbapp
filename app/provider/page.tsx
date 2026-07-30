import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProviderClient from "@/app/provider/ProviderClient";

export default async function ProviderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl text-black font-bold mb-8 ">
          Provider Dashboard
        </h1>

        <ProviderClient
          userId={user.id}
          initialProvider={provider}
        />
      </div>
    </div>
  );
}