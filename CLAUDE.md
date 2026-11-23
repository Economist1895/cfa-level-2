# CFA Level II Quick Notes — build instructions

Mobile-first HTML quick notes for the CFA Program 2027 Level II curriculum, one page per module, hosted on GitHub Pages. They are for refreshing memory before practice questions: **key formulas, key concepts and exam traps only**. Written in our own words; never paste curriculum prose.

## When the user sends just a volume number (e.g. `6` or `Vol 6`)

Build the quick notes for every module in that volume whose `status` in `assets/js/catalog.js` is not `"ready"`, working **one module at a time**, in catalog order.

- **Heavy volumes (3, 5, 9):** build at most **3 modules per session**. Then stop and tell the user to clear the conversation and send the same volume number again to continue.
- **Volume 10 (Ethics):** all 9 modules fit in one session.
- Give a one-line progress update when you start each module.
- At the end, summarise what was built and flag anything uncertain. When the user approves, commit with `git add -A && git commit -m "Add Vol N notes: <modules>"`.

## Per-module workflow (do every step)

1. **Read the source:** `source/vNN/<CODE>-*.txt` contains learning outcomes, reading, practice questions and solutions. Formulas appear as `⟦…⟧` with `_{}` for subscripts, `^{}` for powers, `(a)/(b)` for fractions and `Σ[t=1→T]` for sums. Find section line numbers with `grep -n '^#'`. To skim prose without big numeric example tables, run:
   `sed -n 'A,Bp' FILE | grep -v '^\s*$' | awk '!( /^ \|/ && gsub(/[0-9]/,"&")>12 )'`
   Read the end-of-reading **Summary** first, then the body.
2. **Draft** `vNN/<slug>.html`, copied from the structure of `v05/residual-income.html` (the template). The slug is the kebab-case of a short title, e.g. `v06/credit-default-swaps.html`.
3. **Cross-check against the practice questions and solutions** (`======== PRACTICE QUESTIONS/ANSWERS ========`). Make sure every concept and formula they test is in the notes. Turn recurring mistakes, distractor logic and "which statement is correct" items into **Exam traps**.
4. **Accuracy pass:**
   - Re-check every formula against the source text, including sign, subscript (beginning vs ending values) and timing.
   - Recompute any number you quote with `python3 -I -c` (e.g. a check against a curriculum solution).
   - Derived or rearranged formulas must reproduce a curriculum answer numerically.
   - Flag any IFRS vs US GAAP differences correctly.
5. **Render the maths:** `node tools/render-math.mjs`. It must report 0 errors. The script is idempotent.
6. **Phone check:** `tools/shot.sh vNN/<slug>.html <scratchpad>/shots light 6` (also `dark` for at least the first segment). Read the PNGs. Fix any formula that overflows the 390px width by stacking it with `aligned`/`gathered`, and fix any layout glitch.
7. **Register the module** in `assets/js/catalog.js`: add `status: "ready"`, `mins` (the "~N min read" pill the page shows), `href`, and `tags` (search keywords: acronyms, key terms).

## Page structure & content rules

Copy the head, topbar, footer and script tags exactly from the template, changing only the `<title>`, the `.title` span, `data-vol` and `data-module` (the CFA code from the catalog). Inside `<main>`:

- `.m-head`: eyebrow (filled by JS), `<h1>` module title, empty `.meta`, empty `nav.chips` (JS builds the chips from sections).
- `.tldr` **"In 30 seconds"**: 3–5 bullets covering the big picture.
- `section.sec` with `id` and a short `data-chip` label, headed `<h2><span class="n">01</span>Title</h2>`. Usually 4–7 sections.
  - **Formula cards** `.f-card`: `.f-head` (`.f-tag` F1, F2… numbered through the page + `<h3>` name), `.f-math` with `$$…$$`, optional `dl.f-vars` (variable meanings, only the non-obvious ones), optional `p.f-use` (when to use it, interpretation, key assumptions).
  - `ul.pts` bullets; `h3.sub` subheads; `.tbl-wrap > table.tbl` for comparisons; `.duo` with `.plus` and `.minus` for pros/cons.
  - `.callout.key` (💡) for core insights; `.callout.trap` (⚠️) for traps attached to a topic.
- A final **"Exam traps"** section (`id="traps"`): one `.callout.trap` holding a `ul.pts` of 6–10 sharp, vignette-derived traps.
- Then `<nav class="pager"></nav>` and the `.home-cta` "Back to all notes" link.

**Do NOT include:** worked examples, self-check or quiz questions, history and research citations, or the names of example companies. (User preference: formulas + traps are enough.)

**Length:** aim for a 3–6 minute read. Be terse: fragments are fine, bold the key word, no filler.

**Maths:**
- Author formulas as `$$…$$` (display) or `\(…\)` (inline). Never use a bare `$` for currency.
- Use `&amp; &lt; &gt;` in HTML text.
- Keep display formulas narrow enough for 390px: put alternative forms on separate lines.

**Links:** always link to `../index.html` explicitly, never `../`. A folder link opens a directory listing when the file is opened locally.

**Ethics (Vol 10):** few formulas. Use `.f-card` as **rule cards**: `.f-tag` = standard ID (e.g. `III(B)`), `<h3>` = the standard's name, `.f-use` = the requirement in 1–2 lines. Follow with bullets for key nuances, recommended procedures that are commonly tested, and "violation vs not a violation" grey areas. The final section is still Exam traps.

## Repo layout

- `index.html`: home page (volumes and modules, rendered from the catalog; search).
- `plan.html`: study plan by month. Module lists come from the catalog via `data-codes`, so ready modules link automatically. `app.js` injects the calendar button into every top bar.
- `vNN/*.html`: module pages (maths pre-rendered; `.katex` spans keep the TeX in `data-tex`).
- `assets/css/style.css`: the design system (volume accent colours via `[data-vol]`).
- `assets/js/catalog.js`: the source of truth for volumes and modules (codes, titles, status).
- `assets/js/app.js`: theme toggle, read-time pill, chips, progress bar, pager, home rendering and search.
- `assets/vendor/katex/`: `katex.min.css` + fonts only (no runtime JS).
- `tools/render-math.mjs`: pre-renders the maths (`cd tools && npm install` once if `node_modules` is missing).
- `tools/extract_epub.py`: ePub → `source/` text (already done; re-run only if `source/` is missing).
- `tools/shot.sh`: phone-width screenshots.
- **Never commit** the ePubs, PDFs or `source/` (they're gitignored). The notes are original summaries.
