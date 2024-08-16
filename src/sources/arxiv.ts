import { XMLParser } from 'fast-xml-parser'
import type { Feed, Article, Config } from '../common'

function buildUrl(config: Config) {
  const query = config.arxiv.categories.map(c => `cat:${c}`).join("+OR+")
  const maxResults = config.maxArticlesPerFeed
  return `http://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=${maxResults}&sortBy=lastUpdatedDate`
}

const parser = new XMLParser()

type ArxivEntry = {
  id: string
  title: string
  summary: string
  "arxiv:doi"?: string
}

type ArxivResponse = {
  feed: {
    "opensearch:totalResults": number
    entry: ArxivEntry[]
  }
}

function entryToArticle(entry: ArxivEntry): Article {
  return {
    title: entry.title,
    summary: entry.summary,
    link: entry.id,
    tags: [],
  }
}

function convert(ax: ArxivResponse): Feed {
  if (ax.feed['opensearch:totalResults'] > 0) {
    return ax.feed.entry.map(entryToArticle)
  } else {
    return []
  }
}

export async function getFeed(config: Config): Promise<Feed> {
  const res = await fetch(buildUrl(config))
  const text = await (res).text()
  const xml = parser.parse(text)

  return convert(xml)
}

