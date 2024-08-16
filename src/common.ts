export type Config = {
  maxArticlesPerFeed: number
  numRandomPicks: number
  sources: ((config: Config) => Promise<Feed>)[]
  arxiv: {
    categories: string[]
  }
  hackernews: {
    type: 'new' | 'top' | 'best'
  },
  rss: string[]
}

export type Article = {
  summary: string
  title: string
  link: string
  tags: string[]
}

export type Feed = Article[]

/**
 * Promise.allSettled but ignore the rejected ones
 */
export async function trySettle(promises: Promise<any>[]): Promise<any[]> {
  const results = await Promise.allSettled(promises)
  const values = results
    .map(res => {
      if (res.status === 'rejected') return null
      return res.value
    })
    .filter(res => res !== null)

  return values;
}

