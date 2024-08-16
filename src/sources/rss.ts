import { XMLParser } from 'fast-xml-parser'
import { trySettle } from '../common'
import type { Article, Config, Feed } from '../common';

type RssFeed = {
  rss?: {
    channel: {
      item: RssArticle[]
    }
  }
  feed?: {
    entry: RssArticle[]
  }
}

type RssArticle = {
  title: string
  link: string
  description?: string
  summary?: string
  id?: string
  guid?: string
}

function convert(rss: RssArticle): Article {
  return {
    link: rss.link || (rss.guid ?? rss.id ?? ''),
    title: rss.title,
    tags: [],
    summary: rss.summary ?? 'summary unavailable' // rss.description
  }
}

async function getFeedForUrl(url: string): Promise<Feed> {
  const res = await fetch(url)
  const text = await res.text()
  const parser = new XMLParser()
  const xml: RssFeed = parser.parse(text)
  if (xml.rss) {
    return xml.rss.channel.item.map(convert)
  } else if (xml.feed) {
    return xml.feed.entry.map(convert)
  } else {
    return []
  }
}

export async function getFeed(config: Config): Promise<Feed> {
  const feeds: Feed[] = await trySettle(config.rss.map(getFeedForUrl))
  return feeds.flat(1)
}

