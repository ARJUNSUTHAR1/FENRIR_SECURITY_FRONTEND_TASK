"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#161616]">
      <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-20 hidden sm:block" />
          <Skeleton className="h-7 w-20 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3.5 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-white/[0.06] border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-3 sm:px-5 lg:px-6 py-3 sm:py-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <div className="flex items-end gap-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3 bg-[#F5F5F5] dark:bg-[#111111]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 flex-1 rounded-xl" />
          <Skeleton className="h-8 w-16 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 bg-[#F5F5F5] dark:bg-[#111111] pt-1">
        <div className="flex-1 min-h-0 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#161616] z-10">
                <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <th key={i} className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                      <Skeleton className="h-3 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <tr key={i}>
                    <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                      <Skeleton className="h-2 w-24 rounded-full" />
                    </td>
                    <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                      </div>
                    </td>
                    <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                      <Skeleton className="h-3 w-20 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 border-t border-gray-100 dark:border-white/[0.06]">
            <Skeleton className="h-3 w-32" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScanDetailSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#161616] overflow-y-auto lg:overflow-hidden">
      <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 hidden sm:block" />
          <Skeleton className="h-8 w-20 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 sm:px-6 sm:py-4 bg-[#F5F5F5] dark:bg-[#111111]">
        <div className="lg:flex-1 lg:min-h-0 flex flex-col rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] overflow-hidden">
          <div className="flex-shrink-0 h-[46px] flex items-center gap-1 px-4 sm:px-5 border-b border-gray-200 dark:border-white/[0.06]">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-lg" />
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="mb-3">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:flex-1 lg:min-h-0 flex flex-col rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-[#111111] overflow-hidden">
          <div className="flex-shrink-0 h-[46px] flex items-center px-4 sm:px-5 border-b border-gray-200 dark:border-white/[0.06]">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4 p-3 rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
