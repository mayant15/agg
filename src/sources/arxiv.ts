import { XMLParser } from 'fast-xml-parser'
import type { Feed, Article } from '../types'

const MAX_RESULTS = 20

// from https://arxiv.org/category_taxonomy
const CATEGORIES = [
  'cs.AI',
  'cs.CL',
  'cs.CY',
  'cs.DB',
  'cs.DC',
  'cs.DM',
  'cs.ET',
  'cs.FL',
  'cs.GL',
  'cs.GR',
  'cs.LG',
  'cs.LO',
  'cs.NE',
  'cs.OS',
  'cs.PF',
  'cs.PL',
  'cs.SC',
  'cs.SE',
]

function buildUrl() {
  const categories = CATEGORIES.map(c => `cat:${c}`).join("+OR+")
  const max_results = MAX_RESULTS
  return `http://export.arxiv.org/api/query?search_query=${categories}&start=0&max_results=${max_results}&sortBy=lastUpdatedDate`
}

const URL = buildUrl()

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
    id: entry["arxiv:doi"],
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

export async function getFeed(): Promise<Feed> {
  const res = await fetch(URL)
  const text = await (res).text()
  const xml = parser.parse(text)

  return convert(xml)
}

