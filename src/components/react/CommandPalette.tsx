import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Compass, Cpu, Download, Layers3, Mail, UserRound } from 'lucide-react';

export interface PaletteCommand {
  label: string;
  hint: string;
  href: string;
  icon: string;
}

interface Props {
  commands: PaletteCommand[];
  placeholder: string;
  label: string;
  empty: string;
}

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  user: UserRound,
  briefcase: BriefcaseBusiness,
  layers: Layers3,
  cpu: Cpu,
  compass: Compass,
  mail: Mail,
  download: Download,
};

export default function CommandPalette({ commands, placeholder, label, empty }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return commands;
    return commands.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(normalized));
  }, [query, commands]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    const click = () => setOpen(true);
    window.addEventListener('keydown', keydown);
    document.querySelectorAll('[data-open-command]').forEach((node) => node.addEventListener('click', click));
    return () => {
      window.removeEventListener('keydown', keydown);
      document.querySelectorAll('[data-open-command]').forEach((node) => node.removeEventListener('click', click));
    };
  }, []);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      window.setTimeout(() => input.current?.focus(), 30);
    } else {
      setQuery('');
      previouslyFocused.current?.focus();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    }
    if (event.key === 'Enter' && results[active]) window.location.href = results[active].href;
  };

  if (!open) return null;

  return (
    <div className="palette-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <section className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input-wrap">
          <span className="prompt">›</span>
          <input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} aria-label="Search commands" />
          <kbd>ESC</kbd>
        </div>
        <div className="palette-label">{label}</div>
        <div className="palette-results">
          {results.map((item, index) => {
            const Icon = icons[item.icon] ?? Compass;
            return (
              <a className={index === active ? 'active' : ''} href={item.href} key={item.href} onMouseEnter={() => setActive(index)}>
                <Icon size={15} />
                <span>{item.label}</span>
                <code>{item.hint}</code>
                <ArrowUpRight size={13} />
              </a>
            );
          })}
          {!results.length && <p className="empty">{empty}</p>}
        </div>
        <footer><span>↑↓ navigate</span><span>↵ open</span><span>⌘K toggle</span></footer>
      </section>
      <style>{`
        .palette-backdrop{position:fixed;z-index:90;inset:0;display:grid;place-items:start center;padding:18vh 1rem 1rem;background:rgba(0,0,0,.68);backdrop-filter:blur(8px)}
        .palette{width:min(620px,100%);overflow:hidden;border:1px solid rgba(255,255,255,.16);border-radius:.55rem;background:#0a0a0b;box-shadow:0 30px 90px rgba(0,0,0,.7)}
        .palette-input-wrap{display:flex;align-items:center;gap:.8rem;padding:1rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.09)}
        .prompt{color:#00ff88;font:500 1.25rem/1 'JetBrains Mono',monospace}.palette input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font:400 .9rem/1 'Inter',sans-serif}
        .palette input::placeholder{color:#52525b}.palette kbd{border:1px solid rgba(255,255,255,.12);border-radius:.25rem;padding:.3rem .4rem;color:#71717a;font:500 .56rem/1 'JetBrains Mono',monospace}
        .palette-label{padding:1rem 1rem .45rem;color:#52525b;font:500 .58rem/1 'JetBrains Mono',monospace;letter-spacing:.14em}
        .palette-results{padding:.35rem}.palette-results a{display:grid;grid-template-columns:1.25rem 1fr auto 1rem;align-items:center;gap:.6rem;padding:.75rem;border-radius:.3rem;color:#a1a1aa;text-decoration:none;font-size:.82rem}
        .palette-results a.active{background:rgba(255,255,255,.06);color:#fff}.palette-results a.active svg:first-child{color:#00ff88}.palette-results code{color:#52525b;font:400 .62rem/1 'JetBrains Mono',monospace}.empty{padding:2rem;color:#71717a;text-align:center;font-size:.8rem}
        .palette footer{display:flex;gap:1rem;padding:.75rem 1rem;border-top:1px solid rgba(255,255,255,.08);color:#52525b;font:400 .56rem/1 'JetBrains Mono',monospace}
      `}</style>
    </div>
  );
}
