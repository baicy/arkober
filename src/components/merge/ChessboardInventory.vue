<script setup>
import { computed, ref, watch } from 'vue'
import { useMergeGameStore } from '@/stores/mergeGame'
import ChessboardCell from './ChessboardCell.vue'

const store = useMergeGameStore()
const cells = computed(() => store.chessboard)
const current = computed(() => store.selected)
// 以下三变量都是因为拖拽还没用得很明白，会发生不drop的end，不知如何避免
const moving = ref(false)
const dropped = ref(false)
const origin = ref({ x: -1, y: -1 })
// 限制拖拽速度，防止dragover时css重复渲染严重影响拖拽性能
const _target = ref({ x: -1, y: -1 })
const target = ref({ x: -1, y: -1 })

const select = (i, j) => {
  if (current.value.x === i && current.value.y === j) {
    target.value = { x: -1, y: -1 }
    store.unselect()
  } else {
    target.value = { x: i, y: j }
    store.select(i, j)
  }
}
const move = (i, j, id, event) => {
  target.value = { x: i, y: j }
  if (!id) {
    event.preventDefault()
    store.unselect()
    return false
  }
  event.dataTransfer.effectAllowed = 'move'
  moving.value = true
  dropped.value = false
  origin.value = { x: i, y: j }
  store.select(i, j)
  window.requestAnimationFrame(step)
}
const to = (i, j) => {
  moving.value = false
  store.merge(i, j)
  dropped.value = true
  target.value = { x: i, y: j }
  origin.value = { x: -1, y: -1 }
}
const over = (i, j) => {
  moving.value = true
  dropped.value = false
  _target.value = { x: i, y: j }
}
const end = () => {
  moving.value = false
  if (!dropped.value) {
    target.value = { ...origin.value }
  }
}

const start = ref(-1)
const step = (timestamp) => {
  if (start.value === -1) {
    start.value = timestamp
  }
  const elapsed = timestamp - start.value
  if (elapsed >= 100 && moving.value) {
    target.value = { ..._target.value }
  }
  if (moving.value) {
    window.requestAnimationFrame(step)
  }
}

watch(current, (cur) => {
  if (cur.x === -1) {
    target.value = { x: -1, y: -1 }
  }
})
</script>
<template>
  <div class="d-flex flex-column">
    <div v-for="(row, i) in cells" :key="i" class="d-flex">
      <chessboard-cell
        v-for="(cell, j) in row"
        :key="j"
        :cell="cell"
        class="d-flex chessboard-cell align-center position-relative border border-primary border-md"
        :class="[
          `bg-rarity-${cell.rarity}`,
          { 'cell-operator': cell.id },
          { 'elite-2': cell.elite === 2 },
          { 'cursor-grab': cell.id },
          { 'chessboard-cell-drag-over': target.x === i && target.y === j },
          { 'opacity-50': origin.x === i && origin.y === j },
          { 'merge-max': cell.rarity === 6 && cell.elite === 2 }
        ]"
        :draggable="cell.id ? true : false"
        @dragstart="move(i, j, cell.id, $event)"
        @dragenter.prevent
        @dragover.prevent="over(i, j)"
        @dragend="end"
        @drop.prevent="to(i, j)"
        @click="select(i, j)"
      >
      </chessboard-cell>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chessboard-cell-drag-over {
  border: 3px solid rgb(var(--v-theme-primary)) !important;
}
</style>
