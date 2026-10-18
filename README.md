[![Netlify Status](https://api.netlify.com/api/v1/badges/8780146b-f091-4844-b16a-c6af439f0dc5/deploy-status)](https://app.netlify.com/sites/lauro/deploys)

# lauro.xyz

Source code for my personal website, [lauro.xyz](https://lauro.xyz), built with [Astro](https://astro.build).

## Requirements

- Node.js 22.22 or newer (see `.nvmrc`)
- [pnpm](https://pnpm.io) (version pinned in `package.json` via `packageManager`)

If you have [Corepack](https://nodejs.org/api/corepack.html) enabled, the right pnpm version is picked up automatically:

```sh
corepack enable
```

## Get Started

```sh
# Install dependencies
pnpm install

# Run the site locally
pnpm start

# Build the site
pnpm build

# Format the code
pnpm format
```

## Project Structure

- `src/pages/` – site pages
  - `src/pages/tech/` – tech posts, written in Markdown
  - `src/pages/til/` – "Today I Learned" posts, organized as `YYYY/MM/post.md`
  - `src/pages/me/` – personal blog posts (mostly in Portuguese), organized as `YYYY/MM/post.md`
- `src/layouts/` – page and post layouts
- `src/components/` – reusable components
- `src/data/settings.js` – site metadata used for SEO and JSON-LD
- `public/` – static assets (images, favicon, `robots.txt`)

## Credits

Based on [astro-minimal-starter](https://github.com/jaydanurwin/astro-minimal-starter) by Jaydan Urwin.
