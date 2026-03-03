"use client";

import { FolderKanban } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export default function ProjectsPage() {
  return (
    <AppLayout>
      <PlaceholderPage
        icon={FolderKanban}
        title="Projects"
        description="Organize your security scans into projects. Group targets, share findings, and track progress across your team — all in one place."
      />
    </AppLayout>
  );
}
