<template>
  <q-page class="q-pa-md">
    <main class="movies-grid">
      <q-card
        v-for="movie in filteredResults"
        :key="movie.id"
        style="width: 200px"
        class="movie"
        :class="{
          '--seen': movie.seen,
        }"
      >
        <q-img :src="movie.coverUrl" no-spinner alt="" loading="lazy" />
        <q-card-section>
          <div class="text-h6 ellipsis">
            <q-tooltip>{{ movie.title }}</q-tooltip>
            {{ movie.title }}
          </div>
          <div class="flex flex-row justify-between items-center">
            <div class="text-body2 text-grey-9">{{ movie.year }}</div>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                flat
                dense
                size="md"
                color="grey-8"
                icon="open_in_new"
                :href="movie.imdbUrl"
                target="_blank"
                rel="noopener"
              ></q-btn>
              <q-btn
                v-if="supportsRemoval"
                flat
                dense
                :color="movie.seen ? 'grey-8' : 'primary'"
                :icon="movie.seen ? 'remove_done' : 'done'"
                @click.stop="toggleSeen(movie)"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, ref, watch } from 'vue';
import { BloomFilter, CountingBloomFilter, CuckooFilter } from 'bloom-filters';

import type { EnrichedYtsMovie } from 'src/components/models';
import { useAppStore } from 'src/stores/app-store';
import type { YtsSearchParams } from 'src/api/yts';
import { getMovies } from 'src/api/yts';

const appStore = useAppStore();
const searchParams = appStore.searchParams;

type WellknownFilterType = 'CuckooFilter' | 'CountingBloomFilter' | 'BloomFilter';
type SeenFilter = InstanceType<
  typeof CuckooFilter | typeof CountingBloomFilter | typeof BloomFilter
>;

const seenFilter = shallowRef<SeenFilter>();
const supportsRemoval = computed(() => {
  if (!seenFilter.value) {
    return false;
  }
  return 'remove' in seenFilter.value;
});

const searchResults = ref<EnrichedYtsMovie[]>([]);

const filteredResults = computed(() => {
  if (appStore.config.showSeen) {
    return searchResults.value;
  } else {
    return searchResults.value.filter((x) => !x.seen);
  }
});

function toggleSeen(movie: EnrichedYtsMovie) {
  if (!seenFilter.value || !('remove' in seenFilter.value)) {
    console.error('Seen filter not loaded or does not support removal');
    return;
  }

  if (movie.seen) {
    seenFilter.value.remove(movie.key);
    movie.seen = false;
  } else {
    seenFilter.value.add(movie.key);
    movie.seen = true;
  }

  persistFilter();
}

const FILTER_STORAGE_KEY = 'joyless:filter';

function persistFilter() {
  if (!seenFilter.value) {
    return;
  }
  const filterJson = seenFilter.value.saveAsJSON();
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filterJson));
}

// Try to restore filter from local storage, overrides the fetched one if present
function tryRestoreFilter() {
  const filterJsonStr = localStorage.getItem(FILTER_STORAGE_KEY);
  if (!filterJsonStr) {
    return;
  }
  const filterJson = JSON.parse(filterJsonStr);
  loadSeenFilter(filterJson);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadSeenFilter(filterJson: any) {
  switch (filterJson.type as WellknownFilterType) {
    case 'CuckooFilter':
      seenFilter.value = CuckooFilter.fromJSON(filterJson);
      break;
    case 'CountingBloomFilter':
      seenFilter.value = CountingBloomFilter.fromJSON(filterJson);
      break;
    case 'BloomFilter':
      seenFilter.value = BloomFilter.fromJSON(filterJson);
      break;
    default:
      throw new Error(`Unknown filter type: ${filterJson.type}`);
  }
}

async function fetchMySeenFilter() {
  const payload = await fetch('/joyless.seen.json').then((res) => res.json());

  const filterJson = await payload.data;
  loadSeenFilter(filterJson);
}

async function loadResults(params: YtsSearchParams) {
  try {
    searchResults.value = [];
    const movies = await getMovies(params);
    searchResults.value = movies.map((movie) => ({
      ...movie,
      coverUrl: movie.medium_cover_image,
      imdbUrl: `https://www.imdb.com/title/${movie.imdb_code}/`,
      key: `imdb:${movie.imdb_code}`,
      seen: seenFilter.value?.has(`imdb:${movie.imdb_code}`) ?? false,
    }));
  } catch (e) {
    console.error('Failed to load search results', e);
    return;
  }
}

watch(
  searchParams,
  async () => {
    await loadResults(searchParams);
  },
  {
    deep: true,
  },
);

onMounted(async () => {
  await fetchMySeenFilter();
  tryRestoreFilter();
  await loadResults(searchParams);
});
</script>

<style>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;

  max-width: 1200px;
  margin: auto;
}

.movie {
  text-decoration: none;
  color: inherit;
}

.movie.--seen {
  opacity: 0.5;
}
</style>
