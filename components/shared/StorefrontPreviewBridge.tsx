'use client';

import React, { useEffect } from 'react';

/**
 * StorefrontPreviewBridge
 * Mounts in RootLayout (app/layout.tsx).
 * When running inside the Theme Editor iframe (?preview=true), it:
 * 1. Announces STOREFRONT_PREVIEW_READY to parent Puck editor.
 * 2. Freezes accidental link and button navigations (Select-to-Edit mode like Shopify Dawn).
 * 3. Dispatches PUCK_BLOCK_SELECTED to parent editor when any section/block is clicked.
 * 4. Listens for PUCK_BLOCK_HIGHLIGHT and PUCK_BLOCK_SCROLL from Puck to scroll the canvas.
 * 5. Notifies parent editor via STOREFRONT_NAVIGATE if user explicitly navigates across pages.
 */
export function StorefrontPreviewBridge() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isPreview =
      window.location.search.includes('preview=true') ||
      (window.self !== window.top && window.parent !== window);

    if (!isPreview) return;

    // 1. Announce ready to parent Puck editor
    try {
      window.parent.postMessage({ type: 'STOREFRONT_PREVIEW_READY' }, '*');
    } catch (e) {
      // Ignore cross-origin error if any
    }

    // 2. Listen for messages from parent Puck editor
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'PUCK_BLOCK_HIGHLIGHT' ||
        event.data?.type === 'PUCK_BLOCK_SCROLL'
      ) {
        const idx = typeof event.data.index === 'number' ? event.data.index : null;
        if (idx !== null) {
          const el = document.querySelector(`[data-puck-index="${idx}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add momentary highlight pulse
            el.classList.add('ring-2', 'ring-sky-500', 'ring-offset-2');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-sky-500', 'ring-offset-2');
            }, 1200);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // 3. Freeze all button and link navigations in preview mode
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest('a');
      const button = target.closest('button');

      // Check if clicked element or its parent is part of a Puck section
      const sectionEl = target.closest('[data-puck-index]');
      if (sectionEl) {
        const idxAttr = sectionEl.getAttribute('data-puck-index');
        if (idxAttr !== null) {
          const idx = parseInt(idxAttr, 10);
          if (!isNaN(idx)) {
            window.parent.postMessage(
              { type: 'PUCK_BLOCK_SELECTED', index: idx },
              '*'
            );
          }
        }
      }

      // Freeze button / link default actions so preview doesn't navigate away unexpectedly
      if (link || button) {
        e.preventDefault();
        e.stopPropagation();

        // If it's a navigational link (e.g., in Header menu or category card)
        // tell parent editor about destination in case user wanted to switch templates
        const href = link?.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          window.parent.postMessage(
            { type: 'STOREFRONT_NAVIGATE', path: href },
            '*'
          );
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  return null;
}
