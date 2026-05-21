"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import { Shield, Trash2, UserCog } from "lucide-react";

import { fetcher } from "@/lib/fetcher";

export default function AdminPage() {
  const { data: usersData, mutate: mutateUsers } = useSWR("/api/admin/users", fetcher);
  const { data: disastersData, mutate: mutateDisasters } = useSWR("/api/disasters?limit=50", fetcher);

  const users = usersData?.users ?? [];
  const disasters = disastersData?.items ?? [];

  async function setRole(userId, role) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error || "Update failed");
      toast.success("User updated");
      await mutateUsers();
    } catch (e) {
      toast.error(e.message || "Update failed");
    }
  }

  async function deleteDisaster(id) {
    if (!confirm("Delete this report?")) return;
    try {
      const res = await fetch(`/api/disasters/${id}`, { method: "DELETE" });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error || "Delete failed");
      toast.success("Deleted");
      await mutateDisasters();
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center gap-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <Shield size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Admin panel</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Manage users and delete incorrect disaster reports.
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <UserCog size={18} className="text-blue-700 dark:text-blue-300" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Users</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-black/5 dark:border-white/10">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-900 dark:bg-white/10 dark:text-zinc-100">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setRole(u.id, "user")}
                          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold dark:border-white/10 dark:bg-zinc-950"
                        >
                          Set user
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole(u.id, "admin")}
                          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Set admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-zinc-600 dark:text-zinc-300">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Disaster reports</h2>
          <div className="mt-4 space-y-3">
            {disasters.map((d) => (
              <div key={d._id} className="rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">
                      {labelType(d.type)} • {d.location}
                    </div>
                    <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                      Severity: <span className="font-semibold">{d.severity}</span>
                      {typeof d.waveHeight === "number" ? ` • Wave: ${d.waveHeight} m` : ""}
                      {typeof d.tideLevel === "number" ? ` • Tide: ${d.tideLevel}` : ""}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {d.createdAt ? new Date(d.createdAt).toLocaleString() : "—"} • Source: {d.source || "—"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDisaster(d._id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {disasters.length === 0 && (
              <div className="text-sm text-zinc-600 dark:text-zinc-300">No reports yet.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function labelType(t) {
  const map = {
    tsunami: "Tsunami",
    cyclone: "Cyclone",
    high_waves: "High waves",
    tide: "Tide",
    storm_surge: "Storm surge",
    coastal_flooding: "Coastal flooding",
  };
  return map[t] || t || "—";
}

