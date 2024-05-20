# agg

A simple CLI aggregator that presents 3 recent articles from predefined sources.

## Usage

```bash
bun install
bun run src/index.ts
```

All available settings are at the top of `index.ts` in the `config` object.

agg doesn't use any Bun specific APIs so it can run on Node too with ts-node or similar.

