<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AffairCard from '@/components/AffairCard.vue'
import dayjs from 'dayjs'
import acts from '@/data/acts.json'
import gachas from '@/data/pools.json'

const dayWidth = ref(30)
const cardHeight = ref(60)
const dates = []
const currentYear = dayjs().year()
const activities = acts[currentYear]
const pools = ref([])
for (let i in gachas) {
  const { id, name, type, open, color, pickup } = gachas[i]
  const year = dayjs.unix(open).year()
  if (year === currentYear - 1) break
  if (year === currentYear && !['standard', 'classic', 'limited'].includes(type)) {
    pools.value.push({
      id,
      name,
      type,
      start: dayjs.unix(open).format('YYYY-MM-DD HH:mm'),
      color,
      pickup
    })
  }
}
const firstDate = dayjs().month(0).date(1).hour(4).minute(0).second(0)
const lastDateOfYear = dayjs().month(11).date(31).hour(4).minute(0).second(0)
const lastAct = activities[0]
const lastDateOfAct = dayjs(lastAct.start).add(lastAct.days, 'day')
const lastDate = lastDateOfAct.isAfter(lastDateOfYear) ? lastDateOfAct : lastDateOfYear
let cursor = firstDate
while (cursor <= lastDate) {
  dates.push(cursor)
  cursor = cursor.add(1, 'day')
}
const timelineRef = ref()
onMounted(() => {
  nextTick(() => {
    timelineRef.value.scrollLeft = (dayjs().diff(firstDate, 'day') - 20) * 30
  })
})
</script>
<template>
  <v-container max-width="calc(100% - 180px)" height="100%">
    <div
      class="h-100 mx-auto bg-surface overflow-x-auto position-relative ak-timeline"
      ref="timelineRef"
      :style="{ '--day-width': `${dayWidth}px`, '--card-height': `${cardHeight}px` }"
    >
      <!-- 日期 -->
      <div class="h60 position-relative">
        <div class="d-flex position-relative" :style="{ top: `${dayWidth}px` }">
          <div
            class="b1 position-relative"
            :class="[`sq${dayWidth}`]"
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
            top: `${cardHeight * (['SIDESTORY', 'BRANCHLINE', 'MAINLINE', 'MINISTORY'].includes(act.type) ? 0 : ['APRIL'].includes(act.type) ? 4 : 2)}px`,
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
            top: `${['joint', 'special'].includes(pool.type) ? cardHeight * 3 : cardHeight}px`,
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
  </v-container>
</template>
<style scoped>
.ak-timeline {
  .first-of-month {
    position: absolute;
    top: -30px;
    left: -2px;
    max-width: inherit;
  }
  .cursor-today {
    width: var(--day-width);
    height: calc(var(--card-height) * 5 + var(--day-width));
    top: var(--day-width);
    left: calc(var(--day-width) * var(--offset-day));
  }
}
</style>
