# CFA Level II Quick Notes

Mobile-first quick notes for the **CFA Program 2027 Level II** curriculum: one page per module, with the key formulas, core concepts and exam traps. They're meant for a quick refresh before a practice set, not for learning a topic from scratch.

**Live site:** https://economist1895.github.io/cfa-level-2/

The notes are original summaries written in my own words. No curriculum text is reproduced, and the site is not affiliated with CFA Institute.

## Features

- **10 volumes, 51 modules**, listed on the home page from a single catalog, with search by topic or acronym (e.g. `EVA`, `CIP`, `TFP`).
- **Module pages:** a 30-second summary, numbered formula cards, comparison tables and a closing *Exam traps* section, plus jump chips, a reading-progress bar and previous/next links.
- **Study plan** (calendar button, top right on every page): month-by-month topics from Nov 2026 to the exam on 27 Aug 2027. Modules link to their notes once they're published, and the current month is highlighted.
- **Light and dark themes**, with the choice remembered.
- **No runtime maths:** formulas are pre-rendered with KaTeX at build time, so pages load fast on a phone.

## Repo layout

| Path | What it is |
|---|---|
| `index.html` | Home page: volumes, modules and search (rendered from the catalog) |
| `plan.html` | Study plan by month |
| `vNN/*.html` | Module pages, e.g. `v02/economic-growth.html` |
| `assets/js/catalog.js` | **Source of truth** for volumes and modules: codes, titles, `status`, read time, search tags |
| `assets/js/app.js` | Theme toggle, study-plan button, read-time pill, chips, progress bar, pager, home rendering, search |
| `assets/css/style.css` | Design system (each volume has its accent colour via `[data-vol]`) |
| `assets/vendor/katex/` | KaTeX CSS and fonts only |
| `tools/render-math.mjs` | Pre-renders `$$…$$` and `\(…\)` in every module page |
| `tools/shot.sh` | Phone-width (390px) screenshots via headless Chrome |
| `tools/extract_epub.py` | Turns the curriculum ePubs into plain text in `source/` |
| `CLAUDE.md` | Full build instructions and content rules for adding modules |

## Adding a module

The full workflow is in [`CLAUDE.md`](CLAUDE.md). In short:

1. Copy the structure of [`v05/residual-income.html`](v05/residual-income.html) into `vNN/<slug>.html` and write the notes, with formulas as `$$…$$` or `\(…\)`.
2. Render the maths (the script is idempotent and must report 0 errors):
   ```sh
   cd tools && npm install   # first time only
   node tools/render-math.mjs
   ```
3. Check it at phone width:
   ```sh
   tools/shot.sh vNN/<slug>.html /tmp/shots light 6
   ```
4. In `assets/js/catalog.js`, set the module's `status: "ready"`, `mins`, `href` and `tags`. It then appears on the home page, in search and in the study plan.

## Local preview

It's a static site with no build step beyond the maths. Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deployment

GitHub Pages serves the `main` branch as static files (`.nojekyll` turns off Jekyll). Pushing to `main` publishes the site.

## Not in this repo

The curriculum ePubs/PDFs and the extracted `source/` text are copyrighted and **gitignored**. To rebuild `source/`, put the ePubs in the repo root and run:

```sh
for v in 1 2 3 4 5 6 7 8 9 10; do
  python3 -I tools/extract_epub.py cfa-program2027L2V$v.ePub source/v$(printf %02d $v)
done
```

## License

[MIT](LICENSE) for the site code. Curriculum content belongs to CFA Institute.
