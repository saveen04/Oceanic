"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import toast from "react-hot-toast";
import { User, Mail, Shield, Save, Loader2, Trash2, Key } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading, mutate } = useMe();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleUpdate(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      
      await mutate();
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setIsChangingPass(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed");
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsChangingPass(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Are you absolutely sure? This action is permanent and will delete all your data.")) return;
    
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      
      toast.success("Account deleted. Redirecting...");
      router.push("/signup");
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-2">
          <Shield size={12} />
          Account Security
        </div>
        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white">Profile Settings</h1>
        <p className="mt-2 text-lg font-bold text-zinc-800 dark:text-zinc-400">Manage your digital identity and security credentials.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Info */}
          <section className="jira-card">
            <h2 className="mb-8 flex items-center gap-3 text-xl font-black text-black dark:text-white">
              <User size={20} className="text-blue-600" />
              General Information
            </h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</label>
                  <input
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                  <input
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="jira-button-primary gap-2 px-8 py-3.5 shadow-xl shadow-blue-500/30"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span className="font-black uppercase tracking-widest">Update Profile</span>
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="jira-card">
            <h2 className="mb-8 flex items-center gap-3 text-xl font-black text-black dark:text-white">
              <Key size={20} className="text-blue-600" />
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Current Password</label>
                  <input
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">New Password</label>
                  <input
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-black outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="jira-button-secondary gap-2 px-8 py-3.5"
                >
                  {isChangingPass ? <Loader2 size={18} className="animate-spin" /> : <Key size={18} />}
                  <span className="font-black uppercase tracking-widest">Update Password</span>
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="jira-card bg-zinc-50 dark:bg-white/5 border-none">
            <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">System Information</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Security Tier</span>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase text-white">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Data Node Since</span>
                <span className="text-sm font-black text-black dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Sync Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-emerald-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="jira-card border-red-500/20 bg-red-50/20 dark:bg-red-950/10">
            <h3 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600">
              <Trash2 size={14} />
              Danger Zone
            </h3>
            <p className="mb-6 text-xs font-bold text-red-800 dark:text-red-400/80">
              Permanently purge your account and all associated data from the Oceanic network.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full rounded-xl bg-red-600 py-3.5 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              Terminate Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
