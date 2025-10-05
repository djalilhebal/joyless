import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStorage } from '@vueuse/core'

import type { YtsSearchParams } from 'src/api/yts';

export const useAppStore = defineStore('app', () => {
  const config = useStorage('joyless:config', {
    showSeen: true,
  });
  const searchParams = useStorage<YtsSearchParams>('joyless:searchParams', {
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
