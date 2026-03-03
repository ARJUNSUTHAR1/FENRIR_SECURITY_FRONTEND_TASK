"use client";

import { Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SchedulePage() {
  return (
    <AppLayout>
      <PlaceholderPage
        icon={Calendar}
        title="Schedule"
        description="Set up recurring scans on a schedule that fits your workflow. Run daily, weekly, or custom intervals and never miss a vulnerability window."
      />
    </AppLayout>
  );
}
