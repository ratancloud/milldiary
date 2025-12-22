"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Key } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import ProfileHeroCard from "@/components/profile/ProfileHeroCard";
import ActiveSessionsCard from "@/components/profile/ActiveSessionsCard";
import ProfilePageSkeleton from "@/components/skelton/ProfilePageSkeleton";

export default function ProfileClient() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
  });

  /* ---------- Auth Guard ---------- */
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in.");
      router.replace("/login");
    }
  }, [data, isPending, router]);

  /* ---------- Password Change ---------- */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.current.trim()) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordData.new.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordData.new.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);

    const { error } = await authClient.changePassword({
      currentPassword: passwordData.current,
      newPassword: passwordData.new,
      revokeOtherSessions: true,
    });

    setIsUpdatingPassword(false);

    if (error) {
      toast.error(error.message || "Update failed");
      return;
    }

    toast.success("Password updated. Other sessions revoked.");
    setPasswordData({ current: "", new: "" });
  };

  if (isPending) {
    return <ProfilePageSkeleton />;
  }

  if (!data?.user || !data.session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold rounded-md border bg-muted px-3 py-1">
          Profile
        </h1>
      </div>

      {/* Profile Card */}
      <ProfileHeroCard
        name={data.user.name || "Admin"}
        email={data.user.email}
        emailVerified={data.user.emailVerified}
        role="User"
        createdAt={new Date(data.user.createdAt)}
        image={data.user.image}
      />

      {/* Password & Security */}
      <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 px-4 sm:px-6 py-4 border-b bg-muted/30">
          <Key className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-base">Password & Security</h3>
            <p className="text-xs text-muted-foreground">
              Changing password revokes all other sessions
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <CardContent className="px-4 sm:px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, current: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="New Password"
                minLength={8}
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-muted/30 px-4 sm:px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Active Sessions */}
      <ActiveSessionsCard currentSessionId={data.session.id} />
    </div>
  );
}
