<script setup lang="js">
import { reactive } from 'vue'
import { useActivityStore } from '@/stores/activity'
import OperatorTag from './operator/OperatorTag.vue'
import materialCell from './material/MaterialCell.vue'

const { affair } = defineProps({ affair: Object })
const { id, activityType } = affair
const activity = reactive({})
const store = useActivityStore()
if (activityType === 'SIDESTORY') {
  Object.assign(activity, store.sidestoryList[id])
}
const { reward, drop } = activity
</script>
<template>
  <v-sheet class="d-flex flex-column">
    <div class="d-flex">
      <v-btn prepend-icon="mdi-seal-variant" variant="tonal" density="comfortable">奖励</v-btn>
      <operator-tag :char="reward" />
    </div>
    <div class="d-flex mt-1">
      <v-btn prepend-icon="mdi-molecule" variant="tonal" density="comfortable">掉落</v-btn>
      <material-cell v-for="material in drop" :key="material" :material="material" />
    </div>
  </v-sheet>
</template>
