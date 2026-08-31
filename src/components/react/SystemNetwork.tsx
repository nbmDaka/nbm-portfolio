import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';

type NodeData = {
  id: string;
  label: string;
  type: string;
  purpose: string;
  role: string;
  why: string;
  position: [number, number, number];
  accent?: 'green' | 'indigo';
};

const nodes: NodeData[] = [
  { id: 'edge', label: 'API LAYER', type: 'Gateway / Nginx', purpose: 'Single entry point for all client traffic', role: 'TLS termination, rate limiting, request routing', why: 'One controlled boundary keeps internal services simple and policies consistent', position: [-3.4, 1.3, 0] },
  { id: 'api', label: 'CORE API', type: 'Go Service', purpose: 'Low-latency orchestration of incoming requests', role: 'Coordinates calls between services and shapes responses', why: 'Go fits I/O-heavy services: cheap concurrency and a small latency footprint', position: [-1.2, .35, .35], accent: 'green' },
  { id: 'events', label: 'QUEUE', type: 'Message Queue / Kafka', purpose: 'Decouple producers from consumers', role: 'Durable event backbone for asynchronous workflows', why: 'Events survive consumer downtime; services scale and fail independently', position: [.7, 1.6, -.25] },
  { id: 'workers', label: 'SERVICES', type: 'Spring Boot Services', purpose: 'Execute domain logic', role: 'Stateless services — capacity scales by instance count', why: 'Mature ecosystem and predictable behavior under sustained load', position: [1.25, -.35, .2] },
  { id: 'data', label: 'DATABASE', type: 'PostgreSQL', purpose: 'Transactional source of truth', role: 'Owns critical state with ACID guarantees', why: 'Relational integrity plus real query-optimization headroom', position: [3.35, .95, -.15] },
  { id: 'vector', label: 'RETRIEVAL', type: 'AI Retrieval Layer', purpose: 'Semantic retrieval over unstructured data', role: 'Stores embeddings and serves nearest-neighbor search', why: 'Purpose-built indexes make similarity search fast at scale', position: [3.1, -1.15, .3], accent: 'indigo' },
  { id: 'ai', label: 'RAG', type: 'RAG Pipeline', purpose: 'Turn retrieval into grounded output', role: 'Context assembly, re-ranking, model inference', why: 'Grounding responses in retrieved data reduces hallucination', position: [.45, -1.75, -.2], accent: 'indigo' },
];

const links = [[0,1],[1,2],[1,3],[2,3],[3,4],[3,5],[5,6],[2,6]] as const;

function NetworkScene({ interactive, selected, onSelect }: { interactive: boolean; selected: string; onSelect: (id: string) => void }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * .18) * .075;
    group.current.position.y = Math.sin(clock.elapsedTime * .42) * .06;
  });

  return (
    <group ref={group}>
      {links.map(([from, to]) => (
        <Line key={`${from}-${to}`} points={[nodes[from].position, nodes[to].position]} color="#2b2b30" lineWidth={1} transparent opacity={.9} />
      ))}
      {nodes.map((node, index) => {
        const active = selected === node.id;
        const color = node.accent === 'indigo' ? '#6366f1' : node.accent === 'green' ? '#00ff88' : '#7c7c83';
        return (
          <group position={node.position} key={node.id}>
            <mesh onClick={(event) => { event.stopPropagation(); if (interactive) onSelect(node.id); }} onPointerOver={() => { if (interactive) document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = ''; }}>
              <sphereGeometry args={[active ? .16 : .115, 24, 24]} />
              <meshBasicMaterial color={active ? '#ffffff' : color} />
            </mesh>
            <mesh>
              <sphereGeometry args={[active ? .32 : .24, 24, 24]} />
              <meshBasicMaterial color={color} transparent opacity={active ? .13 : .055} depthWrite={false} />
            </mesh>
            <Html center position={[0, -.38, 0]} style={{ pointerEvents: 'none' }}>
              <div className={`node-tag ${active ? 'active' : ''}`}><span>{String(index + 1).padStart(2,'0')}</span>{node.label}</div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function SystemNetwork({ mode = 'hero' }: { mode?: 'hero' | 'lab' }) {
  const [selected, setSelected] = useState('api');
  const current = useMemo(() => nodes.find((node) => node.id === selected) ?? nodes[1], [selected]);
  const interactive = mode === 'lab';

  return (
    <div className={`network ${mode}`}>
      <Canvas camera={{ position: [0, 0, 8.5], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <NetworkScene interactive={interactive} selected={selected} onSelect={setSelected} />
        {interactive && <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.6} maxPolarAngle={Math.PI / 1.7} />}
      </Canvas>
      <div className="network-meta">
        <span><i /> LIVE TOPOLOGY</span><span>07 NODES / 08 LINKS</span>
      </div>
      {interactive && (
        <div className="node-selector" role="group" aria-label="Inspect a node">
          {nodes.map((node) => (
            <button key={node.id} type="button" className={selected === node.id ? 'active' : ''} onClick={() => setSelected(node.id)} aria-pressed={selected === node.id}>{node.label}</button>
          ))}
        </div>
      )}
      {interactive && (
        <aside className="inspector" aria-live="polite">
          <div><span className="index">NODE/{String(nodes.indexOf(current) + 1).padStart(2, '0')}</span><span className="healthy">HEALTHY</span></div>
          <h3>{current.label}</h3>
          <code>{current.type}</code>
          <dl>
            <div><dt>Purpose</dt><dd>{current.purpose}</dd></div>
            <div><dt>Role</dt><dd>{current.role}</dd></div>
            <div><dt>Why this tech</dt><dd>{current.why}</dd></div>
          </dl>
        </aside>
      )}
      <style>{`
        .network{position:relative;min-height:32rem;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:.55rem;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.035),transparent 55%),#070708}.network.hero{min-height:34rem;border:0;border-radius:0;background:transparent}.network canvas{position:absolute!important;inset:0}.network-meta{position:absolute;inset:auto 1rem 1rem;display:flex;justify-content:space-between;color:#52525b;font:500 .55rem/1 'JetBrains Mono',monospace;letter-spacing:.08em}.network-meta span:first-child{display:flex;align-items:center;gap:.5rem;color:#71717a}.network-meta i{display:block;width:.35rem;height:.35rem;border-radius:50%;background:#00ff88;box-shadow:0 0 10px rgba(0,255,136,.6)}.node-tag{display:flex;align-items:center;gap:.35rem;white-space:nowrap;color:#71717a;font:500 9px/1 'JetBrains Mono',monospace;letter-spacing:.08em;transition:color .2s}.node-tag span{color:#3f3f46}.node-tag.active{color:#fff}.inspector{position:absolute;left:1rem;bottom:3rem;width:min(18rem,calc(100% - 2rem));border:1px solid rgba(255,255,255,.12);border-radius:.35rem;background:rgba(8,8,9,.84);padding:1rem;backdrop-filter:blur(12px)}.inspector>div{display:flex;justify-content:space-between}.index,.healthy,.inspector code{font:500 .55rem/1 'JetBrains Mono',monospace;letter-spacing:.09em}.index{color:#52525b}.healthy{color:#00ff88}.inspector h3{margin:1rem 0 .45rem;font:520 1.35rem/1 'Geist Variable',sans-serif;letter-spacing:-.03em}.inspector code{color:#818cf8}.inspector dl{margin:.9rem 0 0;display:flex;flex-direction:column;gap:.65rem}.inspector dl div{display:grid;grid-template-columns:5.2rem 1fr;gap:.6rem;align-items:baseline}.inspector dt{color:#3f3f46;font:500 .5rem/1.5 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase}.inspector dd{margin:0;color:#a1a1aa;font-size:.73rem;line-height:1.5}.node-selector{position:absolute;top:1rem;left:50%;transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem;width:max-content;max-width:calc(100% - 2rem)}.node-selector button{border:1px solid rgba(255,255,255,.12);border-radius:99px;background:rgba(8,8,9,.62);padding:.42rem .62rem;color:#71717a;font:500 .52rem/1 'JetBrains Mono',monospace;letter-spacing:.06em;cursor:pointer;transition:border-color .15s,color .15s}.node-selector button:hover{border-color:rgba(255,255,255,.32);color:#fff}.node-selector button.active{border-color:rgba(0,255,136,.45);color:#00ff88}@media(max-width:720px){.network,.network.hero{min-height:27rem}.network-meta{font-size:.48rem}}
      `}</style>
    </div>
  );
}
