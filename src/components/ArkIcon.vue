<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getTextColor } from '@/utils'

const alias: Record<string, string> = {
  elite2: 'elite-phase-2'
}

const props = defineProps({
  icon: String,
  color: String,
  w: Number || undefined,
  h: Number || undefined,
  only: Boolean
})
const { icon, color, w, h, only } = props
const selfDom = ref()
const fill = ref(color)
const width = ref(w)
const height = ref(h)
const target = ref(icon)

if (only && !w && !h) {
  width.value = 24
  height.value = 24
}
if (icon && alias[icon]) {
  target.value = alias[icon]
}

onMounted(() => {
  if (!color) {
    let parentDom = selfDom.value.parentNode
    let bgColor = getComputedStyle(parentDom).backgroundColor
    while (bgColor === 'rgba(0, 0, 0, 0)') {
      parentDom = parentDom.parentNode
      bgColor = getComputedStyle(parentDom).backgroundColor
    }
    fill.value = getTextColor(bgColor)
  }
})
</script>
<template>
  <svg ref="selfDom" class="ark-icon" :width="width" :height="height" aria-hidden="true">
    <use :xlink:href="`#${target}`" :fill="fill" />
  </svg>
</template>
