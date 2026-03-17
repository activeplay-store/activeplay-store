'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: { run: (config: Record<string, string>) => void };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $chatwoot?: Record<string, any>;
  }
}

export default function ChatWidget() {
  useEffect(() => {
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'ru',
      type: 'standard',
    };

    const BASE_URL = 'https://chat.activeplay.games';
    const script = document.createElement('script');
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: 'CRRDuUyh65jLcZ9S25C4mA1C',
        baseUrl: BASE_URL,
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
