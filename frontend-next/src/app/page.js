import HomeClient from '../components/home/HomeClient.jsx'
import { fetchNewsPosts, fetchProperties } from '../lib/api.js'

function parsePropertyListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

function parseNewsListResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

async function getFeaturedProperties() {
  try {
    const response = await fetchProperties({ page: '1' })

    let list = parsePropertyListResponse(response)

    list = [...list].sort((a, b) => {
      if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
        return Number(b.is_featured) - Number(a.is_featured)
      }

      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      )
    })

    console.log(
      'SERVER FEATURED PROPERTIES:',
      list.slice(0, 5),
    )

    return list.slice(0, 5)
  } catch (error) {
    console.error(
      'HOME FEATURED PROPERTIES ERROR:',
      error,
    )

    return []
  }
}

async function getLatestNewsPosts() {
  try {
    let allPosts = []
    let page = 1
    let totalPages = 1

    while (allPosts.length < 6 && page <= totalPages) {
      const response = await fetchNewsPosts({
        page,
      })

      const posts = parseNewsListResponse(response)

      allPosts = [...allPosts, ...posts]

      const total =
        Number(response?.count || 0)

      const pageSize =
        Number(response?.page_size || posts.length || 1)

      if (total > 0) {
        totalPages = Math.ceil(total / pageSize)
      } else {
        totalPages = page
      }

      if (posts.length === 0) {
        break
      }

      page += 1
    }

    const latestPosts = allPosts
      .filter((post) => post?.slug)
      .slice(0, 6)

    console.log(
      'SERVER LATEST NEWS COUNT:',
      latestPosts.length,
    )

    return latestPosts
  } catch (error) {
    console.error(
      'HOME LATEST NEWS ERROR:',
      error,
    )

    return []
  }
}

export default async function HomePage() {
  const [
    featuredProperties,
    latestNewsPosts,
  ] = await Promise.all([
    getFeaturedProperties(),
    getLatestNewsPosts(),
  ])

  console.log(
    'SERVER FEATURED PROPERTIES COUNT:',
    featuredProperties.length,
  )

  console.log(
    'SERVER LATEST NEWS COUNT:',
    latestNewsPosts.length,
  )

  return (
    <HomeClient
      initialFeaturedListings={featuredProperties}
      initialNewsPosts={latestNewsPosts}
    />
  )
}