// Generate joyless.cuckoo.json

import { parseArgs } from 'node:util';
import { readFileSync, writeFileSync } from 'node:fs';

import BloomFilters from 'bloom-filters';
const { BloomFilter } = BloomFilters;

const { values: args } = parseArgs({
  options: {
    source: { type: 'string', default: 'sample' },
    input: { type: 'string', default: 'public/joyless.things.json' },
    output: { type: 'string', default: 'public/joyless.seen.json' },
    errorRate: { type: 'string', default: '0.01' }
  }
});

async function main() {
  const items = await getCompletedIds(args);

  const errorRate = Number(args.errorRate);
  const seenFilter = BloomFilter.from(items, errorRate);
  const json = JSON.stringify(seenFilter.saveAsJSON());
  writeFileSync(args.output, json);
}

async function getCompletedIds(params) {

  switch (params.source) {
    case 'sample': {

      const SAMPLE_COMPLETED_ITEMS = [
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
        // Treasure Planet
        'https://www.imdb.com/title/tt0133240/',

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

      return SAMPLE_COMPLETED_ITEMS;
    }

    case 'db': {
      console.error('Not implemented');
      process.exit(1);
      /*
      const query = `
        SELECT url
        FROM media_items
        WHERE url IS NOT NULL
          AND status = 'DONE'
      `;
      const items = await db.query(query);
      */
      break;
    }

    case 'json': {
      const items = JSON.parse(readFileSync(args.input, { encoding: 'utf-8' }));
      const completedItems = items
        .filter((item) => item.status === 'done')
        .filter((item) => typeof item.labels.imdb === 'string')
        .map((item) => `https://www.imdb.com/title/${item.labels.imdb}/`)
        ;
      return completedItems;
    }

    default: {
      console.error('Unexpected source');
      process.exit(1);
    }
  }

}

main();
