<script setup>
import { useMaterialStore } from '@/stores/material'
import { resourceCrate } from '@/utils/constants'

const props = defineProps({
  material: String
})
const { material } = props

const store = useMaterialStore()
const materials = store.list
const { id, name } = materials[material]
</script>
<template>
  <div class="material-cell">
    <img :src="`${resourceCrate}/item/${id}.png`" :alt="name" />
  </div>
</template>
<style lang="scss" scoped>
$length: 50px;
.material-cell {
  display: inline-block;
  width: $length;
  height: $length;
  img {
    width: $length;
    height: $length;
  }
}
</style>
