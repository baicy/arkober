<script setup>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import OperatorTag from './operator/OperatorTag.vue'
import characters from '@/data/characters.json'

const { affair } = defineProps({ affair: Object })
const { pickup = [], poolType, open } = affair
const chances = reactive([])

if (['spring', 'summer', 'fes'].includes(poolType)) {
  const stat = reactive({ limit: [], normal: [] })
  for (const i in characters) {
    const char = characters[i]
    if (char.rarity === 6) {
      if (
        char.type === 'limited' &&
        char.source === poolType &&
        dayjs().diff(dayjs.unix(char.onlineTime), 'year') > 0
      ) {
        stat.limit.push(char.id)
      }
      if (char.type === '' && char.classicTime === -1 && char.onlineTime !== open) {
        stat.normal.push(char.id)
      }
    }
  }
  const piece =
    30 /
    (Math.min(stat.limit.length, 3) * 5 + Math.max(stat.limit.length - 3, 0) + stat.normal.length)
  chances.push({
    rarity: 6,
    floors: [
      { chance: 35, chars: pickup.find((p) => p.rarity === 6).chars },
      { chance: piece * 5, chars: stat.limit.slice(0, 3) },
      { chance: piece, chars: stat.limit.slice(3) }
    ]
  })
  chances.push({
    rarity: 5,
    floors: [{ chance: 50, chars: pickup.find((p) => p.rarity === 5).chars }]
  })
} else {
  if (['standard', 'classic', 'special'].includes(poolType)) {
    chances.push({
      rarity: 6,
      floors: [{ chance: 25, chars: pickup.find((p) => p.rarity === 6).chars }]
    })
    chances.push({
      rarity: 5,
      floors: [{ chance: 50 / 3, chars: pickup.find((p) => p.rarity === 5).chars }]
    })
  }
  if (['joint'].includes(poolType)) {
    chances.push({
      rarity: 6,
      floors: [{ chance: 25, chars: pickup.find((p) => p.rarity === 6).chars }]
    })
    const char5 = pickup.find((p) => p.rarity === 5).chars
    chances.push({ rarity: 5, floors: [{ chance: 100 / char5.length, chars: char5 }] })
  }
  if (['single', 'rerun', 'linkage'].includes(poolType)) {
    chances.push({
      rarity: 6,
      floors: [{ chance: 50, chars: pickup.find((p) => p.rarity === 6).chars }]
    })
    chances.push({
      rarity: 5,
      floors: [{ chance: 25, chars: pickup.find((p) => p.rarity === 5).chars }]
    })
  }
}
</script>
<template>
  <v-sheet class="overflow-auto" style="height: calc(100% - 70px)">
    <div class="d-flex flex-column" v-for="chance in chances" :key="chance.rarity">
      <v-btn variant="tonal" density="comfortable">
        {{ chance.rarity }}
        <v-icon icon="mdi-star" color="#ffd702" class="mt-1" />
      </v-btn>
      <div class="d-flex" v-for="(floor, index) in chance.floors" :key="index">
        <v-btn variant="tonal" max-width="60px" size="small">
          {{ floor.chance.toFixed(2) }}%
        </v-btn>
        <div class="d-flex flex-wrap">
          <operator-tag v-for="char in floor.chars" :key="char" :char="char" />
        </div>
      </div>
    </div>
  </v-sheet>
</template>
