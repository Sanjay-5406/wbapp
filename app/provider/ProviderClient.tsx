"use client";

import { useState } from "react";

type Provider = {
  id: string;
  hostname: string;
  os: string;
  cpu: string;
  ram_gb: number;
  is_online: boolean;
  accepting_jobs: boolean;
  jobs_completed: number;
  current_job: string | null;
};

interface Props {
  userId: string;
  initialProvider: Provider | null;
}

export default function ProviderClient({
  userId,
  initialProvider,
}: Props) {
  const [provider, setProvider] = useState<Provider | null>(
    initialProvider
  );

  const [loading, setLoading] = useState(false);

  async function toggleProvider() {
    setLoading(true);

    const res = await fetch("/api/providers/toggle", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setProvider(data.provider);
    setLoading(false);
  }

  return (
    <div className="space-y-6 text-black">

      <div className="rounded-xl bg-white shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Provider Status
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Status</p>

            <p
              className={`font-semibold text-lg ${
                provider?.accepting_jobs
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {provider?.accepting_jobs
                ? "🟢 Accepting Jobs"
                : "🔴 Offline"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Current Job</p>

            <p className="font-semibold">
              {provider?.current_job ?? "None"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Hostname</p>

            <p>{provider?.hostname ?? "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Operating System</p>

            <p>{provider?.os ?? "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">CPU</p>

            <p>{provider?.cpu ?? "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">RAM</p>

            <p>
              {provider?.ram_gb
                ? `${provider.ram_gb} GB`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Jobs Completed
            </p>

            <p>{provider?.jobs_completed ?? 0}</p>
          </div>

        </div>

        <button
          onClick={toggleProvider}
          disabled={loading}
          className={`mt-8 rounded-lg px-6 py-3 text-white ${
            provider?.accepting_jobs
              ? "bg-red-600"
              : "bg-green-600"
          }`}
        >
          {loading
            ? "Please wait..."
            : provider?.accepting_jobs
            ? "Stop Providing"
            : "Become a Provider"}
        </button>

      </div>

    </div>
  );
}