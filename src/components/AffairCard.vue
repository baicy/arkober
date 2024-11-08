<script setup>
import { ref, computed } from 'vue'
import { duration } from '@/utils/utils'
import { useAffairStore } from '@/stores/affair'
import dayjs from 'dayjs'
import PoolAffairCard from './PoolAffairCard.vue'
import ActivityAffairCard from './ActivityAffairCard.vue'

const { affair } = defineProps({ affair: Object })
const { id, name, open, close, type, status, color = [] } = affair
const store = useAffairStore()
const remain = computed(() => store.queue[id].remain)
const progress = computed(() => (1 - remain.value / (close - open)) * 100)
const progressColor = computed(() =>
  remain.value < 3600 * 24 ? (status === 'future' ? 'success' : 'error') : 'primary'
)
const target = ref(dayjs.unix(status === 'future' ? open : close).format('YYYY-MM-DD HH:mm:ss'))

const color1 = ref(color[0])
const color2 = ref(color[1])
if (!color1.value && type === 'pool') {
  color1.value = affair.poolType === 'classic' ? '#0098dc' : '#ffd524'
}
const title = ref(name)
const icon = ref({ type: 'mdi', name: 'mdi-chevron-double-up' })
if (type === 'pool') {
  if (!title.value) {
    title.value = affair.poolType === 'classic' ? '中坚寻访' : '标准寻访'
  }
  if (affair.poolType === 'joint') {
    icon.value.name = 'mdi-target'
  }
}
if (type === 'activity') {
  icon.value.type = 'ark'
  if (affair.activityType === 'SIDESTORY') {
    icon.value.name = 'sidestory'
  }
}
</script>
<template>
  <v-sheet
    :elevation="6"
    width="300px"
    height="calc(100% - 16px)"
    class="position-relative mt-2"
    color="#fcfcfc"
    :style="{ '--shadow-color': '#313131' }"
  >
    <div
      class="affair-title text-center pa-1 bg-primary text-shadow font-weight-bold"
      :class="`affair-title-color-${Boolean(color1) + Boolean(color2)}`"
      :style="{ '--color-1': color1, '--color-2': color2 }"
    >
      <ark-icon v-if="icon.type === 'ark'" :icon="icon.name" only style="margin-bottom: -6px" />
      <v-icon
        v-else
        :icon="icon.name"
        class="position-relative"
        style="height: 10px; bottom: 1px"
      />
      {{ title }}
    </div>
    <v-chip
      v-if="status === 'future'"
      class="position-absolute right-0 bottom-0 cursor-default"
      :class="{ 'mb-3': progress }"
      variant="flat"
      size="small"
      :color="progressColor"
      prepend-icon="mdi-clock-outline"
    >
      {{ duration(remain) }}
      <v-tooltip v-if="target" activator="parent" location="left">
        {{ target }}
      </v-tooltip>
    </v-chip>
    <v-tooltip v-if="target" location="top">
      {{ target }}
      <template v-slot:activator="{ props }">
        <v-progress-linear
          v-bind="props"
          absolute
          class="bottom-0 mb-3"
          :style="{ top: 'inherit' }"
          v-if="status === 'present'"
          :color="progressColor"
          bg-opacity="0.6"
          height="26"
          :model-value="progress"
        >
          <span class="text-caption text-white">
            <v-icon icon="mdi-clock" class="mr-1" />{{ duration(remain) }}
          </span>
        </v-progress-linear>
      </template>
    </v-tooltip>
    <activity-affair-card :affair="affair" v-if="type === 'activity'" />
    <pool-affair-card :affair="affair" v-if="type === 'pool'" />
  </v-sheet>
</template>
<style lang="scss" scoped>
.affair-title {
  letter-spacing: 0.15em;
  text-indent: 0.15em;
}
.affair-title-color-1 {
  background: var(--color-1) !important;
}
.affair-title-color-2 {
  background: linear-gradient(to right, var(--color-1), var(--color-2));
}
</style>
