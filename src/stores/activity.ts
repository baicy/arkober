import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getActiveSidestories,
  getActivePools,
  getActiveNosans,
  getActiveDailyWorks,
  getActiveComings
} from '@/utils'

export const useActivityStore = defineStore('activity', () => {
  const activityList = ref([] as any[])
  const dailyworkList = ref([] as any[])
  const comingList = ref([] as any[])

  const activities = computed(() => {
    activityList.value = [
      ...getActiveSidestories(),
      ...getActivePools(),
      ...getActiveNosans()
    ].sort((a, b) => a.close.diff(b.close))
    return activityList
  })

  const dailyworks = computed(() => {
    dailyworkList.value = [...getActiveDailyWorks()].sort((a, b) => a.close.diff(b.close))
    return dailyworkList
  })

  const comings = computed(() => {
    comingList.value = [...getActiveComings()].sort((a, b) => a.close.diff(b.close))
    return comingList
  })

  return { activities, dailyworks, comings }
})
