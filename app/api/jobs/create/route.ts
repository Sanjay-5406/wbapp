import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
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

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const jobName = formData.get("jobName") as string;

    if (!file || !jobName) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop();

    const storagePath =
      `${user.id}/${Date.now()}-${jobName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("jobs")
      .upload(storagePath, file, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);

      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabase
      .from("jobs")
      .insert({
        created_by: user.id,
        job_name: jobName,
        filename: file.name,
        storage_path: storagePath,
        status: "pending",
      });

    if (dbError) {
      console.error(dbError);

      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );

  }
}