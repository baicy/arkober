<script>
import { dayjs } from 'element-plus'
import { duration } from '@/utils'

const statusTypes = {
  battle: '作战',
  shop: '兑换'
}

export default {
  props: {
    activity: Object
  },
  setup(props) {
    const { open, close, re, type, poolType, status } = props.activity

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
    !tags.length && tags.push(props.activity.name)

    const statusText = statusTypes[status] || ''

    onMounted(() => {
      intervalId.value = setInterval(() => {
        const now = dayjs()
        const total = close.diff(open, 'second')
        const pass = now.diff(open, 'second')
        remain.value = total - pass
        remainText.value = duration(total - pass)
        progress.value = (pass / total) * 100
      }, 1000)
    })
    onBeforeUnmount(() => {
      clearInterval(intervalId.value)
    })

    return { remain, remainText, progress, tags, statusText }
  }
}
</script>
<template>
  <el-col :sm="24" :md="24" :lg="24">
    <el-row>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="flex">
            <el-tag v-for="tag in tags" :key="tag" effect="dark">{{ tag }}</el-tag>
            <el-text v-if="activity.name" class="name-label">{{ activity.name }}</el-text>
            <sidestory-card v-if="activity.type === 'sidestory'" :sidestory="activity" />
            <pool-card v-if="activity.type === 'pool'" :pool="activity" />
            <nosan-card v-if="activity.type === 'nosan'" :activity="activity" />
            <el-tag
              class="status-label"
              effect="dark"
              :type="remain < 3600 * 24 ? 'danger' : 'primary'"
            >
              {{ `${statusText}剩余${remainText}` }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-progress
          :percentage="progress"
          :stroke-width="3"
          :text-inside="true"
          :status="remain < 3600 * 24 ? 'exception' : ''"
        />
      </el-col>
    </el-row>
  </el-col>
</template>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  gap: 0px 20px;
}
.name-label {
  align-self: start;
}
.status-label {
  align-self: end;
}
:deep(.card-content) {
  flex-grow: 1;
}
</style>
