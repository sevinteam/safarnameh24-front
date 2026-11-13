'use client';

import StickyBox from 'react-sticky-box';

export default function Filters() {
  return (
    <StickyBox offsetTop={20} offsetBottom={20}>
      <div className="bg-sidebar bottom-0 hidden h-[90dvh] space-y-8 overflow-y-auto rounded-2xl border lg:block">
        {/* {Array.from({ length: 10 }).map((_, i) => (
          <div className="bg-secondary h-80">filters</div>
        ))} */}
      </div>
    </StickyBox>
  );
}
