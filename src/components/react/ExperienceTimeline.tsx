import { motion } from 'framer-motion';

const entries = [
  {
    year: '2024', company: 'AML Academy', role: 'Production Engineer',
    summary: 'Built and operated national-scale testing infrastructure under intense concurrency.',
    metrics: ['3.5M+ users', '40K–50K concurrent', 'Java / Spring Boot'], status: 'SCALED',
  },
  {
    year: '2025', company: 'Rocky Rocks', role: 'AI Platform Engineer',
    summary: 'Designed retrieval and semantic matching systems that turn unstructured intent into relevant jobs.',
    metrics: ['RAG pipeline', 'Vector search', 'AI recommendations'], status: 'SHIPPED',
  },
  {
    year: '2025', company: 'Zanger', role: 'Production Engineer',
    summary: 'Owned the path from deployment to incident response across Linux production infrastructure.',
    metrics: ['Deployments', 'Linux infrastructure', 'Security response'], status: 'HARDENED',
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="timeline">
      <div className="rail" aria-hidden="true" />
      {entries.map((entry, index) => (
        <motion.article key={`${entry.company}-${entry.year}`} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12%' }} transition={{ duration: .55, delay: index * .08 }}>
          <div className="year"><span>{entry.year}</span><i /></div>
          <div className="entry-main">
            <div className="entry-head"><div><span>{entry.company}</span><h3>{entry.role}</h3></div><code><i />{entry.status}</code></div>
            <p>{entry.summary}</p>
            <ul>{entry.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
          </div>
        </motion.article>
      ))}
      <style>{`
        .timeline{position:relative;margin-top:4rem}.rail{position:absolute;top:0;bottom:0;left:6.85rem;width:1px;background:linear-gradient(#00ff88,rgba(255,255,255,.1) 45%,transparent)}article{position:relative;display:grid;grid-template-columns:7rem 1fr;padding-bottom:1px}.year{position:relative;padding-top:2rem;color:#71717a;font:500 .68rem/1 'JetBrains Mono',monospace}.year i{position:absolute;z-index:1;top:2.12rem;right:-.22rem;width:.45rem;height:.45rem;border:1px solid #00ff88;border-radius:50%;background:#050505;box-shadow:0 0 0 5px #050505}.entry-main{margin-left:clamp(1.5rem,5vw,5rem);padding:2rem 0 clamp(4rem,8vw,7rem);border-top:1px solid rgba(255,255,255,.1)}.entry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}.entry-head span{color:#71717a;font:500 .65rem/1 'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.11em}.entry-head h3{margin:.65rem 0 0;font:520 clamp(1.55rem,3vw,2.4rem)/1 'Geist Variable',sans-serif;letter-spacing:-.04em}.entry-head code{display:flex;align-items:center;gap:.4rem;border:1px solid rgba(0,255,136,.2);border-radius:99px;padding:.43rem .6rem;color:#00ff88;font:500 .52rem/1 'JetBrains Mono',monospace;letter-spacing:.08em}.entry-head code i{width:.28rem;height:.28rem;border-radius:50%;background:#00ff88}.entry-main p{max-width:650px;margin:1.25rem 0 1.5rem;color:#a1a1aa;line-height:1.7}.entry-main ul{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}.entry-main li{border-left:1px solid rgba(255,255,255,.16);padding:.15rem .7rem;color:#71717a;font:400 .64rem/1.3 'JetBrains Mono',monospace}@media(max-width:640px){.rail{left:2.8rem}article{grid-template-columns:3rem 1fr}.year span{writing-mode:vertical-rl}.year i{right:-.22rem}.entry-main{margin-left:1.2rem}.entry-head{display:block}.entry-head code{width:max-content;margin-top:1rem}.entry-main li{font-size:.58rem}}
      `}</style>
    </div>
  );
}
