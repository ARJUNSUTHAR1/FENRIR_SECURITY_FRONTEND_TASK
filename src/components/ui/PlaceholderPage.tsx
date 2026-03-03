"use client";

import { type ElementType } from "react";

interface PlaceholderPageProps {
  icon: ElementType;
  title: string;
  description: string;
}

export function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] dark:bg-[#111111]">
      <div className="flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        <Icon size={18} className="text-teal" />
        <h1 className="text-base font-medium text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto mb-5">
            <Icon size={28} className="text-teal" />
          </div>
          <h2 className="text-xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">
            You're on <span className="text-teal">{title}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
