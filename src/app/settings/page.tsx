"use client";

import { Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SettingsPage() {
  return (
    <AppLayout>
      <PlaceholderPage
        icon={Settings}
        title="Settings"
        description="Configure your workspace, manage API keys, set up integrations with CI/CD pipelines, and control team access and permissions."
      />
    </AppLayout>
  );
}
