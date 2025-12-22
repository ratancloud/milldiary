"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, LogOut, Laptop, Smartphone, Shield } from "lucide-react";
import toast from "react-hot-toast";

/* shadcn */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formateIndDate } from "@/lib/helper";

/* Types */
type Session = typeof authClient.$Infer.Session.session;

interface ActiveSessionsCardProps {
  currentSessionId: string;
  enabled?: boolean;
}

export default function ActiveSessionsCard({
  currentSessionId,
}: ActiveSessionsCardProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await authClient.listSessions();
        if (res.data) setSessions(res.data);
      } catch {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  /* -------- Revoke -------- */
  const revokeSession = async (token: string, id: string) => {
    setRevokingId(id);
    const { error } = await authClient.revokeSession({ token });
    setRevokingId(null);

    if (error) return toast.error(error.message || "Failed to revoke");

    toast.success("Session revoked");
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Card className="rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold">Active Sessions</h3>
      </div>

      {/* Content */}
      <CardContent className="px-5 py-5 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No active sessions found.
          </p>
        ) : (
          sessions.map((s) => {
            const isCurrent = s.id === currentSessionId;
            const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(
              s.userAgent || ""
            );

            const browser = s.userAgent?.includes("Chrome")
              ? "Chrome"
              : s.userAgent?.includes("Firefox")
              ? "Firefox"
              : s.userAgent?.includes("Edg")
              ? "Edge"
              : s.userAgent?.includes("Safari")
              ? "Safari"
              : "Unknown";

            const expiry = formateIndDate(s.expiresAt)

            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 px-4 py-4"
              >
                {/* Left */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border bg-background p-2.5">
                    {isMobile ? (
                      <Smartphone className="h-5 w-5 text-primary" />
                    ) : (
                      <Laptop className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {isMobile ? "Mobile device" : "Desktop device"}
                      </p>
                      {isCurrent && (
                        <span className="text-xs font-medium text-green-600">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {browser} · IP {s.ipAddress || "127.0.0.1"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Expiry ·{" "}
                      <span className="font-medium text-foreground">
                        {expiry}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Action */}
                {!isCurrent && (
                  <Button
                    size="icon"
                    onClick={() => revokeSession(s.token, s.id)}
                    disabled={revokingId === s.id}
                    aria-label="Logout session"
                  >
                    {revokingId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
