import { XMLParser } from 'fast-xml-parser'
import type { Feed, Article } from '../types'

const url = 'http://export.arxiv.org/api/query?search_query=all:electron'

const parser = new XMLParser()

type ArxivEntry = {
  id: string
  title: string
  summary: string
  "arxiv:doi"?: string
}

type ArxivResponse = {
  feed: {
    entry: ArxivEntry[]
  }
}

function entryToArticle(entry: ArxivEntry): Article {
  return {
    id: entry["arxiv:doi"],
    title: entry.title,
    summary: entry.summary,
    link: entry.id,
    tags: [],
  }
}

function convert(ax: ArxivResponse): Feed {
  return ax.feed.entry.map(entryToArticle)
}

export async function getFeed(): Promise<Feed> {
  const res = await (await fetch(url)).text()
  return convert(parser.parse(res))
}

