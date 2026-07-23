# sonali-site

Personal research site for Sonali Goel. Plain HTML + CSS + one vanilla-JS canvas
(`quantum.js`: Bloch-sphere hero + typewriter tagline), no build step. Dark-only by
design; respects `prefers-reduced-motion` (static sphere, no typing).

## Confidentiality rule

Public entries stay at **question altitude**: research question + shape of the result.
Method names, mechanisms, benchmark lists, and review venues for unpublished work live
only in privately submitted materials (CV, applications) — never on this site. When a
paper gets a public preprint, link it and restore the detail for that entry.

## Editing content yourself

⚠️ **Edit as plain text only.** macOS TextEdit opens `.html` in rich-text mode and
silently destroys the design on save. If you use TextEdit, first tick
Preferences → Open and Save → *"Display HTML files as HTML code instead of formatted
text"*. Safest route: `cd ~/Desktop/sonali-site && claude` and describe changes in
plain English.

The site is three pages: `index.html` (hero, intro + photo, research), `life.html`
(music, art, anything else), and `disorder.html` (the four-panel tracking demo,
reached only by clicking the disorder entry's title) — no build step, nothing else
to touch. A full editing guide sits in a comment at the top of `index.html`.
The Writing section is currently commented out in `index.html`; the comment
wrapper explains how to restore it. The short
version: edit text between tags, type real characters (— · × τ ψ) directly, and treat
each `<article class="entry">` block as one research item you can copy, delete, or
reorder (numbering is automatic). Typewriter phrases are the `phrases` list in
`quantum.js`. Preview by double-clicking `index.html`.

## Images

- **Your photo:** `assets/me.jpg`, shown beside the intro on the main page — replace
  the file to change it (portrait-ish crop looks best).
- **Art photos:** name them `art-1.jpg` … `art-8.jpg` (put the clay first) and drop
  them in `assets/` — the gallery on `life.html` shows them automatically and each
  opens full-size on click. More than 8: copy an `<img>` line in the gallery.
- **Guitar video tiles:** poster frames at `assets/music-N-poster.jpg` with a play
  badge; clicking opens the post on Instagram. Each tile has a title +
  like/comment counts (a snapshot from Instagram, July 2026 — edit the numbers in
  `life.html` or ask Claude to refresh them). Add a tile by copying a `<figure>`
  block; a missing poster hides its whole tile.

## Before shipping

Search `index.html` for `TODO`:

1. **Links row** — uncomment and fill in GitHub / Scholar / LinkedIn / X; delete the ones you don't use.
2. **Writing section** — add at least one real note, or delete the section. An empty
   "coming soon" section is weaker than no section.
3. **Art photos** — done: `art-1`–`art-7` are clay, `art-8`–`art-10` are the beach
   watercolor, coral-reef painting, and megaphone pencil drawing. Slot `art-11.jpg`
   is reserved for the EVA foam costume (drop the file in and it appears).

## Adding a note

Copy `writing/post-template.html`, rename it, write, then add an entry in the
Writing section of `index.html` (a commented-out template shows the format).

## Preview locally

```sh
python3 -m http.server 4173 -d .
# open http://localhost:4173
```

## Deploy to GitHub Pages

The repo must be named `<your-github-username>.github.io`:

```sh
git init && git add -A && git commit -m "Personal site"
gh repo create YOUR-USERNAME.github.io --public --source=. --push
```

Live at `https://YOUR-USERNAME.github.io` a minute or two later. To use a custom
domain, add it in the repo's Settings → Pages afterwards.
