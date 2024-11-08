<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { duration } from '@/utils'
import SidestoryCard from './activity/SidestoryCard.vue'
import PoolCard from './activity/PoolCard.vue'
import NosanCard from './activity/NosanCard.vue'
import DailyCard from './countdown/DailyCard.vue'
import LiveCard from './countdown/LiveCard.vue'
import UpdateCard from './countdown/UpdateCard.vue'

const statusTypes = {
  battle: '作战',
  shop: '兑换'
}

const activityTypes = ['sidestory', 'pool', 'nosan', 'tower']
const countdownTypes = ['daily', 'live', 'update']

const props = defineProps({ activity: Object })

const { open, close, re, type, poolType, dailyType, forecast, status } = props.activity

const intervalId = ref(null)
const remain = ref(0)
const remainText = ref('')
const progress = ref(0)
const target = ref(close.format('YYYY-MM-DD HH:mm:ss'))

const tags = []
type === 'sidestory' && tags.push('SideStory')
poolType === 'single' && tags.push('标准寻访')
poolType === 'standard' && tags.push('标准寻访')
poolType === 'classic' && tags.push('中坚寻访')
re && tags.push('复刻')
type === 'daily' && dailyType === 'day' && tags.push('每日更新')
type === 'daily' && dailyType === 'week' && tags.push('每周更新')
type === 'daily' && dailyType === 'month' && tags.push('每月更新')
type === 'tower' && tags.push('保全派驻')
type === 'live' && tags.push('直播')
type === 'update' && tags.push('更新')
forecast && tags.push('预计')
!tags.length && tags.push(props.activity.name)

const coming = type === 'live' ? true : false

const statusText = statusTypes[status] || ''

onMounted(() => {
  intervalId.value = setInterval(() => {
    const now = dayjs()
    if (activityTypes.includes(type)) {
      const total = close.diff(open, 'second')
      const pass = now.diff(open, 'second')
      remain.value = total - pass
      remainText.value = duration(remain.value)
      progress.value = (pass / total) * 100
    }
    if (countdownTypes.includes(type)) {
      remain.value = close.diff(now, 'second')
      remainText.value = duration(remain.value)
    }
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(intervalId.value)
})
</script>
<template>
  <v-row dense>
    <v-col :cols="12">
      <v-sheet elevation="6" :min-height="60" class="position-relative" ref="card">
        <v-chip
          v-for="tag in tags"
          :key="tag"
          color="primary"
          variant="flat"
          size="small"
          class="position-absolute mr-1"
        >
          {{ tag }}
        </v-chip>
        <p v-if="activity.name" class="position-absolute top-0 right-0 text-h5 activity-name">
          {{ activity.name }}
        </p>
        <div class="pt-9 pb-4 pl-4">
          <sidestory-card v-if="activity.type === 'sidestory'" :sidestory="activity" />
          <pool-card v-if="activity.type === 'pool'" :pool="activity" />
          <nosan-card v-if="activity.type === 'nosan'" :activity="activity" />
          <daily-card v-if="['daily', 'tower'].includes(activity.type)" :work="activity" />
          <live-card v-if="activity.type === 'live'" :live="activity" />
          <update-card v-if="activity.type === 'update'" :update="activity" />
        </div>
        <v-chip
          v-if="remainText"
          class="position-absolute right-0 bottom-0 cursor-default"
          :class="{ 'mb-3': progress }"
          variant="flat"
          size="small"
          :color="remain < 3600 * 24 ? (coming ? 'success' : 'error') : 'primary'"
        >
          {{ `${statusText}剩余${remainText}` }}
          <v-tooltip activator="parent" location="bottom">{{ target }}</v-tooltip>
        </v-chip>
        <v-progress-linear
          class="position-absolute bottom-0"
          :style="{ top: 'inherit' }"
          v-if="progress"
          :color="remain < 3600 * 24 ? 'error' : 'primary'"
          height="5"
          :model-value="progress"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<style scoped>
.activity-name {
  text-shadow: 2px -2px #bdbdbe;
  letter-spacing: 5px !important;
}
</style>
