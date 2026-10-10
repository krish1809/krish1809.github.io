# Rishi Kharya · Portfolio

My personal site: **https://krish1809.github.io**

I build AI that shows its work, and systems that hold up. The site covers my main projects (DevPilot, Aura, CSD Group Chat, Village Pond Planner, Capsule), what I'm working on now, and how to reach me.

## Stack

Plain HTML, CSS and JavaScript, with no framework or build step. Fonts are Geist, Geist Mono and Instrument Serif from Google Fonts. It's hosted on GitHub Pages.

- Dark and light themes (follows the system setting and remembers your choice)
- Hero terminal that replays runs from the project demos
- Scroll reveals, which turn off when the visitor prefers reduced motion
- Open Graph image so the link previews properly on LinkedIn and elsewhere

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing

| What | Where |
|---|---|
| Text, projects, links | `index.html` |
| Colours, fonts, layout | `styles.css` (theme tokens at the top) |
| Terminal replay scripts | `SCRIPTS` in `script.js` |
| Project screenshots | `assets/projects/` (1200×750 WebP) |
| Link-preview image | `assets/og.png` (1200×630) |

Pushing to `main` redeploys the site automatically.
