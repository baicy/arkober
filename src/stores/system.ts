import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const timelinePosition = ref(0)

  return { timelinePosition }
})
