import type { APIRoute, GetStaticPaths } from "astro";
import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

type Post = { frontmatter: Record<string, any>; url: string };

const fontDir = "node_modules/@fontsource/libre-franklin/files";
const fonts = Promise.all(
  [400, 700].map(async (weight) => ({
    name: "Libre Franklin",
    weight: weight as 400 | 700,
    data: await readFile(`${fontDir}/libre-franklin-latin-${weight}-normal.woff`),
  })),
);

export const getStaticPaths = (() =>
  Object.values(
    import.meta.glob<Post>("/src/pages/**/*.md", { eager: true }),
  ).map(({ frontmatter, url }) => ({
    params: { slug: url.replace(/^\/|\/$/g, "") },
    props: { title: frontmatter.title, description: frontmatter.description },
  }))) satisfies GetStaticPaths;

const h = (type: string, style: Record<string, any>, children?: any) => ({
  type,
  props: { style: { display: "flex", boxSizing: "border-box", ...style }, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props;

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
          h("div", { fontSize: 72, fontWeight: 700, lineHeight: 1.1 }, title),
          description &&
            h(
              "div",
              { marginTop: 24, fontSize: 36, color: "#5f5868" },
              description,
            ),
        ]),
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
