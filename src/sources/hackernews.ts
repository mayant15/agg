import { trySettle } from '../common';
import type {Feed, Article} from '../common'

const MAX_RESULTS = 10;

type Story = {
  id: number,
  title: string,
  url: string
}

async function getTopIds(): Promise<number[]> {
  const URL = 'https://hacker-news.firebaseio.com/v0/topstories.json'
  const res = await fetch(URL)
  const json: number[] = await res.json()
  return json.slice(0, MAX_RESULTS)
}

async function getTop(): Promise<Story[]> {
  const url = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  const ids = await getTopIds()
  const promises = ids.map(async id => {
    const res = await fetch(url(id))
    return res.json()
  })
  const stories: Story[] = await trySettle(promises)
  return stories
}

function convert({id, url, title}: Story): Article {
  return {
    title,
    id: String(id),
    link: url,
    tags: [],
    summary: "summary unavailable"
  }
}

export async function getFeed(): Promise<Feed> {
  const top = await getTop()
  return top.map(convert)
}
