"use client";

import { Bell } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function NotificationsPage() {
  return (
    <AppLayout>
      <PlaceholderPage
        icon={Bell}
        title="Notifications"
        description="Stay in the loop with real-time alerts for new findings, scan completions, and critical vulnerability reports sent straight to your inbox or Slack."
      />
    </AppLayout>
  );
}
