import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getActiveSidestories, getActivePools, getActiveNosans } from '@/utils'

export const useActivityStore = defineStore('activity', () => {
  const list = ref([] as any[])

  const activities = computed(() => {
    list.value = [...getActiveSidestories(), ...getActivePools(), ...getActiveNosans()].sort(
      (a, b) => a.close.diff(b.close)
    )
    return list
  })

  return { activities }
})
