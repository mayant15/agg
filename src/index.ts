import chalk from "chalk"
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

function present(articles: Article[]) {
  const l = console.log
  function inner({title, summary, link}: Article, index: number) {
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
  const ax = await arxiv()
  const articles = pickRandom(ax, NUM_RANDOM_PICKS)
  present(articles)
}

main()
  .catch(console.error)
