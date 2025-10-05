<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-toolbar-title class="text-primary text-h5 text-bold">Joyless YTS</q-toolbar-title>

        <!-- Filters & Toggles -->
        <div class="row items-center q-gutter-lg text-grey-9">
          <q-toggle v-model="config.showSeen" label="Show seen" dense />

          <q-select v-model="searchParams.genre" :options="GENRE_OPTIONS" label="Genre" emit-value map-options
            option-value="value" option-label="label" dense style="min-width: 150px" />

          <q-select v-model="searchParams.rating" :options="RATING_OPTIONS" label="Rating" emit-value map-options
            option-value="value" option-label="label" dense style="min-width: 150px" />

            <q-btn flat dense icon="code" color="primary" href="https://github.com/djalilhebal/joyless">
              <q-tooltip>Source code</q-tooltip>
            </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAppStore } from 'src/stores/app-store';
import { GENRE_OPTIONS, RATING_OPTIONS } from 'src/api/yts';

const appStore = useAppStore();
const config = appStore.config;
const searchParams = appStore.searchParams;
</script>
