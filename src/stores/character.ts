import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Character } from '@/utils/types'
import freeCharacters from '@/data/character/free.json'
import normalCharacters from '@/data/character/normal.json'
import classicCharacters from '@/data/character/classic.json'

export const useCharacterStore = defineStore('character', () => {
  const listById = reactive({} as Record<string, Character>)
  function initListById() {
    const allList = [...freeCharacters, ...normalCharacters, ...classicCharacters]
    for (const i in allList) {
      listById[allList[i].id] = { ...allList[i] }
    }
  }

  return { listById, initListById }
})
