/** @jsx h */
/** @jsxFrag Fragment */
// deno-lint-ignore-file no-explicit-any
import { escapeHtml, h, Raw, render, VNode } from "./tsx.ts";
import { Post as PostData } from "./main.ts";

const site_url = "https://manavmanav.xyz";
const blurb = "manav's blog";

function read_css(): string {
  return Deno.readTextFileSync("content/css/main.css");
}

const font_face_css = `
@font-face { font-family: 'Space Grotesk'; src: url('/css/space-grotesk-variable.woff2') format('woff2'); font-weight: 300 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-400-normal.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-400-italic.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: swap; }
@font-face { font-family: 'Iosevka Aile'; src: url('/css/iosevka-aile-700-normal.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'Iosevka SS14'; src: url('/css/iosevka-ss14-400-normal.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Iosevka SS14'; src: url('/css/iosevka-ss14-700-normal.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
`.trim();

const theme_init_script = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem('theme')}catch(e){}if(s)d.setAttribute('data-theme',s);else if(matchMedia('(prefers-color-scheme:dark)').matches)d.setAttribute('data-theme','dark');})();`;

const theme_toggle_script = `(function(){var b=document.documentElement,t=document.getElementById('theme-toggle');if(!t)return;t.addEventListener('click',function(){var d=b.getAttribute('data-theme')==='dark'?'light':'dark';b.setAttribute('data-theme',d);try{localStorage.setItem('theme',d)}catch(e){}});})();`;

export function html_ugly(node: VNode, doctype = "<!DOCTYPE html>"): string {
  return `${doctype}\n${render(node)}`;
}

function Base({ children, title, path, description }: {
  children?: VNode[];
  title: string;
  description: string;
  path: string;
}) {
  const canonical = `${site_url}${path}`;
  return (
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="manav" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="canonical" href={canonical} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="manav"
          href={`${site_url}/feed.xml`}
        />
        <link
          rel="preload"
          href="/css/iosevka-aile-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <script>
          <Raw unsafe={theme_init_script} />
        </script>
        <style>
          <Raw unsafe={font_face_css} />
        </style>
        <style>
          <Raw unsafe={read_css()} />
        </style>
      </head>
      <body>
        <header>
          <nav>
            <a class="title" href="/">manav</a>
            <a href="/about.html">About</a>
            <button
              type="button"
              id="theme-toggle"
              aria-label="Toggle dark mode"
            >
              <Raw
                unsafe={`<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`}
              />
              <Raw
                unsafe={`<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`}
              />
            </button>
          </nav>
        </header>

        <main>
          {children}
        </main>

        <footer>
          <p>
            <a href="/feed.xml">
              <FooterIcon name="rss" />
              Subscribe
            </a>

            <a
              href="https://github.com/manav03panchal"
              rel="noopener me"
              target="_blank"
            >
              <FooterIcon name="github" />
              manav03panchal
            </a>
          </p>
        </footer>
        <script>
          <Raw unsafe={theme_toggle_script} />
        </script>
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
    >
      <Raw unsafe={content.value} />
    </Base>
  );
}

export function PostList({ posts }: { posts: PostData[] }) {
  const list_items = posts.map((post) => (
    <li>
      <h2>
        <a href={post.path}>{post.title}</a>
      </h2>
      <Time className="meta" date={post.date} />
    </li>
  ));

  return (
    <Base path="" title="manav" description={blurb}>
      <ul class="post-list">
        {list_items}
      </ul>
    </Base>
  );
}

export function Post({ post }: { post: PostData }) {
  return (
    <Base
      title={post.title}
      description={post.summary}
      path={post.path}
    >
      <article>
        <Raw unsafe={post.content.value} />
      </article>
      <script>
        <Raw unsafe={`
(function(){
  document.querySelectorAll('figure.code-block').forEach(function(fig){
    var btn=document.createElement('button');
    btn.className='copy-code';btn.type='button';btn.setAttribute('aria-label','Copy code');
    btn.textContent='Copy';
    fig.appendChild(btn);
    btn.addEventListener('click',function(){
      var code=fig.querySelector('code');
      var lines=Array.from(code.querySelectorAll('.line')).map(function(l){return l.textContent;});
      navigator.clipboard.writeText(lines.join('\\n')).then(function(){
        btn.textContent='Copied!';
        setTimeout(function(){btn.textContent='Copy';},2000);
      });
    });
  });
})();
`} />
      </script>
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
