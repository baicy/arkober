<script setup>
import OperatorIcon from '../operator/OperatorIcon.vue'
const { cell } = defineProps({ cell: Object })
</script>
<template>
  <div>
    <operator-icon
      v-if="cell.id"
      :id="cell.id"
      :elite="cell.elite"
      style="margin-top: 6px"
    ></operator-icon>
  </div>
</template>
<style lang="scss" scoped>
:deep(.operator-cell) {
  img {
    filter: drop-shadow(1px -2px 1px #777777);
  }
}
</style>
