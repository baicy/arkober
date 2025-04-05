<script setup>
import { computed, ref } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { useSystemStore } from '@/stores/system'
import dayjs from 'dayjs'
import { ato } from '@/utils/utils'

const { pool } = defineProps({ pool: Object })
const charStore = useCharacterStore()
const operators = charStore.list
const operatorArray = Object.values(operators)
const poolInfo = []
const puInfo = { r6: [], r5: [], r4: [], r3: [] }
const { type, start } = pool
for (const i in pool.pickup) {
  const { rarity, chars } = pool.pickup[i]
  const info = { ...pool.pickup[i] }
  if (rarity === 6) {
    if (['fes', 'spring', 'summer'].includes(type)) {
      info.chance = 35
      poolInfo.push(info)
      const limits = operatorArray.filter(
        (c) => c.source === type && dayjs(start).diff(dayjs(c.onlineTime), 'month') > 8
      )
      const weightLimits = limits.splice(0, 3)
      const normals = operatorArray.filter(
        (c) =>
          c.rarity === 6 &&
          c.type === '' &&
          dayjs(c.onlineTime).isBefore(dayjs(start)) &&
          (!c.classicTime || dayjs(c.classicTime).isAfter(dayjs(start)))
      )
      // console.log(weightLimits.map((v) => v.name))
      // console.log(limits.map((v) => v.name))
      // console.log(normals.map((v) => v.name))
      const chance = 30 / (5 * weightLimits.length + limits.length + normals.length)
      poolInfo.push({ rarity: 6, chars: weightLimits.map((c) => c.id), chance: 5 * chance })
      poolInfo.push({ rarity: 6, chars: limits.map((c) => c.id), chance })
    } else {
      if (['joint', 'mainline'].includes(type)) {
        info.chance = 100 / chars.length
      } else if (['special'].includes(type)) {
        info.chance = 100 / 3
      } else {
        info.chance = 50 / chars.length
      }
      poolInfo.push(info)
      const others = operatorArray
        .filter(
          (c) =>
            c.rarity === 6 &&
            c.type === '' &&
            dayjs(c.onlineTime).isBefore(dayjs(start)) &&
            (!c.classicTime || dayjs(c.classicTime).isAfter(dayjs(start)))
        )
        .map((v) => v.id)
      puInfo.r6 = [
        { chars, chance: 50 },
        { chars: others, chance: 100 }
      ]
    }
  }
  if (rarity === 5) {
    if (['joint'].includes(type)) {
      info.chance = 100 / chars.length
    } else if (['special'].includes(type)) {
      info.chance = 50 / 3
    } else {
      info.chance = 50 / chars.length
    }
    poolInfo.push(info)
    const others = operatorArray
      .filter(
        (c) =>
          c.rarity === 5 &&
          c.type === '' &&
          dayjs(c.onlineTime).isBefore(dayjs(start)) &&
          (!c.classicTime || dayjs(c.classicTime).isAfter(dayjs(start)))
      )
      .map((v) => v.id)
    puInfo.r5 = [
      { chars, chance: 50 },
      { chars: others, chance: 100 }
    ]
  }
  if (rarity === 4) {
    info.chance = 50 / chars.length
    poolInfo.push(info)
    const others = operatorArray
      .filter((c) => c.rarity === 4 && c.type === '' && dayjs(c.onlineTime).isBefore(dayjs(start)))
      .map((v) => v.id)
    puInfo.r4 = [
      { chars, chance: 50 },
      { chars: others, chance: 100 }
    ]
  }
}
if (!puInfo.r4.length) {
  const alls = operatorArray
    .filter((c) => c.rarity === 4 && c.type === '' && dayjs(c.onlineTime).isBefore(dayjs(start)))
    .map((v) => v.id)
  puInfo.r4 = [{ chars: alls, chance: 100 }]
}
if (!puInfo.r3.length) {
  const alls = operatorArray
    .filter((c) => c.rarity === 3 && c.type === '' && dayjs(c.onlineTime).isBefore(dayjs(start)))
    .map((v) => v.id)
  puInfo.r3 = [{ chars: alls, chance: 100 }]
}

const ownedList = computed(() => {
  return ato(useSystemStore().auth.cultivate.characters, 'id')
})

const gachaList = ref([])
const times = ref(0)
const t6 = ref(0)
const c6 = ref(2)
const getRandom = (arr) => {
  const ind = Math.floor(Math.random() * arr.length)
  return arr[ind]
}
const gachaRarity = (rarity) => {
  const chars = puInfo[`r${rarity}`]
  let char = { rarity }
  const roll = Math.floor(Math.random() * 100)
  // if (rarity === 6) console.log(roll)
  for (const i in chars) {
    // if (rarity === 6) console.log(chars[i].chars, chars[i].chance)
    if (roll < chars[i].chance) {
      char.id = getRandom(chars[i].chars)
      break
    }
  }
  return char
}
const gachaOnce = () => {
  const once = Math.floor(Math.random() * 100)
  let char = {}
  if (once < c6.value) {
    char = gachaRarity(6)
  } else if (once < c6.value + 8) {
    char = gachaRarity(5)
  } else if (once < c6.value + 8 + 50) {
    char = gachaRarity(4)
  } else {
    char = gachaRarity(3)
  }
  times.value += 1
  if (char.rarity === 6) {
    t6.value = 0
    c6.value = 2
  } else {
    t6.value += 1
    if (t6.value > 60) {
      c6.value += 2 * (t6.value - 60)
    }
  }
  return char
}
const gacha = (onceTimes = 1) => {
  const chars = []
  for (let i = 0; i < onceTimes; i++) {
    chars.push(gachaOnce())
  }
  gachaList.value.unshift({ chars, ts: new Date().getTime() })
}
const reset = () => {
  gachaList.value = []
  times.value = 0
  t6.value = 0
  c6.value = 2
}
</script>
<template>
  <div class="w-100 h-100 d-flex ga-2">
    <div class="d-flex flex-column">
      <div>
        <span class="text-h6">{{ pool.name }}</span>
      </div>
      <div class="d-flex flex-column pb-5">
        <span>{{ pool.start }}</span>
        <span>~</span>
        <span>
          {{ dayjs(pool.start).add(pool.days, 'day').hour(4).format('YYYY-MM-DD HH:mm') }}
        </span>
      </div>
      <div v-if="['attain', 'cattain'].includes(pool.type)" class="d-flex flex-column ga-2 w-33">
        <div>首次获得的6星干员必定为以下干员之一（仅限一次）</div>
        <div class="d-flex flex-wrap ga-1">
          <span
            v-for="char in pool.pickup[0].chars.filter((c) => !ownedList[c])"
            :key="char"
            class="w120"
          >
            {{ operators[char].name }}
          </span>
        </div>
        <v-divider></v-divider>
        <div class="d-flex flex-wrap">
          <span
            v-for="char in pool.pickup[0].chars.filter((c) => ownedList[c])"
            :key="char"
            class="w120"
          >
            {{ operators[char].name }}({{ ownedList[char].potentialRank + 1 }})
          </span>
        </div>
      </div>
      <div v-else>
        <div v-for="(up, index) in poolInfo" :key="index" class="d-flex flex-column">
          <div>
            <v-icon icon="mdi-star" v-for="i in up.rarity" :key="i" size="xsmall"></v-icon>
          </div>
          <div class="d-flex ga-3">
            <div>{{ up.chance ? up.chance.toFixed(2) : 50 }}%</div>
            <div class="d-flex ga-1 flex-wrap">
              <span v-for="char in up.chars" :key="char">
                {{ operators[char] ? operators[char].name : char }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-divider vertical></v-divider>
    <div class="h-100">
      <div style="height: 80px">
        <div class="d-flex ga-2">
          <v-btn @click="gacha(1)">寻访一次</v-btn>
          <v-btn @click="gacha(10)">寻访十次</v-btn>
          <v-btn @click="reset" color="error">重置</v-btn>
        </div>
        <div>已抽{{ times }}次，当前6星概率为{{ c6 }}%，距离上个6星{{ t6 }}次</div>
      </div>
      <div class="overflow-auto w800" style="height: calc(100% - 80px)">
        <div v-for="once in gachaList" :key="once.ts" class="d-flex flex-wrap ga-2">
          <div v-for="char in once.chars" :key="char.id">
            <div :class="{ 'text-red': char.rarity === 6 }">{{ operators[char.id].name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
