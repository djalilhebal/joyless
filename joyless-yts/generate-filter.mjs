// Generate joyless.seen.json

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync } from 'node:fs';

import BloomFilters from 'bloom-filters';
const { CountingBloomFilter } = BloomFilters;

const { values: args } = parseArgs({
  options: {
    source: { type: 'string', default: 'sample' },
    input: { type: 'string', default: 'public/joyless.things.json' },
    output: { type: 'string', default: 'public/joyless.seen.json' },
    errorRate: { type: 'string', default: '0.01' }
  }
});

// e.g. imdb, mal
const RELEVANT_KEYS = ['imdb'];

async function main() {
  console.log(`Using source: ${args.source}...`);
  const completedKeys = await getCompletedKeys(args);
  const uniqueKeys = [...new Set(completedKeys)];

  const errorRate = Number(args.errorRate);
  console.log(`Generating filter for ${uniqueKeys.length} items with error rate ${errorRate}...`);
  const seenFilter = CountingBloomFilter.from(uniqueKeys, errorRate);

  console.log(`Writing filter to ${args.output}...`);
  const content = {
    generatedAt: (new Date()).toISOString(),
    errorRate: errorRate,
    itemCount: uniqueKeys.length,
    data: seenFilter.saveAsJSON(),
  };
  const serialized = JSON.stringify(content);
  writeFileSync(args.output, serialized);

  console.log('Done.');
}

async function getCompletedKeys(params) {

  switch (params.source) {
    case 'sample': {

      const SAMPLE_COMPLETED_IMDB_LINKS = [
        // --- 1980s animation ---
        // Akira
        'https://www.imdb.com/title/tt0094625/',
        // The Last Unicorn
        'https://www.imdb.com/title/tt0084237',

        // --- 1990s animation ---
        // Princess Mononoke
        'https://www.imdb.com/title/tt0119698/',
        // Toy Story
        'https://www.imdb.com/title/tt0114709/',

        // --- 2000s animation ---
        // The Incredibles
        'https://www.imdb.com/title/tt0317705/',
        // Spirited Away
        'https://www.imdb.com/title/tt0245429/',

        // --- 2010s animation ---
        // Coco
        'https://www.imdb.com/title/tt2380307/',
        // How to Train Your Dragon
        'https://www.imdb.com/title/tt0892769/',

        // --- 2020s animation ---
        // Evangelion: 3.0+1.01 Thrice Upon a Time
        'https://www.imdb.com/title/tt2458948/',
        // Ne Zha 2
        'https://www.imdb.com/title/tt34956443/',
      ];
      const completedKeys = SAMPLE_COMPLETED_IMDB_LINKS.map((url) => url.replace('https://www.imdb.com/title/', 'imdb:').replace('/', ''));

      return completedKeys;
    }

    case 'db': {
      console.error('Not implemented');
      process.exit(1);
      /*
      const query = `
        SELECT 'imdb:' || imdb_code AS key
        FROM media_items
        WHERE status = 'done'
          AND imdb_code IS NOT NULL
      `;
      const rows = await db.query(query);
      const completedKeys = rows.map((row) => row.key);
      */
      return [];
    }

    case 'json': {
      // Assume joyless.things.json structure
      const items = JSON.parse(readFileSync(args.input, { encoding: 'utf-8' }));
      const completedKeys = items
        .filter((item) => item.status === 'done')
        .flatMap((item) => {
          const keys = [];
          for (const urn of RELEVANT_KEYS) {
            if (typeof item.labels[urn] === 'string') {
              keys.push(`${urn}:${item.labels[urn]}`);
            }
          }
          return keys;
        });
      return completedKeys;
    }

    default: {
      console.error('Unexpected source');
      process.exit(1);
    }
  }

}

main();
