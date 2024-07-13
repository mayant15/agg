import { XMLParser } from 'fast-xml-parser'
import { trySettle } from '../common'
import type { Article, Config, Feed } from '../common';

type RssFeed = {
  rss: {
    channel: {
      item: RssArticle[]
    }
  }
}

type RssArticle = {
  guid: string
  title: string
  pubDate: string
  link: string
  description: string
}

function convert(rss: RssArticle): Article {
  return {
    id: rss.guid,
    link: rss.link,
    title: rss.title,
    tags: [],
    summary: "summary unavailable" // rss.description // TODO: This is HTML, render to markdown or something?
  }
}

async function getFeedForUrl(url: string): Promise<Feed> {
  const res = await fetch(url)
  const text = await res.text()
  const parser = new XMLParser()
  const xml: RssFeed = parser.parse(text)
  return xml.rss.channel.item.map(convert)
}

export async function getFeed(config: Config): Promise<Feed> {
  const feeds: Feed[] = await trySettle(config.rss.map(getFeedForUrl))
  return feeds.flat(1)
}

