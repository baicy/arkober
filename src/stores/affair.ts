import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import _activities from '@/data/activities.json'
import _pools from '@/data/pools.json'
import type { Activity, Pool, ActivityAffair, PoolAffair } from '@/utils/types'

const activities: Record<string, Activity> = _activities
const pools: Record<string, Pool> = _pools

export const useAffairStore = defineStore('affair', () => {
  const affairs = reactive({
    present: [] as (ActivityAffair | PoolAffair)[],
    future: [] as (ActivityAffair | PoolAffair)[],
    past: [] as (ActivityAffair | PoolAffair)[]
  })
  const queue: Record<string, any> = reactive({})
  load()

  function add(type: 'activity' | 'pool', origin: Activity | Pool) {
    let affair = {} as ActivityAffair | PoolAffair
    if (type === 'activity') {
      affair = addActivity(origin as Activity)
    } else {
      affair = addPool(origin as Pool)
    }
    const { id, status, open, close, remain } = affair
    if (id) {
      affairs[status].push(affair)
      queue[id] = {
        status,
        open,
        close,
        remain
      }
    }
  }

  function addActivity(origin: Activity) {
    if (!['SIDESTORY'].includes(origin.type)) {
      return {} as ActivityAffair
    }

    const now = dayjs().unix()
    const {
      id,
      name,
      startTime: open,
      endTime,
      rewardEndTime,
      type: activityType,
      isReplicate,
      color
    } = origin
    const close = now - endTime < 0 ? endTime : rewardEndTime
    const status = open > now ? 'future' : 'present'
    const activityStatus = now - endTime < 0 ? 'battle' : 'shop'
    const remain = status === 'future' ? open - now : close - now
    return {
      type: 'activity',
      status,
      id,
      name,
      open,
      close,
      activityType,
      activityStatus,
      isReplicate,
      color,
      remain
    } as ActivityAffair
  }
  function addPool(origin: Pool) {
    const now = dayjs().unix()
    const { id, name, open, type: poolType, pickup, color } = origin
    const close = open + 3600 * 24 * 14
    const status = open > now ? 'future' : 'present'
    const remain = status === 'future' ? open - now : close - now
    return {
      type: 'pool',
      status,
      id,
      name,
      open,
      close,
      poolType,
      pickup,
      color,
      remain
    } as PoolAffair
  }

  function load() {
    affairs.present = []
    affairs.future = []
    const now = dayjs().unix()
    for (const i in activities) {
      if (dayjs().diff(dayjs.unix(activities[i].startTime), 'day') > 50) {
        break
      }
      add('activity', activities[i])
    }
    for (const i in pools) {
      if (pools[i].open + 3600 * 24 * 14 < now) {
        break
      }
      add('pool', pools[i])
    }
    affairs.present.sort((a, b) => a.close - b.close)
    affairs.future.sort((a, b) => a.open - b.open)
  }

  const start = ref(-1)
  const countdown = (timestamp: number) => {
    if (start.value === -1) {
      start.value = timestamp
    }
    const elapsed = timestamp - start.value

    if (elapsed >= 1000) {
      start.value = timestamp

      const now = dayjs().unix()
      for (const id in queue) {
        const { status, open, close } = queue[id]
        queue[id].remain = status === 'present' ? close - now : open - now
      }
    }
    requestAnimationFrame(countdown)
  }
  const startCountdown = () => {
    requestAnimationFrame(countdown)
  }
  startCountdown()

  return { affairs, queue, startCountdown }
})
