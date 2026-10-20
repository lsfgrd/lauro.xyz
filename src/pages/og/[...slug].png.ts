import type { APIRoute, GetStaticPaths } from "astro";
import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import settings from "../../data/settings.js";

type Post = { frontmatter: Record<string, any>; url: string };

const logo = readFile("public/favicon.svg").then(
  (svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`,
);

const fontDir = "node_modules/@fontsource/libre-franklin/files";
const fonts = Promise.all(
  [400, 700].map(async (weight) => ({
    name: "Libre Franklin",
    weight: weight as 400 | 700,
    data: await readFile(`${fontDir}/libre-franklin-latin-${weight}-normal.woff`),
  })),
);

export const getStaticPaths = (() => [
  {
    params: { slug: "default" },
    props: { title: settings.name, description: settings.description, logo: true },
  },
  ...Object.values(
    import.meta.glob<Post>("/src/pages/**/*.md", { eager: true }),
  ).map(({ frontmatter, url }) => ({
    params: { slug: url.replace(/^\/|\/$/g, "") },
    props: {
      title: frontmatter.title,
      description: frontmatter.description,
      logo: false,
    },
  })),
]) satisfies GetStaticPaths;

const h = (type: string, style: Record<string, any>, children?: any) => ({
  type,
  props: { style: { display: "flex", boxSizing: "border-box", ...style }, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { title, description, logo: showLogo } = props;

  const card = h(
    "div",
    {
      width: "100%",
      height: "100%",
      padding: 64,
      background: "#fbf9f4",
      fontFamily: "Libre Franklin",
      color: "#1a1a1a",
    },
    h(
      "div",
      {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 56,
        background: "#ffffff",
        border: "4px solid #1a1a1a",
        boxShadow: "12px 12px 0 #553071",
      },
      [
        h("div", { flexDirection: "column" }, [
          showLogo && {
            type: "img",
            props: {
              src: await logo,
              width: 128,
              height: 128,
              style: { marginBottom: 32 },
            },
          },
          h("div", { fontSize: 72, fontWeight: 700, lineHeight: 1.1 }, title),
          description &&
            h(
              "div",
              { marginTop: 24, fontSize: 36, color: "#5f5868" },
              description,
            ),
        ].filter(Boolean)),
        h("div", { fontSize: 32, fontWeight: 700, color: "#553071" }, "lauro.xyz"),
      ].filter(Boolean),
    ),
  );

  const svg = await satori(card as any, {
    width: 1200,
    height: 630,
    fonts: await fonts,
  });
  const png = new Resvg(svg).render().asPng();

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
