'use client';

import StickyBox from 'react-sticky-box';

// ------------------------------

export function Filters() {
  return (
    <StickyBox offsetTop={30} offsetBottom={30} bottom>
      <div className="bg-card hidden h-dvh rounded-2xl border lg:block">
        {/* {Array.from({ length: 10 }).map((_, i) => (
          <div className="bg-secondary h-80">filters</div>
        ))} */}
      </div>
    </StickyBox>
  );
}
