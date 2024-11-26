<script setup>
import { ref, onMounted, nextTick, watchEffect } from 'vue'
import AffairCard from '@/components/AffairCard.vue'
import dayjs from 'dayjs'
import acts from '@/data/acts.json'
import gachas from '@/data/pools.json'

const { currentYear } = defineProps({ currentYear: Number })
const dayWidth = 30
const cardHeight = 60
const dates = ref([])
const firstDate = ref()
const pools = ref([])
const activities = ref([])

watchEffect(() => {
  load(currentYear)
})
function load(year) {
  const firstDateOfYear = dayjs().year(year).month(0).date(1).hour(4).minute(0).second(0)
  let firstPool = null
  pools.value = []
  for (let i in gachas) {
    const { id, name, type, open: openTime, color, pickup } = gachas[i]
    const open = dayjs.unix(openTime)
    const close = open.add(14, 'day')
    if (close.year() === year - 1) break
    if (open.year() === year || close.year() === year) {
      pools.value.push({
        id,
        name,
        type,
        start: open.format('YYYY-MM-DD HH:mm'),
        color,
        pickup
      })
      firstPool = open
    }
  }
  firstDate.value = firstPool.isBefore(firstDateOfYear)
    ? firstPool.hour(0).minute(0).second(0)
    : firstDateOfYear

  const lastDateOfYear = dayjs().year(year).month(11).date(31).hour(4).minute(0).second(0)

  activities.value = acts.filter(
    (a) => dayjs(a.start).year() === year || dayjs(a.start).add(a.days, 'day').year() === year
  )
  const lastAct = activities.value[0]
  const lastDateOfAct = dayjs(lastAct.start).add(lastAct.days, 'day')
  const lastDate = lastDateOfAct.isAfter(lastDateOfYear) ? lastDateOfAct : lastDateOfYear
  dates.value = []
  let cursor = firstDate.value
  while (cursor <= lastDate) {
    dates.value.push(cursor)
    cursor = cursor.add(1, 'day')
  }
}

const timelineRef = ref()
onMounted(() => {
  nextTick(focus())
})
const focus = (month) => {
  let day = dayjs().year(currentYear)
  if (month) {
    day = day.month(month - 1).date(1)
  }
  day = day.hour(0).minute(0).second(0)
  const cursorPosition = day.diff(firstDate.value, 'day') * dayWidth
  const windowWidth = getComputedStyle(timelineRef.value).width.match(/(\d+.?\d*)px/)[1]
  timelineRef.value.scrollLeft = cursorPosition - windowWidth / 2
}
const Typeline = {
  SIDESTORY: 0,
  BRANCHLINE: 0,
  MAINLINE: 0,
  MINISTORY: 0,
  APRIL: 4,
  single: 1,
  rerun: 1,
  fes: 1,
  spring: 1,
  summer: 1,
  linkage: 1,
  joint: 3,
  special: 3,
  limited: 4,
  standard: 5,
  classic: 6
}
</script>
<template>
  <v-sheet width="calc(100% - 180px)" class="mx-auto">
    <div
      class="mx-auto bg-surface overflow-x-auto position-relative ak-timeline"
      ref="timelineRef"
      :style="{
        '--day-width': `${dayWidth}px`,
        '--card-height': `${cardHeight}px`,
        height: `${cardHeight * 7 + 80}px`
      }"
    >
      <!-- 日期 -->
      <div class="h60 position-relative">
        <div class="d-flex position-relative" :style="{ top: `${dayWidth}px` }">
          <div
            class="b1 position-relative text-center calender-day"
            :class="{ 'calender-sunday': date.day() === 0 }"
            v-for="(date, index) in dates"
            :key="index"
          >
            <span>{{ date.date() }}</span>
            <v-chip v-if="date.date() === 1" class="first-of-month" color="primary">
              {{ date.month() + 1 }}月
            </v-chip>
          </div>
        </div>
      </div>
      <!-- 活动 -->
      <div class="position-relative">
        <affair-card
          v-for="act in activities"
          :key="act.id"
          :affair="act"
          :style="{
            left: `${dayjs(act.start).diff(firstDate, 'day') * dayWidth}px`,
            top: `${cardHeight * (Typeline[act.type] === undefined ? 2 : Typeline[act.type])}px`,
            width: `${act.days * dayWidth}px`,
            height: `${cardHeight}px`
          }"
        >
        </affair-card>
        <affair-card
          v-for="pool in pools"
          :key="pool.id"
          :affair="pool"
          :style="{
            left: `${dayjs(pool.start).diff(firstDate, 'day') * dayWidth}px`,
            top: `${cardHeight * Typeline[pool.type]}px`,
            width: `${14 * dayWidth}px`,
            height: `${cardHeight}px`
          }"
        >
        </affair-card>
      </div>
      <!-- 今天 -->
      <div
        class="position-absolute bg-primary opacity-40 cursor-today"
        :style="{ '--offset-day': dayjs().diff(firstDate, 'day') }"
      ></div>
    </div>
    <div class="d-flex justify-space-around">
      <v-btn v-for="i in 6" :key="i" @click="focus(i)">{{ i }}月</v-btn>
      <v-btn @click="focus()">今天</v-btn>
      <v-btn v-for="i in [7, 8, 9, 10, 11, 12]" :key="i" @click="focus(i)">{{ i }}月</v-btn>
    </div>
  </v-sheet>
</template>
<style scoped>
.ak-timeline {
  .calender-day {
    width: var(--day-width);
    min-width: var(--day-width);
    height: var(--day-width);
    line-height: var(--day-width);
  }
  .calender-sunday::before {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    right: -1px;
    background-color: #313131;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
  }
  .first-of-month {
    position: absolute;
    top: -30px;
    left: -2px;
    max-width: inherit;
  }
  .cursor-today {
    width: var(--day-width);
    height: calc(var(--card-height) * 7 + var(--day-width));
    top: var(--day-width);
    left: calc(var(--day-width) * var(--offset-day));
  }
}
</style>
