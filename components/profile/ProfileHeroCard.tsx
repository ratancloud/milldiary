"use client";

import { CheckCircle2, Camera, UserPen, Mail } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileHeroCardProps {
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  image?: string | null;
}

export default function ProfileHeroCard({
  name,
  email,
  emailVerified,
  role,
  createdAt,
  image,
}: ProfileHeroCardProps) {
  return (
    <Card className="relative mx-auto max-w-7xl overflow-visible rounded-2xl border shadow-sm pt-0">
      {/* Header */}
      <div className="relative h-36 sm:h-44 rounded-2xl bg-linear-to-tr from-primary via-indigo-500 to-purple-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute -bottom-10 left-0 right-0 h-20 bg-background rounded-t-[55%]" />
      </div>

      {/* Avatar */}
      <div className="relative z-10 flex justify-center -mt-20 sm:-mt-24">
        <div className="rounded-full p-1 bg-linear-to-tr from-primary via-indigo-500 to-purple-600 shadow-xl">
          <Avatar className="h-32 w-32 sm:h-36 sm:w-36 border-4 border-background bg-background">
            <AvatarImage src={image ?? undefined} alt={name} />
            <AvatarFallback className="flex items-center justify-center text-3xl font-semibold text-primary">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content */}
      <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 text-center space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            {name}
          </h2>
          <p className="mt-1 flex items-center justify-center gap-2 text-sm sm:text-base text-muted-foreground">
            <Mail className="h-4 w-4 text-primary/80" />
            {email}
          </p>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          {emailVerified && (
            <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Email Verified
            </Badge>
          )}

          <span className="text-muted-foreground">
            Joined{" "}
            {createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>

          <Badge variant="outline" className="border-primary/40 text-primary">
            {role}
          </Badge>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 px-4 pb-6">
        <Button className="gap-2 w-full sm:w-auto">
          <UserPen className="h-4 w-4" />
          Edit Profile
        </Button>

        <Button
          variant="secondary"
          className="gap-2 w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Camera className="h-4 w-4" />
          Change Image
        </Button>
      </CardFooter>
    </Card>
  );
}
