import { trySettle } from '../common';
import type {Feed, Article, Config} from '../common'

type Story = {
  title: string,
  url: string
}

async function getStoryIds(config: Config): Promise<number[]> {
  const url = `https://hacker-news.firebaseio.com/v0/${config.hackernews.type}stories.json`
  const res = await fetch(url)
  const json: number[] = await res.json()
  return json.slice(0, config.maxArticlesPerFeed)
}

async function getStories(ids: number[]): Promise<Story[]> {
  const url = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  const promises = ids.map(async id => {
    const res = await fetch(url(id))
    return res.json()
  })
  const stories: Story[] = await trySettle(promises)
  return stories
}

function convert({url, title}: Story): Article {
  return {
    title,
    link: url,
    tags: [],
    summary: "summary unavailable"
  }
}

export async function getFeed(config: Config): Promise<Feed> {
  const ids = await getStoryIds(config)
  const stories = await getStories(ids)
  return stories.map(convert)
}
