# Portfolio Website — Jordan Reyes

Plain HTML5 / CSS3 / vanilla JS personal portfolio site for an AI engineer.

## Files

- `index.html` — semantic structure, SEO/OG/Twitter meta, JSON-LD, inline SVG favicon
- `styles.css` — design tokens, dark/light themes, responsive layouts, print styles, safe-area handling
- `script.js` — theme toggle, mobile nav with focus trap, typed text, canvas animation, scroll-reveal, count-up metrics, active nav, data-driven sections, project filtering + modal, testimonial carousel, validated contact form, back-to-top

## Customize

Search for `EDIT:` comments in `index.html` and `script.js`. Key items:

- Name, title, bio, positioning copy in `index.html`
- Social links (GitHub, LinkedIn, X, email)
- `resume.pdf` — drop your resume into the folder
- Project data in `script.js` (`PROJECTS` array) — titles, metrics, tech, links
- Experience, skills, testimonials, writing arrays in `script.js`
- Contact form endpoint: set `FORM_ENDPOINT` in `initContactForm` (Formspree/Netlify) or rely on mailto fallback
- Availability status text

## Run locally

Open `index.html` directly, or serve with any static server:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Static site — works on GitHub Pages, Netlify, Vercel, Cloudflare Pages. No build step.

- GitHub Pages: push to a repo, enable Pages on `main` / root
- Netlify: drag-and-drop the folder, or connect the repo
- Vercel: `vercel` in the folder

## Accessibility & performance notes

- Skip link, focus styles, focus traps, ARIA, reduced-motion support
- Mobile-first responsive with `clamp()` type/spacing
- Canvas animation disabled under `prefers-reduced-motion`
- Count-up and scroll-reveal degrade gracefully without IntersectionObserver
