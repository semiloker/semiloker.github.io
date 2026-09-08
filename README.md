# semiloker.com

Personal site. The page behaves like a text editor.

Live at **https://semiloker.github.io**

## What it is

Static HTML, CSS and a little vanilla JavaScript. No build step, no
dependencies, no framework.

The layout rests on one idea: the line-number gutter on the left addresses
real lines of text rather than decorating the page. Everything vertical sits
on a single grid, the pointer acts as a cursor and the status bar reports
where it is, and a line that soft-wraps on a phone keeps one number on its
first row — the way an editor does it.

## Files

| File | |
|---|---|
| `home.html` | Landing page |
| `about.html` | A shell session: whoami, interests, contact |
| `base.css` | Page chrome — gutter, navbar, links |
| `editor.css` | The editor surface, shared by both pages |
| `editor.js` | Gutter, current line, status bar, boot sequence |
| `home.css`, `about.css` | Per-page styling |
| `age.js` | Keeps the age on the about page current |
| `bg.js` | Dithered WebGL background, currently switched off |

## Running locally

Any static server will do:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploying

GitHub Pages serves the `main` branch from the repository root, so merging
into `main` publishes. Day-to-day work happens on `developer`.
