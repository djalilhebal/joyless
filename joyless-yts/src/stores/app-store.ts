import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export interface SearchParams {
  genre: string;
  rating: number;
}

export const useAppStore = defineStore('app', () => {
  const config = ref({
    showSeen: true,
  });
  const searchParams = ref<SearchParams>({
    genre: 'animation',
    rating: 8,
  });

  return {
    config,
    searchParams,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot));
}
