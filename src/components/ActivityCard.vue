<script>
import { dayjs } from 'element-plus'
import { duration } from '@/utils'

const statusTypes = {
  battle: '作战',
  shop: '兑换'
}

const activityTypes = ['sidestory', 'pool', 'nosan', 'tower']
const countdownTypes = ['daily', 'live']

export default {
  props: {
    activity: Object
  },
  setup(props) {
    const { open, close, re, type, poolType, dailyType, forecast, status } = props.activity

    const intervalId = ref(null)
    const remain = ref(0)
    const remainText = ref('14天 12:00:00')
    const progress = ref(0)

    const tags = []
    type === 'sidestory' && tags.push('SideStory')
    poolType === 'single' && tags.push('标准寻访')
    poolType === 'standard' && tags.push('标准寻访')
    poolType === 'classic' && tags.push('中坚寻访')
    re && tags.push('复刻')
    type === 'daily' && dailyType === 'day' && tags.push('每日更新')
    type === 'daily' && dailyType === 'week' && tags.push('每周更新')
    type === 'daily' && dailyType === 'month' && tags.push('每月更新')
    type === 'live' && tags.push('直播')
    type === 'tower' && tags.push('保全派驻')
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

    return { remain, remainText, progress, tags, statusText, coming }
  }
}
</script>
<template>
  <el-row>
    <el-col :span="24">
      <el-card shadow="hover">
        <div class="flex">
          <el-space direction="vertical" alignment="flex-start">
            <el-tag v-for="tag in tags" :key="tag" effect="dark">{{ tag }}</el-tag>
          </el-space>
          <sidestory-card v-if="activity.type === 'sidestory'" :sidestory="activity" />
          <pool-card v-if="activity.type === 'pool'" :pool="activity" />
          <nosan-card v-if="activity.type === 'nosan'" :activity="activity" />
          <daily-card v-if="['daily', 'tower'].includes(activity.type)" :work="activity" />
          <live-card v-if="activity.type === 'live'" :live="activity" />
          <el-tag
            class="status-label"
            effect="dark"
            :type="remain < 3600 * 24 ? (coming ? 'success' : 'danger') : 'primary'"
          >
            {{ `${statusText}剩余${remainText}` }}
          </el-tag>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-progress
        v-if="progress"
        :percentage="progress"
        :stroke-width="3"
        :text-inside="true"
        :status="remain < 3600 * 24 ? 'exception' : ''"
      />
    </el-col>
  </el-row>
</template>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  gap: 0px 20px;
}
.status-label {
  align-self: end;
}
:deep(.card-content) {
  flex-grow: 1;
}
</style>
