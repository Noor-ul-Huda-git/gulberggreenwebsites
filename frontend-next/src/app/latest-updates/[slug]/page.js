import NewsArticleClient from '../NewsArticleClient'
import { fetchNewsPost } from '../../../lib/api.js'

const SITE_ORIGIN = 'https://gulberggreens.com.pk'

function newsBodyMetaDescription(htmlOrText, maxLen = 130) {
  const plain = String(htmlOrText || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!plain) {
    return 'Latest news and updates from Gulberg Greens Islamabad.'
  }

  if (plain.length <= maxLen) {
    return plain
  }

  return `${plain.slice(0, maxLen).trim()}…`
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const post = await fetchNewsPost(slug)

    if (!post) {
      return {
        title: 'Article not found | Gulberg Greens Islamabad',
        description:
          'This update may have been removed or the link is incorrect. Browse all latest news from Gulberg Greens Islamabad.',
        alternates: {
          canonical: `${SITE_ORIGIN}/latest-updates/`,
        },
      }
    }

    return {
      title: post.title,
      description: newsBodyMetaDescription(post.description, 130),
      alternates: {
        canonical: `${SITE_ORIGIN}/latest-updates/${post.slug}/`,
      },
    }
  } catch {
    return {
      title: 'Latest Updates | Gulberg Greens Islamabad',
      description:
        'Browse the latest news and updates from Gulberg Greens Islamabad.',
      alternates: {
        canonical: `${SITE_ORIGIN}/latest-updates/`,
      },
    }
  }
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params

  let post = null

  try {
    post = await fetchNewsPost(slug)
  } catch {
    post = null
  }

  return (
    <NewsArticleClient
      initialPost={post}
      initialSlug={slug}
    />
  )
}