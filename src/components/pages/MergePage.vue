<script setup>
import { ref, computed, onMounted } from 'vue'
import ChessboardInventory from '../merge/ChessboardInventory.vue'
import AlbumInventory from '../merge/AlbumInventory.vue'
import { useMergeGameStore } from '@/stores/mergeGame'
import { getShadowColor, len } from '@/utils'
import { DEFAULT_SKIN_COLOR } from '@/utils/constants'
import { Base64 } from 'js-base64'

const merge = useMergeGameStore()
const current = computed(() => merge.selected)
const forces = computed(() => merge.forceList)
const tickets = computed(() => merge.tickets)

const create = () => {
  merge.generate()
}
const battle = () => {
  merge.battle()
}
const sell = () => {
  merge.sell()
}

onMounted(() => {
  merge.load()
})

merge.$subscribe((mutation, state) => {
  const { chessboard, album, tickets } = state
  const storage = { chessboard, album, tickets }
  localStorage.setItem('merge', Base64.encode(encodeURIComponent(JSON.stringify(storage))))
})

const tab = ref('album')
</script>
<template>
  <v-container min-width="100%" height="100%" class="pa-2">
    <v-sheet class="d-flex h-100 ga-1">
      <chessboard-inventory />
      <div class="d-flex flex-column ga-1">
        <v-btn @click="create">调用干员</v-btn>
        <v-btn color="#a9d325">绿票:{{ tickets.green }}</v-btn>
        <v-btn color="#fde516">黄票:{{ tickets.yellow }}</v-btn>
        <v-sheet
          class="d-flex chessboard-cell align-center position-relative"
          :class="[
            `bg-rarity-${current.char.rarity || 0}`,
            { 'elite-2': current.char.elite === 2 }
          ]"
        >
          <div
            class="cell-text flex-grow-1 text-center cell-text"
            :class="[
              `cell-text-${getShadowColor(current.char[`color${current.char.elite}`])}`,
              { 'cell-text-len-2': len(current.char.name) === 4 },
              { 'cell-text-len-3': len(current.char.name) === 6 }
            ]"
            :style="{ color: current.char[`color${current.char.elite}`] || DEFAULT_SKIN_COLOR }"
          >
            {{ current.char.name }}
          </div>
        </v-sheet>
        <v-btn v-if="current.char.id" @click="battle">加入作战</v-btn>
        <v-btn v-if="current.char.id" @click="sell">信物兑换</v-btn>
      </div>
      <v-sheet class="h-100 flex-grow-1">
        <v-tabs v-model="tab" bg-color="secondary" color="surface">
          <v-tab value="album">档案中心</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" class="overflow-auto workarea">
          <v-tabs-window-item value="album">
            <album-inventory :forces="forces"></album-inventory>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-sheet>
    </v-sheet>
  </v-container>
</template>
<style lang="scss" scoped>
@import 'vuetify/settings';
.workarea {
  height: calc(100% - $tabs-height);
}
</style>
