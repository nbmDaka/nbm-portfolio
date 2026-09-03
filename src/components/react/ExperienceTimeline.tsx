import { motion } from 'framer-motion';

export interface TimelineEntry {
  period: string[];
  company: string;
  role: string;
  summary: string;
  owned: string[];
  contributed: string[];
  metrics: string[];
  status: string;
}

interface Props {
  entries: TimelineEntry[];
  labels: { owned: string; contributed: string };
}

export default function ExperienceTimeline({ entries, labels }: Props) {
  return (
    <div className="timeline">
      <div className="rail" aria-hidden="true" />
      {entries.map((entry, index) => (
        <motion.article key={`${entry.company}-${entry.period[0]}`} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: .55, delay: index * .08 }}>
          <div className="year"><span>{entry.period[0]}</span>{entry.period[0] !== entry.period[1] && <span className="to">→ {entry.period[1]}</span>}<i /></div>
          <div className="entry-main">
            <div className="entry-head"><div><span>{entry.company}</span><h3>{entry.role}</h3></div><code><i />{entry.status}</code></div>
            <p>{entry.summary}</p>
            <div className="ownership">
              <div><dt>{labels.owned}</dt><dd>{entry.owned.join('  ·  ')}</dd></div>
              <div><dt>{labels.contributed}</dt><dd>{entry.contributed.join('  ·  ')}</dd></div>
            </div>
            <ul>{entry.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
          </div>
        </motion.article>
      ))}
      <style>{`
        .timeline{position:relative;margin-top:4rem}.rail{position:absolute;top:0;bottom:0;left:6.85rem;width:1px;background:linear-gradient(#00ff88,rgba(255,255,255,.1) 45%,transparent)}article{position:relative;display:grid;grid-template-columns:7rem 1fr;padding-bottom:1px}.year{position:relative;display:flex;flex-direction:column;gap:.4rem;padding-top:2rem;color:#a1a1aa;font:500 .68rem/1 'JetBrains Mono',monospace}.year .to{color:#3f3f46}.year i{position:absolute;z-index:1;top:2.12rem;right:-.22rem;width:.45rem;height:.45rem;border:1px solid #00ff88;border-radius:50%;background:#050505;box-shadow:0 0 0 5px #050505}.entry-main{margin-left:clamp(1.5rem,5vw,5rem);padding:2rem 0 clamp(4rem,8vw,7rem);border-top:1px solid rgba(255,255,255,.1)}.entry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.entry-head span{color:#71717a;font:500 .65rem/1 'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.11em}.entry-head h3{margin:.65rem 0 0;font:520 clamp(1.55rem,3vw,2.4rem)/1 'Geist Variable',sans-serif;letter-spacing:-.04em}.entry-head code{display:flex;align-items:center;gap:.4rem;border:1px solid rgba(0,255,136,.2);border-radius:99px;padding:.43rem .6rem;color:#00ff88;font:500 .52rem/1 'JetBrains Mono',monospace;letter-spacing:.08em}.entry-head code i{width:.28rem;height:.28rem;border-radius:50%;background:#00ff88}.entry-main p{max-width:650px;margin:1.25rem 0 0;color:#a1a1aa;line-height:1.7}
        .ownership{margin-top:1.5rem;display:flex;flex-direction:column;gap:.55rem;border-left:1px solid rgba(0,255,136,.25);padding-left:1rem}.ownership div{display:grid;grid-template-columns:7.5rem 1fr;gap:.8rem;align-items:baseline}.ownership dt{color:#3f3f46;font:500 .53rem/1.6 'JetBrains Mono',monospace;letter-spacing:.1em}.ownership dd{margin:0;color:#d4d4d8;font-size:.74rem;line-height:1.6}
        .entry-main ul{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}.entry-main li{border-left:1px solid rgba(255,255,255,.16);padding:.15rem .7rem;color:#71717a;font:400 .64rem/1.3 'JetBrains Mono',monospace}@media(max-width:640px){.rail{left:2.8rem}article{grid-template-columns:3rem 1fr}.year{font-size:.56rem}.year i{right:-.22rem}.entry-main{margin-left:1.2rem}.entry-head{display:block}.entry-head code{width:max-content;margin-top:1rem}.ownership div{grid-template-columns:1fr;gap:.2rem}.entry-main li{font-size:.58rem}}
      `}</style>
    </div>
  );
}
