import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Character } from '@/utils/types'
import characters from '@/data/characters.json'
import { ato } from '@/utils/utils'

export const useCharacterStore = defineStore('character', () => {
  const list = reactive(ato(characters, 'id') as Record<string, Character>)

  return { list }
})
