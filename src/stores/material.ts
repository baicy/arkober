import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { ato } from '@/utils/utils'
import type { Material } from '@/utils/types'
import materials from '@/data/materials.json'

export const useMaterialStore = defineStore('material', () => {
  const list = reactive(ato(materials, 'id') as Record<string, Material>)

  return { list }
})
