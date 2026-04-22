// deno-lint-ignore-file no-explicit-any
import MarkdownIt from "https://esm.sh/markdown-it@14.1.0";
import { highlight } from "./highlight.ts";
import { HtmlString, time_html } from "./templates.tsx";

export type RenderCtx = {
  date?: Date;
  summary?: string;
  title?: string;
};

type Token = any;

export function parse(source: string): Token[] {
  return base_md().parse(strip_frontmatter(source), {});
}

function strip_frontmatter(source: string): string {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) return source;
  const end = source.indexOf("\n---", 4);
  if (end === -1) return source;
  const after = source.indexOf("\n", end + 4);
  return after === -1 ? "" : source.slice(after + 1);
}

export function render(tokens: Token[], ctx: RenderCtx): HtmlString {
  extract_title_and_summary(tokens, ctx);
  const md = configured_md(ctx);
  const html = md.renderer.render(tokens, md.options, {});
  return new HtmlString(html);
}

function base_md(): any {
  return new (MarkdownIt as any)({
    html: true,
    linkify: false,
    typographer: true,
  });
}

function configured_md(ctx: RenderCtx): any {
  const md = base_md();

  md.renderer.rules.heading_open = (
    tokens: Token[],
    idx: number,
    options: any,
    _env: any,
    self: any,
  ) => {
    const token = tokens[idx];
    const inline = tokens[idx + 1];
    const text = inline?.content ?? "";
    const id = slugify(text);

    if (token.tag === "h1" && ctx.date) {
      token.attrSet("id", id);
      return `<header>\n${self.renderToken(tokens, idx, options)}`;
    }

    token.attrSet("id", id);
    const open = self.renderToken(tokens, idx, options);
    if (token.tag === "h1") return open;
    return `${open}<a href="#${id}">`;
  };

  md.renderer.rules.heading_close = (
    tokens: Token[],
    idx: number,
    options: any,
    _env: any,
    self: any,
  ) => {
    const token = tokens[idx];
    if (token.tag === "h1" && ctx.date) {
      const close = self.renderToken(tokens, idx, options);
      return `${close}\n${time_html(ctx.date, "meta")}\n</header>\n`;
    }
    if (token.tag === "h1") return self.renderToken(tokens, idx, options);
    return `</a>${self.renderToken(tokens, idx, options)}`;
  };

  md.renderer.rules.link_open = (
    tokens: Token[],
    idx: number,
    options: any,
    _env: any,
    self: any,
  ) => {
    const token = tokens[idx];
    const href = token.attrGet("href") ?? "";
    if (/^https?:\/\//.test(href)) {
      token.attrSet("target", "_blank");
      token.attrSet("rel", "noopener noreferrer");
    }
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = (
    tokens: Token[],
    idx: number,
    options: any,
    _env: any,
    self: any,
  ) => {
    const token = tokens[idx];
    const src = token.attrGet("src") ?? "";
    if (/\.(mp4|webm|mov)(\?|#|$)/i.test(src)) {
      const alt = token.content ?? "";
      const label = alt ? ` aria-label="${escape_attr(alt)}"` : "";
      return `<video src="${escape_attr(src)}" controls muted playsinline${label}></video>`;
    }
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = (tokens: Token[], idx: number) => {
    const token = tokens[idx];
    const lang = (token.info ?? "").trim().split(/\s+/)[0] || undefined;
    const body = highlight(token.content, lang).value;
    return `<figure class="code-block">\n${body}\n</figure>\n`;
  };

  return md;
}

function extract_title_and_summary(tokens: Token[], ctx: RenderCtx): void {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!ctx.title && t.type === "heading_open" && t.tag === "h1") {
      ctx.title = tokens[i + 1]?.content ?? "";
    }
    if (!ctx.summary && t.type === "paragraph_open") {
      ctx.summary = (tokens[i + 1]?.content ?? "").replace(/\s+/g, " ").trim();
    }
    if (ctx.title && ctx.summary) break;
  }
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escape_attr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
