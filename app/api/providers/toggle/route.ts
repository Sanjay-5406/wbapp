import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    // First time becoming a provider
    if (!existing) {
      const { data, error } = await supabase
        .from("providers")
        .insert({
          user_id: user.id,
          hostname: "Unknown",
          os: "Unknown",
          cpu: "Unknown",
          ram_gb: 0,
          is_online: true,
          accepting_jobs: true,
          jobs_completed: 0,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        provider: data,
      });
    }

    // Toggle provider status
    const { data, error } = await supabase
      .from("providers")
      .update({
        accepting_jobs: !existing.accepting_jobs,
        is_online: !existing.is_online,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      provider: data,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}