import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { ato } from '@/utils/utils'
import type { Sidestory } from '@/utils/types'
import sidestories from '@/data/sidestories.json'

export const useActivityStore = defineStore('activity', () => {
  const sidestoryList = reactive(ato(sidestories, 'id')) as Record<string, Sidestory>

  return { sidestoryList }
})
