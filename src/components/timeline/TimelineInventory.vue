<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import TimelineItem from './TimelineItem.vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/system'
import acts from '@/data/activities.json'
import gachas from '@/data/pools.json'

const dayWidth = 30
const cardHeight = 60
const dates = ref([])
const pools = ref([])
const activities = ref([])

pools.value = []
for (let i in gachas) {
  const { id, name, type, timeline = 1, start, days = 14, color, pickup, fake } = gachas[i]
  pools.value.push({
    id,
    fake,
    name: name || (type === 'standard' ? '标准寻访' : '中坚寻访'),
    type,
    timeline: type === 'standard' ? 5 : ['classic', 'cattain'].includes(type) ? 6 : timeline,
    rerun: type === 'rerun',
    start,
    days,
    color,
    pickup
  })
}
activities.value = acts

const firstDate = dayjs().year(2019).month(4).date(1).hour(0).minute(0).second(0).millisecond(0)
const lastAct = activities.value[0]
const lastDateOfAct = dayjs(lastAct.start).add(lastAct.days, 'day').unix()
const lastDateOfPool = dayjs(pools.value[0].start).add(14, 'days').unix()
const lastDate = dayjs.unix(Math.max(lastDateOfAct, lastDateOfPool))
dates.value = []
let cursor = firstDate
while (cursor <= lastDate) {
  dates.value.push(cursor)
  cursor = cursor.add(1, 'day')
}

const timelineRef = ref()
onMounted(() => {
  nextTick(() => {
    focus(dayjs())
    // focus('2025-03-23')
  })
})
const system = useSystemStore()
const setPosition = (pos) => {
  timelineRef.value.scrollLeft = pos
}
const route = useRoute()
watch(
  () => route.name,
  (id) => {
    if (id === 'home') {
      nextTick(() => {
        setPosition(system.timelinePosition)
      })
    }
  }
)
const rangeDate = () => {
  if (currentDay.value.isBefore(firstDate)) {
    currentDay.value = firstDate
  }
  if (currentDay.value.isAfter(lastDate)) {
    currentDay.value = lastDate
  }
}
const onMouseScroll = (e) => {
  const SCROLL_DAY = 3
  currentDay.value =
    e.deltaY > 0
      ? currentDay.value.add(SCROLL_DAY, 'day')
      : currentDay.value.subtract(SCROLL_DAY, 'day')
  rangeDate()
  timelineRef.value.scrollLeft =
    timelineRef.value.scrollLeft + dayWidth * SCROLL_DAY * (e.deltaY > 0 ? 1 : -1)
  system.timelinePosition = timelineRef.value.scrollLeft
}

const currentDay = ref(dayjs())
const selectedArea = ref([])
const focus = (day) => {
  if (day) {
    currentDay.value = dayjs(day)
  }
  currentDay.value = dayjs(currentDay.value).hour(0).minute(0).second(0).millisecond(0)
  selectedArea.value = [currentDay.value, 1]
  const cursorPosition = currentDay.value.diff(firstDate, 'day') * dayWidth
  const windowWidth = getComputedStyle(timelineRef.value).width.match(/(\d+.?\d*)px/)[1]
  timelineRef.value.scrollLeft = cursorPosition - windowWidth / 2
  system.timelinePosition = timelineRef.value.scrollLeft
}
const selectDay = (day) => {
  selectedArea.value = [day, 1]
}
const selectAffair = (affair) => {
  selectedArea.value = [dayjs(affair.start), affair.days || 14]
}
const disselect = () => {
  selectedArea.value = []
}
const years = ref([])
for (let i = 2019; i < dayjs().year() + 2; i++) {
  years.value.push(i)
}
const changeYear = (year) => {
  currentDay.value = currentDay.value.year(year)
  rangeDate()
  focus()
}
const changeMonth = (month) => {
  currentDay.value = currentDay.value.month(month - 1).date(1)
  rangeDate()
  focus()
}
</script>
<template>
  <v-sheet :elevation="6">
    <div
      class="mx-auto bg-surface overflow-x-auto position-relative ak-timeline"
      ref="timelineRef"
      @drag.prevent
      @mousewheel="onMouseScroll($event)"
      :style="{
        '--day-width': `${dayWidth}px`,
        '--card-height': `${cardHeight}px`,
        height: `${cardHeight * 7 + 80}px`
      }"
    >
      <!-- 选择高亮 -->
      <div
        v-if="selectedArea.length"
        class="position-absolute bg-primary opacity-20 calender-cursor"
        :style="{
          width: `${dayWidth * selectedArea[1]}px`,
          left: `${dayWidth * selectedArea[0].diff(firstDate, 'day')}px`
        }"
      ></div>
      <!-- 日期 -->
      <div class="h60 position-relative">
        <div class="d-flex position-relative" :style="{ top: `${dayWidth}px` }">
          <div
            class="border border-primary position-relative text-center calender-day text-primary"
            :class="{ 'calender-sunday': date.day() === 0 }"
            v-for="(date, index) in dates"
            :key="index"
            @click="selectDay(date)"
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
        <timeline-item
          v-for="act in activities"
          :key="act.id"
          :affair="act"
          @click="selectAffair(act)"
          :style="{
            left: `${dayjs(act.start).diff(firstDate, 'day') * dayWidth}px`,
            top: `${cardHeight * act.timeline}px`,
            width: `${act.days * dayWidth}px`,
            height: `${cardHeight}px`
          }"
        >
        </timeline-item>
        <timeline-item
          v-for="pool in pools"
          :key="pool.id"
          :affair="pool"
          @click="selectAffair(pool)"
          :style="{
            left: `${dayjs(pool.start).diff(firstDate, 'day') * dayWidth}px`,
            top: `${cardHeight * pool.timeline}px`,
            width: `${pool.days * dayWidth}px`,
            height: `${cardHeight}px`
          }"
        >
        </timeline-item>
      </div>
    </div>
    <div class="d-flex justify-end ga-2">
      <v-btn-group density="compact" color="primary" divided>
        <v-btn
          :variant="currentDay.month() === i - 1 ? 'flat' : 'tonal'"
          v-for="i in 12"
          :key="i"
          @click="changeMonth(i)"
        >
          {{ i }}月
        </v-btn>
      </v-btn-group>
      <v-menu activator="#year-changer">
        <v-list>
          <template v-for="year in years" :key="year">
            <v-hover v-slot="{ isHovering, props }">
              <v-list-item
                :value="index"
                class="cursor-pointer"
                :class="{ 'bg-primary': isHovering || year === currentDay.year() }"
                v-bind="props"
              >
                <v-list-item-title @click="changeYear(year)">{{ year }}</v-list-item-title>
              </v-list-item>
            </v-hover>
          </template>
        </v-list>
      </v-menu>
      <v-btn-group density="compact" color="primary" divided>
        <v-btn
          icon="mdi-menu-left"
          @click="changeYear(currentDay.year() - 1)"
          :disabled="currentDay.year() <= 2019"
        ></v-btn>
        <v-btn width="50" id="year-changer">
          {{ currentDay.year() > dayjs().year() + 1 ? currentDay.year() : currentDay.year() }}年
        </v-btn>
        <v-btn
          icon="mdi-menu-right"
          @click="changeYear(currentDay.year() + 1)"
          :disabled="currentDay.year() > dayjs().year()"
        ></v-btn>
        <v-btn @click="focus(dayjs())">今天</v-btn>
        <v-btn @click="disselect()" color="error">清除选择</v-btn>
      </v-btn-group>
    </div>
  </v-sheet>
</template>
<style scoped>
::-webkit-scrollbar {
  height: 0;
}
.ak-timeline {
  .calender-day {
    width: var(--day-width);
    min-width: var(--day-width);
    height: var(--day-width);
    line-height: var(--day-width);
    cursor: pointer;
  }
  .calender-sunday::before {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    right: -1px;
    background-color: rgba(var(--v-theme-primary), 0.5);
    clip-path: polygon(0 0, 100% 0, 100% 100%);
  }
  .first-of-month {
    position: absolute;
    top: -30px;
    left: -2px;
    max-width: inherit;
  }
  .calender-cursor {
    height: calc(var(--card-height) * 7 + var(--day-width));
    top: var(--day-width);
  }
}
</style>
