'use client'

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ymReady, setYmReady] = useState(false);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.async = true;
    script.onload = () => {
      setYmReady(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup function - not strictly necessary here, but good practice
    };
  }, []);

  useEffect(() => {
    if (ymReady && typeof ym === 'function') {
      const url = `${pathname}?${searchParams}`;
      ym(99411982, 'hit', url);
    }
  }, [ymReady, pathname, searchParams]);


  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            ym(99411982, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              ecommerce: "dataLayer"
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/99411982"
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
