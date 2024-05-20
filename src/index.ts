import { getFeed as arxiv } from "./sources/arxiv"
import type { Article, Feed } from "./types"

const NUM_RANDOM_PICKS = 3

function pickRandom(feed: Feed, num: number): Article[] {
  if (feed.length < num) return feed

  return Array(NUM_RANDOM_PICKS)
    .fill(null)
    .map(_ => {
      const idx = Math.floor(feed.length * Math.random())
      return feed[idx]
    })
}

async function main() {
  const ax = await arxiv()
  const articles = pickRandom(ax, NUM_RANDOM_PICKS)
  console.log(articles.map(x => x.title).join('\n'))
}

main()
  .catch(console.error)
