import React, { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 960px)';

export default function useIsMobile(breakpoint = MOBILE_QUERY) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(breakpoint).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(breakpoint);
    const onChange = (event) => setIsMobile(event.matches);
    setIsMobile(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [breakpoint]);

  return isMobile;
}
