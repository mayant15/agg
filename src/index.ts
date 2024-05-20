/**
 *  TODO:
 * - [ ] Tags
 * - [ ] GPT summaries for articles without summaries? (mainly HN)
 */

import chalk from "chalk"
import { getFeed as arxiv } from "./sources/arxiv"
import { getFeed as hn } from "./sources/hackernews"
import { trySettle } from './common'

import type { Article, Config, Feed } from "./common"

const config: Config = {
  maxArticlesPerFeed: 10,
  numRandomPicks: 3,
  sources: [
    arxiv,
    hn
  ],
  arxiv: {
    // from https://arxiv.org/category_taxonomy
    categories: [
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
  },
  hackernews: {
    type: 'top'
  }
}

function mergeFeeds(...feeds: Feed[]): Feed {
  return ([] as Feed).concat(...feeds)
}

function pickRandom(feed: Feed, num: number): Article[] {
  if (feed.length < num) return feed

  return Array(num)
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
  const feeds = await trySettle(config.sources.map(s => s(config)))
  const merged = mergeFeeds(...feeds)
  const articles = pickRandom(merged, config.numRandomPicks)
  present(articles)
}

main()
  .catch(console.error)
