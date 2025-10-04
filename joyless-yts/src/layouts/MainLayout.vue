<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-toolbar-title class="text-primary text-h5 text-bold">Joyless YTS</q-toolbar-title>

        <q-input color="black" label="Search" dense v-model="searchParams.searchText" placeholder="Search..." disable style="min-width: 200px"></q-input>

        <!-- Filters & Toggles -->
        <div class="row items-center q-gutter-lg text-grey-9">
          <q-toggle v-model="config.showSeen" label="Show seen" dense />

          <q-select v-model="searchParams.genre" :options="GENRE_OPTIONS" label="Genre" emit-value map-options
            option-value="value" option-label="label" dense style="min-width: 150px" />

          <q-select v-model="searchParams.rating" :options="RATING_OPTIONS" label="Rating" emit-value map-options
            option-value="value" option-label="label" dense style="min-width: 150px" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { setCssVar } from 'quasar';

import { useAppStore } from 'src/stores/app-store';

setCssVar('primary', '#6200ea');

const appStore = useAppStore();
const config = appStore.config;
const searchParams = appStore.searchParams;

const GENRE_OPTIONS = [
  //{ value: null, label: 'All' },
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'animation', label: 'Animation' },
  { value: 'biography', label: 'Biography' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'crime', label: 'Crime' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'drama', label: 'Drama' },
  { value: 'family', label: 'Family' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'film-noir', label: 'Film-Noir' },
  { value: 'game-show', label: 'Game-Show' },
  { value: 'history', label: 'History' },
  { value: 'horror', label: 'Horror' },
  { value: 'music', label: 'Music' },
  { value: 'musical', label: 'Musical' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'news', label: 'News' },
  { value: 'reality-tv', label: 'Reality-TV' },
  { value: 'romance', label: 'Romance' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'sport', label: 'Sport' },
  { value: 'talk-show', label: 'Talk-Show' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'war', label: 'War' },
  { value: 'western', label: 'Western' },
];

const RATING_OPTIONS = [
  //{ value: null, label: 'All' },
  { value: 9, label: '9+' },
  { value: 8, label: '8+' },
  { value: 7, label: '7+' },
  { value: 6, label: '6+' },
  { value: 5, label: '5+' },
  { value: 4, label: '4+' },
  { value: 3, label: '3+' },
  { value: 2, label: '2+' },
  { value: 1, label: '1+' }
];
</script>
