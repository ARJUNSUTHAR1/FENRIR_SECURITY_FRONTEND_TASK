"use client";

import { HelpCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function SupportPage() {
  return (
    <AppLayout>
      <PlaceholderPage
        icon={HelpCircle}
        title="Support"
        description="Get help from our security experts. Browse documentation, submit tickets, or chat live with our support team for hands-on assistance."
      />
    </AppLayout>
  );
}
