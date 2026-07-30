"use client";

import { useEffect, useState } from "react";

type Job = {
  id: string;
  job_name: string;
  filename: string;
  status: string;
  provider_id: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  result_path: string | null;
};

interface Props {
  initialJobs: Job[];
  userId: string;
}

export default function ManagerClient({
  initialJobs,
  userId,
}: Props) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const [jobName, setJobName] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  async function loadJobs() {
    const res = await fetch("/api/jobs/list");

    if (!res.ok) return;

    const data = await res.json();
    
    setJobs(data);
  }

  useEffect(() => {
    loadJobs();

    const interval = setInterval(loadJobs, 5000);

    return () => clearInterval(interval);
  }, []);

  async function uploadJob() {
    if (!file) {
      alert("Choose a file");
      return;
    }

    if (!jobName.trim()) {
      alert("Enter a job name");
      return;
    }
    
    setUploading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("jobName", jobName);
    formData.append("userId", userId);

    console.log("uploading jobs...")
    const res = await fetch("/api/jobs/create", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed");
      console.log(res)
      setUploading(false);
      return;
    }

    setFile(null);
    setJobName("");

    await loadJobs();

    setUploading(false);
  }

  function badge(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-900";

      case "running":
        return "bg-blue-200 text-blue-900";

      case "completed":
        return "bg-green-200 text-green-900";

      case "failed":
        return "bg-red-200 text-red-900";

      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="space-y-8">

      <div className="rounded-xl bg-white shadow p-6">

        <h2 className="text-xl text-black font-semibold mb-4">
          Queue New Job
        </h2>

        <div className="space-y-4 text-black">

          <input
            className="w-full rounded border p-3 text-black"
            placeholder="Job name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
          />

          <button
            onClick={uploadJob}
            disabled={uploading}
            className="rounded bg-black px-5 py-2 text-white"
          >
            {uploading ? "Uploading..." : "Queue Job"}
          </button>

        </div>

      </div>

      <div className="rounded-xl bg-white shadow">

        <div className="border-b p-5 text-black">

          <h2 className="text-xl font-semibold">
            Jobs
          </h2>

        </div>

        <table className="w-full text-black">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Job</th>
              <th className="p-3 text-left">Filename</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Provider</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Started</th>
              <th className="p-3 text-left">Finished</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {jobs.map((job) => (

              <tr key={job.id} className="border-t">

                <td className="p-3 font-medium">
                  {job.job_name}
                </td>

                <td className="p-3">
                  {job.filename}
                </td>

                <td className="p-3">
                  <span
                    className={`rounded px-3 py-1 text-sm ${badge(job.status)}`}
                  >
                    {job.status}
                  </span>
                </td>

                <td className="p-3">
                  {job.provider_id ?? "-"}
                </td>

                <td className="p-3">
                  {new Date(job.created_at).toLocaleString()}
                </td>

                <td className="p-3">
                  {job.started_at
                    ? new Date(job.started_at).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3">
                  {job.finished_at
                    ? new Date(job.finished_at).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">

                    <button
                      className="rounded bg-blue-500 px-3 py-1 text-white text-sm"
                      disabled
                    >
                      Logs
                    </button>

                    <button
                      className="rounded bg-red-500 px-3 py-1 text-white text-sm"
                      disabled
                    >
                      Cancel
                    </button>

                    <button
                      className="rounded bg-yellow-500 px-3 py-1 text-white text-sm"
                      disabled
                    >
                      Retry
                    </button>

                    <button
                      className="rounded bg-green-500 px-3 py-1 text-white text-sm"
                      disabled
                    >
                      Result
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}