// Pre-render maths in every module page so the browser never runs KaTeX.
//
// Author formulas as  $$ ... $$  (display) or  \( ... \)  (inline).
// This script replaces them in place with
//   <span class="m" data-tex="..."><!--k-->…rendered HTML…<!--/k--></span>
// It is idempotent: already-rendered spans are re-rendered from data-tex,
// so to edit a formula either change its data-tex or replace the whole span with $$…$$.
//
// Usage (from repo root):  node tools/render-math.mjs        (or: cd tools && npm run build)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = fs.readdirSync(ROOT)
  .filter(d => /^v\d\d$/.test(d))
  .flatMap(d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith(".html")).map(f => path.join(ROOT, d, f)));

const decode = s => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
const encode = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let errors = 0;
const render = (tex, display, file) => {
  try {
    const html = katex.renderToString(tex, { displayMode: display, throwOnError: true, output: "html", strict: "ignore" });
    return `<span class="m${display ? " d" : ""}" data-tex="${encode(tex)}"><!--k-->${html}<!--/k--></span>`;
  } catch (e) {
    errors++;
    console.error(`✗ ${path.relative(ROOT, file)}: ${e.message}\n    ${tex}`);
    return display ? `$$${tex}$$` : `\\(${tex}\\)`;
  }
};

for (const file of pages) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  let n = 0;
  // 1) re-render existing spans from their source
  s = s.replace(/<span class="m( d)?" data-tex="([^"]*)"><!--k-->[\s\S]*?<!--\/k--><\/span>/g,
    (_, d, tex) => (n++, render(decode(tex), !!d, file)));
  // 2) render fresh $$…$$ and \(…\)
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => (n++, render(decode(tex.trim()), true, file)));
  s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => (n++, render(decode(tex.trim()), false, file)));
  if (s !== before) fs.writeFileSync(file, s);
  console.log(`✓ ${path.relative(ROOT, file)} — ${n} formulas`);
}
if (errors) { console.error(`\n${errors} formula error(s)`); process.exit(1); }
