import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';

type NetworkProps = { mode?: 'hero' | 'lab' };

/**
 * Defers the Three.js chunk until the lab section approaches the viewport.
 * Keeps the initial page load free of WebGL code; the hero loads its own
 * instance eagerly since it renders above the fold.
 */
export default function LazyNetwork({ mode = 'lab' }: NetworkProps) {
  const host = useRef<HTMLDivElement>(null);
  const [Network, setNetwork] = useState<ComponentType<NetworkProps> | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import('./SystemNetwork').then((module) => setNetwork(() => module.default));
      },
      { rootMargin: '600px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="lazy-network">
      {Network ? (
        <Network mode={mode} />
      ) : (
        <div className="network-placeholder" aria-hidden="true">
          <span><i />LOADING TOPOLOGY…</span>
        </div>
      )}
      <style>{`
        .lazy-network{min-height:32rem}
        .network-placeholder{display:grid;min-height:32rem;place-items:center;border:1px solid rgba(255,255,255,.1);border-radius:.55rem;background:#070708}
        .network-placeholder span{display:flex;align-items:center;gap:.6rem;color:#52525b;font:500 .55rem/1 'JetBrains Mono',monospace;letter-spacing:.1em}
        .network-placeholder i{width:.4rem;height:.4rem;border-radius:50%;background:#00ff88;animation:pulse 1.2s ease-in-out infinite}
        @keyframes pulse{50%{opacity:.25}}
        @media(max-width:720px){.lazy-network,.network-placeholder{min-height:27rem}}
      `}</style>
    </div>
  );
}
