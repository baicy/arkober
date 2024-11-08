<script setup>
import { ref } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { resourceCrate } from '@/utils/constants'

const { id, width, elite, unlock } = defineProps({
  id: String,
  width: Number,
  elite: Number,
  unlock: Boolean
})
const operator = useCharacterStore().list[id]
const name = ref(operator.name)
const size = ref(width)
if (size.value) {
  size.value = `${size.value}px`
} else {
  size.value = 'inherit'
}
</script>
<template>
  <div class="operator-cell" :class="{ 'operator-cell-unlock': unlock }">
    <img :src="`${resourceCrate}/avatar/${id}${elite === 2 ? '_2' : ''}.png`" :alt="name" />
  </div>
</template>
<style lang="scss" scoped>
$length: v-bind(size);
.operator-cell {
  width: $length;
  height: $length;
  img {
    width: 100%;
    height: 100%;
  }
  &-unlock {
    filter: grayscale(1);
  }
}
</style>
