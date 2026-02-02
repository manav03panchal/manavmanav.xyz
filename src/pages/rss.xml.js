import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');

  return rss({
    title: 'Manav Panchal',
    description: 'Developer, writer, and builder.',
    site: context.site,
    items: posts
      .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description || '',
        link: `/blog/${post.slug}/`,
      })),
  });
}
