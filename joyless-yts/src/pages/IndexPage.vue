<template>
  <q-page class="q-pa-md">
    <main class="movies-grid">
      <q-card v-for="movie in filteredResults" :key="movie.id" tag="a" :href="movie.imdbUrl" v-ripple
        style="width: 200px" class="movie cursor-pointer q-hoverable" :class="{
          '--seen': movie.seen,
        }">
        <q-img :src="movie.coverUrl" no-spinner alt="" loading="lazy" />
        <q-card-section>
          <div class="text-h6 ellipsis">
            <q-tooltip>{{ movie.title }}</q-tooltip>
            {{ movie.title }}
          </div>
          <div class="text-subtitle2 text-grey-9">{{ movie.year }}</div>
        </q-card-section>
      </q-card>
    </main>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue';
import { CuckooFilter } from 'bloom-filters';

import type { EnrichedYTSMovie, YTSMovie } from 'src/components/models';
import { useAppStore, type SearchParams } from 'src/stores/app-store';

const appStore = useAppStore();
const searchParams = appStore.searchParams;

const cuckooFilter = shallowRef<InstanceType<typeof CuckooFilter>>();

const searchResults = shallowRef<YTSMovie[]>();

const enrichedResults = computed<EnrichedYTSMovie[]>(() => {
  const withImdbUrls = searchResults.value?.map((movie) => ({
    ...movie,
    coverUrl: movie.medium_cover_image,
    // XXX: Leading slash is important.
    imdbUrl: `https://www.imdb.com/title/${movie.imdb_code}/`,
  }));
  const withSeen = withImdbUrls?.map((movie) => ({
    ...movie,
    seen: cuckooFilter.value?.has(movie.imdbUrl) ?? false,
  }));
  return withSeen ?? [];
});

const filteredResults = computed(() => {
  if (appStore.config.showSeen) {
    return enrichedResults.value;
  } else {
    return enrichedResults.value.filter(x => !x.seen);
  }
});

async function loadCuckoo() {
  const response = await fetch('/joyless.cuckoo.json');
  const json = await response.json();
  cuckooFilter.value = CuckooFilter.fromJSON(json);
}

async function loadResults(params: SearchParams) {
  searchResults.value = [];
  await fetch(`https://yts.mx/api/v2/list_movies.json?genre=${params.genre}&limit=50&minimum_rating=${params.rating}&sort_by=download_count`)
    .then((response) => response.json())
    .then((payload) => {
      console.debug('payload', payload);
      searchResults.value = payload.data.movies;
    });
}

watch(
  searchParams,
  async () => {
    await loadResults(searchParams);
  },
  {
    immediate: true,
    deep: true,
  }
)

onMounted(async () => {
  await loadCuckoo();
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
