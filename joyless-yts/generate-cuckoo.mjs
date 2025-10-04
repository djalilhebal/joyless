// Generate joyless.cuckoo.json

import BloomFilters from 'bloom-filters';
import { writeFileSync } from 'fs';

const { CuckooFilter } = BloomFilters;

// 1% error rate
const ERROR_RATE = 0.01;

async function main() {
  const items = await getCompletedIds();

  const cuckooFilter = CuckooFilter.from(items, ERROR_RATE);
  const json = JSON.stringify(cuckooFilter.saveAsJSON());
  writeFileSync('public/joyless.cuckoo.json', json);
}

async function getCompletedIds() {
  /*
  const query = `
    SELECT url
    FROM media_items
    WHERE url IS NOT NULL
      AND status = 'DONE'
  `;
  const items = await db.query(query);
  */

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

main();
