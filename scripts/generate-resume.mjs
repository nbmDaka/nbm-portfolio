/**
 * Generates public/resume.pdf — a minimal, valid one-page PDF (Helvetica base-14).
 * Replace with a designed CV export whenever a nicer one exists; the link stays /resume.pdf.
 * Run: node scripts/generate-resume.mjs
 */
import { writeFileSync } from 'node:fs';

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const GREEN = '0 0.72 0.35';
const BLACK = '0.05 0.05 0.05';
const GRAY = '0.42 0.42 0.45';

const lines = [];
const text = (x, y, size, font, color, str) =>
  lines.push(`BT ${color} rg /${font} ${size} Tf ${x} ${y} Td (${esc(str)}) Tj ET`);
const rule = (y) => lines.push(`0.85 0.85 0.87 RG 0.5 w 56 ${y} m 556 ${y} l S`);

// Header
text(56, 762, 22, 'F2', BLACK, 'NURDAULET BEKETOV');
text(56, 744, 11, 'F1', GREEN, 'Backend Software Engineer - Distributed Systems / AI Infrastructure');
text(56, 730, 7.5, 'F1', GRAY, 'Astana, Kazakhstan (UTC+5)  |  nurdaulet.beketov.2005@gmail.com  |  github.com/nbmDaka  |  t.me/nbmdake  |  linkedin.com/in/nurdaulet-beketov');

rule(716);
text(56, 700, 10, 'F2', GREEN, 'EXPERIENCE');

text(56, 682, 10.5, 'F2', BLACK, 'Zanger - Production Engineer');
text(498, 682, 8.5, 'F1', GRAY, '2025 - Present');
text(56, 668, 9, 'F1', BLACK, '- Own deployments and incident response across Linux production infrastructure.');
text(56, 656, 9, 'F1', BLACK, '- Handled security incidents; hardened affected layers.');

text(56, 634, 10.5, 'F2', BLACK, 'Rocky Rocks - AI Platform Engineer');
text(526, 634, 8.5, 'F1', GRAY, '2025');
text(56, 620, 9, 'F1', BLACK, '- Built RAG retrieval pipeline: embedding generation, vector search, AI re-ranking.');
text(56, 608, 9, 'F1', BLACK, '- Shipped semantic job matching to production.');

text(56, 586, 10.5, 'F2', BLACK, 'AML Academy - Production Engineer');
text(506, 586, 8.5, 'F1', GRAY, '2024 - 2025');
text(56, 572, 9, 'F1', BLACK, '- National testing platform: 3.5M+ registered users, 40K-50K peak concurrent users.');
text(56, 560, 9, 'F1', BLACK, '- Java / Spring Boot services, PostgreSQL, exam-window peak reliability.');

rule(542);
text(56, 524, 10, 'F2', GREEN, 'EDUCATION');
text(56, 508, 10.5, 'F2', BLACK, 'Astana IT University - Bachelor of Software Engineering');
text(506, 508, 8.5, 'F1', GRAY, '2022 - 2025');

rule(492);
text(56, 474, 10, 'F2', GREEN, 'STACK');
text(56, 458, 9, 'F1', BLACK, 'Backend: Go, Java, Spring Boot, NestJS, Kafka, gRPC');
text(56, 444, 9, 'F1', BLACK, 'Data: PostgreSQL, MySQL, Vector DB   |   Infrastructure: Docker, Linux, Nginx');
text(56, 430, 9, 'F1', BLACK, 'AI: RAG, Embeddings, Vector Search, AI APIs');

rule(414);
text(56, 396, 10, 'F2', GREEN, 'SELECTED SYSTEMS');
text(56, 380, 9, 'F1', BLACK, '- National Testing Platform - national exam delivery at 40K-50K peak concurrency.');
text(56, 366, 9, 'F1', BLACK, '- AI Job Search Platform - RAG pipeline, vector search, AI recommendations.');
text(56, 352, 9, 'F1', BLACK, '- AI Media Generation Platform - asynchronous, queue-based generation workflows.');

text(56, 320, 8, 'F1', GRAY, 'nurdaulet.dev');

const content = lines.join('\n');

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
];

let pdf = '%PDF-1.4\n';
const offsets = [0];
objects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

writeFileSync('public/resume.pdf', pdf, 'latin1');
console.log(`resume.pdf written (${pdf.length} bytes)`);
