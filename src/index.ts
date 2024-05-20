/**
 *  TODO:
 * - [ ] Tags
 * - [ ] GPT summaries for articles without summaries? (mainly HN)
 */

import chalk from "chalk"
import { getFeed as arxiv } from "./sources/arxiv"
import { getFeed as hn } from "./sources/hackernews"
import { trySettle } from './common'

import type { Article, Feed } from "./common"

const NUM_RANDOM_PICKS = 3

function mergeFeeds(...feeds: Feed[]): Feed {
  return ([] as Feed).concat(...feeds)
}

function pickRandom(feed: Feed, num: number): Article[] {
  if (feed.length < num) return feed

  return Array(NUM_RANDOM_PICKS)
    .fill(null)
    .map(_ => {
      const idx = Math.floor(feed.length * Math.random())
      return feed[idx]
    })
}

function present(articles: Article[]) {
  const l = console.log
  function inner({ title, summary, link }: Article, index: number) {
    l(chalk.bold.underline(`${index + 1}. ${title}`))
    l('')
    l(chalk.dim(summary))
    l('')
    l(chalk.blue.underline(link))
    l('')
    l('')
  }
  articles.forEach(inner)
}

async function main() {
  const sources = [
    arxiv,
    hn
  ]

  const feeds = await trySettle(sources.map(s => s()))
  const merged = mergeFeeds(...feeds)
  const articles = pickRandom(merged, NUM_RANDOM_PICKS)
  present(articles)
}

main()
  .catch(console.error)
