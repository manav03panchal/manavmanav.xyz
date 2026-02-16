/** @jsx h */
/** @jsxFrag Fragment */
// deno-lint-ignore-file no-explicit-any
import { escapeHtml, h, Raw, render, VNode } from "./tsx.ts";
import { Post as PostData } from "./main.ts";
import { FeedEntry as FeedEntryData } from "./blogroll.ts";

const site_url = "https://manavmanav.xyz";
const blurb = "manav's blog";

export function html_ugly(node: VNode, doctype = "<!DOCTYPE html>"): string {
  return `${doctype}\n${render(node)}`;
}

function FontLinks() {
  const style = `
  @font-face {
    font-family: 'Space Grotesk'; src: url('/css/space-grotesk-variable.woff2') format('woff2');
    font-weight: 300 700; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-400-normal.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-400-italic.woff2') format('woff2');
    font-weight: 400; font-style: italic; font-display: swap;
  }
  @font-face {
    font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-700-normal.woff2') format('woff2');
    font-weight: 700; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Iosevka SS14'; src: url('/css/iosevka-ss14-400-normal.woff2') format('woff2');
    font-weight: 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Iosevka SS14'; src: url('/css/iosevka-ss14-700-normal.woff2') format('woff2');
    font-weight: 700; font-style: normal; font-display: swap;
  }
`;
  return (
    <style>
      <Raw unsafe={style} />
    </style>
  );
}

function Base({ children, src, title, path, description, extra_css }: {
  children?: VNode[];
  src: string;
  title: string;
  description: string;
  path: string;
  extra_css?: string;
}) {
  return (
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={`${site_url}${path}`} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="manav"
          href={`${site_url}/feed.xml`}
        />
        <FontLinks />
        <link rel="stylesheet" href="/css/main.css" />
        {extra_css && <link rel="stylesheet" href={`/css/${extra_css}`} />}
      </head>
      <body>
        <header>
          <nav>
            <a class="title" href="/">manav</a>
            <a href="/about.html">About</a>
            <button id="theme-toggle" aria-label="Toggle dark mode">
              <Raw unsafe={`<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`} />
              <Raw unsafe={`<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`} />
            </button>
          </nav>
        </header>
        <script>
          <Raw unsafe={`
(function(){
  var b=document.documentElement,t=document.getElementById('theme-toggle'),
    s=localStorage.getItem('theme');
  if(s)b.setAttribute('data-theme',s);
  else if(matchMedia('(prefers-color-scheme:dark)').matches)b.setAttribute('data-theme','dark');
  t.addEventListener('click',function(){
    var d=b.getAttribute('data-theme')==='dark'?'light':'dark';
    b.setAttribute('data-theme',d);localStorage.setItem('theme',d);
  });
})();
`} />
        </script>

        <main>
          {children}
        </main>

        <footer>
          <p>
            <a href="/feed.xml">
              <FooterIcon name="rss" />
              Subscribe
            </a>

            <a href="https://github.com/manavpanchal">
              <FooterIcon name="github" />
              manavpanchal
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}

function FooterIcon({ name }: { name: string }) {
  return (
    <svg>
      <use href={`/assets/icons.svg#${name}`} />
    </svg>
  );
}

export function Page(name: string, content: HtmlString) {
  return (
    <Base
      path={`/${name}`}
      title="manav"
      description={blurb}
      src={`/content/${name}.dj`}
    >
      <Raw unsafe={content.value} />
    </Base>
  );
}

export function PostList({ posts }: { posts: PostData[] }) {
  const list_items = posts.map((post) => (
    <li>
      <Time className="meta" date={post.date} />
      <h2>
        <a href={post.path}>{post.title}</a>
      </h2>
    </li>
  ));

  return (
    <Base path="" title="manav" description={blurb} src="/src/templates.tsx">
      <ul class="post-list">
        {list_items}
      </ul>
    </Base>
  );
}

export function Post({ post }: { post: PostData }) {
  return (
    <Base
      src={post.src}
      title={post.title}
      description={post.summary}
      path={post.path}
    >
      <article>
        <Raw unsafe={post.content.value} />
      </article>
    </Base>
  );
}

export function BlogRoll({ posts }: { posts: FeedEntryData[] }) {
  function domain(url: string): string {
    return new URL(url).host;
  }

  const list_items = posts.map((post) => (
    <li>
      <span class="meta">
        <Time date={post.date} />, {domain(post.url)}
      </span>
      <h2>
        <a href={post.url}>{post.title}</a>
      </h2>
    </li>
  ));

  return (
    <Base path="" title="manav" description={blurb} src="/src/templates.tsx">
      <ul class="post-list">
        {list_items}
      </ul>
    </Base>
  );
}

function Time(
  { date, className = undefined }: { date: Date; className?: string },
) {
  const human = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const machine = yyyy_mm_dd(date);
  return <time class={className} datetime={machine}>{human}</time>;
}
function yyyy_mm_dd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function time_html(date: Date, className: string) {
  return render(<Time date={date} className={className} />);
}

export function Redirect({ path }: { path: string }) {
  return (
    <html lang="en-US">
      <meta charset="utf-8" />
      <title>Redirecting…</title>
      <link rel="canonical" href={path} />
      <script>
        <Raw unsafe={`location="${path}"`} />
      </script>
      <meta http-equiv="refresh" content={`0; url=${path}`} />
      <meta name="robots" content="noindex" />
      <h1>Redirecting…</h1>
      <a href={path}>Click here if you are not redirected.</a>
    </html>
  );
}

export function feed_xml(posts: PostData[]): string {
  return html_ugly(
    Feed({ posts }),
    `<?xml version="1.0" encoding="utf-8"?>`,
  );
}

function Feed({ posts }: { posts: PostData[] }) {
  const entries = posts.slice(0, 10).map((post) => FeedEntry({ post }));

  return (
    <feed xmlns="http://www.w3.org/2005/Atom">
      <link
        href={`${site_url}/feed.xml`}
        rel="self"
        type="application/atom+xml"
      />
      <link href={site_url} rel="alternate" type="text/html" />
      <updated>{new Date().toISOString()}</updated>
      <id>{`${site_url}/feed.xml`}</id>
      <title type="html">manav</title>
      <subtitle>{blurb}</subtitle>
      <author>
        <name>Manav Panchal</name>
      </author>
      {entries}
    </feed>
  );
}

function FeedEntry({ post }: { post: PostData }) {
  return (
    <entry>
      <title type="text">{post.title}</title>
      <link
        href={`${site_url}${post.path}`}
        rel="alternate"
        type="text/html"
        title={post.title}
      />
      <published>{yyyy_mm_dd(post.date)}T00:00:00+00:00</published>
      <updated>{yyyy_mm_dd(post.date)}T00:00:00+00:00</updated>
      <id>{`${site_url}${post.path.replace(".html", "")}`}</id>
      <author>
        <name>Manav Panchal</name>
      </author>
      <summary type="html">
        <Raw unsafe={`<![CDATA[${post.summary}]]>`} />
      </summary>
      <content type="html" xml:base={`${site_url}${post.path}`}>
        <Raw unsafe={`<![CDATA[${post.content.value}]]>`} />
      </content>
    </entry>
  );
}

export function html(
  strings: ArrayLike<string>,
  ...values: any[]
): HtmlString {
  function content(value: any): string[] {
    if (value === undefined) return [];
    if (value instanceof HtmlString) return [value.value];
    if (Array.isArray(value)) return value.flatMap(content);
    return [escapeHtml(value)];
  }
  return new HtmlString(
    String.raw({ raw: strings }, ...values.map((it) => content(it).join(""))),
  );
}

export class HtmlString {
  constructor(public value: string) {
  }
  push(other: HtmlString) {
    this.value = `${this.value}\n${other.value}`;
  }
}
