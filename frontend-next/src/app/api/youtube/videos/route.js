
export const dynamic = 'force-dynamic'

const CHANNEL_ID = 'UCyHnLIXIJyBPCoU4jZpXcew'

export async function GET() {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

    const response = await fetch(feedUrl, {
      headers: {
        Accept: 'application/atom+xml, application/xml, text/xml',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return Response.json(
        { error: 'Unable to fetch YouTube RSS feed' },
        { status: 502 },
      )
    }

    const xml = await response.text()
    const entries = xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/g) || []

    const videos = entries.slice(0, 6).map((entry) => {
      const getTag = (tag) => {
        const match = entry.match(
          new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`),
        )
        return match?.[1]?.trim() || ''
      }

      const id = getTag('yt:videoId')
      const title = getTag('title')
      const publishedAt = getTag('published')

      return {
        id,
        title: title
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'"),
        publishedAt,
        link: `https://www.youtube.com/watch?v=${id}`,
      }
    }).filter((video) => video.id)

    return Response.json({ items: videos })
  } catch (error) {
    console.error('YouTube RSS route error:', error)

    return Response.json(
      { error: 'Unable to load YouTube videos' },
      { status: 502 },
    )
  }
}
