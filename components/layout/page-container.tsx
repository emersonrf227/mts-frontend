import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="aaaa h-[calc(100dvh-52px)]">
          <div className="h-full max-w-[100vw] p-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full max-w-[100vw] p-4 md:px-8">{children}</div>
      )}
    </>
  );
}
