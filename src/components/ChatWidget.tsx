'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: { run: (config: Record<string, string>) => void };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $chatwoot?: Record<string, any>;
    loadChatwoot?: () => void;
  }
}

export default function ChatWidget() {
  const loaded = useRef(false);

  useEffect(() => {
    const loadChatwoot = () => {
      if (loaded.current) return;
      loaded.current = true;

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
    };

    // Expose globally so MessengerPopup can trigger it
    window.loadChatwoot = loadChatwoot;

    // Fallback: load after 15 seconds
    const timer = setTimeout(loadChatwoot, 15000);

    // Load on scroll past 50%
    const handleScroll = () => {
      if (window.scrollY > document.body.scrollHeight * 0.5) {
        loadChatwoot();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
