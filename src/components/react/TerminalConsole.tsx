import { useEffect, useState } from 'react';

const commands = ['whoami', 'inspect --focus', 'status --production'];

export default function TerminalConsole() {
  const [commandIndex, setCommandIndex] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const command = commands[commandIndex];
    if (typed.length < command.length) {
      const timer = window.setTimeout(() => setTyped(command.slice(0, typed.length + 1)), 58);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setTyped('');
      setCommandIndex((value) => (value + 1) % commands.length);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [typed, commandIndex]);

  return (
    <div className="terminal" aria-label="Interactive developer console">
      <div className="terminal-bar">
        <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
        <span>nb@production:~</span>
        <span className="secure">ssh · secure</span>
      </div>
      <div className="terminal-body">
        <div className="line muted">Last login: now from Astana, KZ</div>
        <div className="line command"><span>›</span> {typed}<b className="cursor" /></div>
        <div className="response">
          <div><small>IDENTITY</small><strong>Nurdaulet Beketov</strong></div>
          <div><small>ROLE</small><strong>Backend Software Engineer</strong></div>
          <div className="wide"><small>SPECIALIZATION</small><strong>Distributed Systems · AI Infrastructure · Go / Java</strong></div>
          <div><small>LOCATION</small><strong>Astana, Kazakhstan</strong></div>
          <div><small>SYSTEM</small><strong className="online"><i /> ONLINE</strong></div>
        </div>
      </div>
      <style>{`
        .terminal{overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:.55rem;background:rgba(5,5,5,.84);box-shadow:0 34px 80px rgba(0,0,0,.38);backdrop-filter:blur(12px)}
        .terminal-bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:2.7rem;padding:0 .85rem;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);color:#52525b;font:400 .58rem/1 'JetBrains Mono',monospace}
        .window-controls{display:flex;gap:.38rem}.window-controls i{width:.48rem;height:.48rem;border-radius:50%;background:#28282b}.secure{justify-self:end;color:#3f3f46}.terminal-body{min-height:20.5rem;padding:1.35rem clamp(1rem,3vw,1.7rem);font:400 .71rem/1.7 'JetBrains Mono',monospace}.line{min-height:1.25rem}.muted{color:#52525b}.command{margin-top:.6rem;color:white}.command span{color:#00ff88}.cursor{display:inline-block;width:.48rem;height:.85rem;margin-left:.2rem;translate:0 .12rem;background:#00ff88;animation:blink 1s steps(1) infinite}.response{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:1.3rem;border:1px solid rgba(255,255,255,.08)}
        .response div{display:flex;min-height:4.25rem;flex-direction:column;justify-content:center;gap:.42rem;padding:.75rem 1rem;border-right:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)}.response div:nth-child(even){border-right:0}.response div:nth-last-child(-n+2){border-bottom:0}.response .wide{grid-column:span 2;border-right:0}.response .wide+div{border-bottom:0}
        small{color:#52525b;font:500 .53rem/1 'JetBrains Mono',monospace;letter-spacing:.12em}strong{color:#d4d4d8;font-weight:400}.online{display:flex;align-items:center;gap:.4rem;color:#00ff88}.online i{width:.38rem;height:.38rem;border-radius:50%;background:#00ff88;box-shadow:0 0 10px rgba(0,255,136,.7)}@keyframes blink{50%{opacity:0}}
        @media(max-width:520px){.response{grid-template-columns:1fr}.response .wide{grid-column:span 1}.response div{border-right:0!important;border-bottom:1px solid rgba(255,255,255,.08)!important}.response div:last-child{border-bottom:0!important}.terminal-body{min-height:24rem}}
      `}</style>
    </div>
  );
}
