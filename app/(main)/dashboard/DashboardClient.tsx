"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Construction } from "lucide-react";

const DashboardClient = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <Card className="max-w-lg w-full text-center shadow-sm">
          <CardContent className="py-10 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <Construction className="h-12 w-12 text-muted-foreground" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold">Dashboard Coming Soon</h1>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              We are working on a powerful dashboard with insights, analytics,
              and summaries to help you manage your mill data more efficiently.
            </p>

            {/* Action */}
            <div className="flex justify-center pt-2">
              <Link href="/mill-data">
                <Button className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Go to Mill Data
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default DashboardClient;
