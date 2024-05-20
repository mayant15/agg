export type Article = {
  id?: string
  title: string
  summary: string
  link: string
  tags: string[]
}

export type Feed = Article[]
