import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';

type NodeData = {
  id: string;
  label: string;
  type: string;
  description: string;
  position: [number, number, number];
  accent?: 'green' | 'indigo';
};

const nodes: NodeData[] = [
  { id: 'edge', label: 'EDGE', type: 'Gateway', description: 'Rate limiting, auth, request routing', position: [-3.4, 1.3, 0] },
  { id: 'api', label: 'API', type: 'Go Service', description: 'Low-latency orchestration layer', position: [-1.2, .35, .35], accent: 'green' },
  { id: 'events', label: 'KAFKA', type: 'Event Bus', description: 'Durable asynchronous event backbone', position: [.7, 1.6, -.25] },
  { id: 'workers', label: 'WORKERS', type: 'Java Services', description: 'Horizontally scalable domain workers', position: [1.25, -.35, .2] },
  { id: 'data', label: 'DATA', type: 'PostgreSQL', description: 'Transactional source of truth', position: [3.35, .95, -.15] },
  { id: 'vector', label: 'VECTOR', type: 'Vector Store', description: 'Semantic retrieval and embeddings', position: [3.1, -1.15, .3], accent: 'indigo' },
  { id: 'ai', label: 'AI', type: 'RAG Pipeline', description: 'Context assembly and model inference', position: [.45, -1.75, -.2], accent: 'indigo' },
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
        <aside className="inspector" aria-live="polite">
          <div><span className="index">NODE/{String(nodes.indexOf(current) + 1).padStart(2, '0')}</span><span className="healthy">HEALTHY</span></div>
          <h3>{current.label}</h3>
          <code>{current.type}</code>
          <p>{current.description}</p>
        </aside>
      )}
      <style>{`
        .network{position:relative;min-height:32rem;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:.55rem;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.035),transparent 55%),#070708}.network.hero{min-height:34rem;border:0;border-radius:0;background:transparent}.network canvas{position:absolute!important;inset:0}.network-meta{position:absolute;inset:auto 1rem 1rem;display:flex;justify-content:space-between;color:#52525b;font:500 .55rem/1 'JetBrains Mono',monospace;letter-spacing:.08em}.network-meta span:first-child{display:flex;align-items:center;gap:.5rem;color:#71717a}.network-meta i{display:block;width:.35rem;height:.35rem;border-radius:50%;background:#00ff88;box-shadow:0 0 10px rgba(0,255,136,.6)}.node-tag{display:flex;align-items:center;gap:.35rem;white-space:nowrap;color:#71717a;font:500 9px/1 'JetBrains Mono',monospace;letter-spacing:.08em;transition:color .2s}.node-tag span{color:#3f3f46}.node-tag.active{color:#fff}.inspector{position:absolute;left:1rem;bottom:3rem;width:min(18rem,calc(100% - 2rem));border:1px solid rgba(255,255,255,.12);border-radius:.35rem;background:rgba(8,8,9,.84);padding:1rem;backdrop-filter:blur(12px)}.inspector>div{display:flex;justify-content:space-between}.index,.healthy,.inspector code{font:500 .55rem/1 'JetBrains Mono',monospace;letter-spacing:.09em}.index{color:#52525b}.healthy{color:#00ff88}.inspector h3{margin:1rem 0 .45rem;font:520 1.35rem/1 'Geist Variable',sans-serif;letter-spacing:-.03em}.inspector code{color:#818cf8}.inspector p{margin:.8rem 0 0;color:#a1a1aa;font-size:.75rem;line-height:1.55}@media(max-width:720px){.network,.network.hero{min-height:27rem}.network-meta{font-size:.48rem}}
      `}</style>
    </div>
  );
}
