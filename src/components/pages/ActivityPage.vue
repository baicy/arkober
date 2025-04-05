<script setup>
import { ref, reactive, watchEffect, watch, nextTick, computed } from 'vue'
import stories from '@/data/stories.json'
import activities from '@/data/activities.json'
import characters from '@/data/characters.json'
import pools from '@/data/pools.json'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import ArkImg from '../ArkImg.vue'

const storyTypes = ref(['ss', 'mn'])
const storyList = computed(() => {
  const types = new Set()
  if (storyTypes.value.includes('ss')) {
    types.add('SIDESTORY')
    types.add('BRANCHLINE')
  }
  if (storyTypes.value.includes('mn')) {
    types.add('MINISTORY')
  }
  return stories.filter((v) => types.has(v.type))
})

let nearestAct = null
let currentAct = null
const actList = activities.filter((a) => a.drop)
const MATERIAL_SIZE = 18
const matList = reactive(new Set())
for (const i in actList) {
  const { start, days, drop } = actList[i]
  const now = dayjs()
  const actStart = dayjs(start)
  const actEnd = actStart.add(days, 'day').subtract(12, 'hour')
  if (actStart.isAfter(now)) {
    nearestAct = { ...actList[i], index: i, active: false }
  } else {
    if (!currentAct) {
      if (actEnd.isAfter(now)) {
        currentAct = { ...actList[i], index: i, active: true }
      } else {
        currentAct = nearestAct
        for (const j in nearestAct.drop) {
          matList.add(nearestAct.drop[j])
        }
      }
    }
    for (const j in drop) {
      matList.add(drop[j])
    }
    if (matList.size >= MATERIAL_SIZE) break
  }
}
const selectedMaterial = reactive(new Set())
const selectMaterial = (mat) => {
  if (selectedMaterial.has(mat)) {
    selectedMaterial.delete(mat)
  } else {
    selectedMaterial.add(mat)
  }
}
const selectedActivity = ref('')
const selectActivity = (act) => {
  if (selectedActivity.value === act.id) {
    selectedActivity.value = ''
    act.drop.forEach((mat) => selectedMaterial.delete(mat))
  } else {
    selectedActivity.value = act.id
    selectedMaterial.clear()
    act.drop.forEach((mat) => selectedMaterial.add(mat))
  }
}

const upList = {}
for (const i in characters) {
  const { id, name, type, rarity, onlineTime, classicTime } = characters[i]
  if (!['rogue'].includes(type)) {
    if (rarity === 6 && type === '') {
      upList[id] = { id, name, onlineTime, classicTime, lastUp: '', lastShop: '' }
    }
  }
}
const upChar = (char, time) => {
  if (!upList[char].lastUp) {
    upList[char].lastUp = time
  }
}
const shopChar = (char, time) => {
  upChar(char, time)
  if (!upList[char].lastShop) {
    upList[char].lastShop = time
  }
}
for (const id in pools) {
  const { fake, type, start, pickup } = pools[id]
  if (fake) continue
  if (['attain', 'cattain'].includes(type)) continue
  if (!pickup.length) continue
  if (type === 'standard') {
    shopChar(pickup[0].chars[0], start)
    upChar(pickup[0].chars[1], start)
  } else if (type === 'classic') {
    if (pickup[0].chars.length > 2) {
      for (const char of pickup[0].chars) {
        shopChar(char, start)
      }
    } else {
      shopChar(pickup[0].chars[0], start)
      upChar(pickup[0].chars[1], start)
    }
  } else {
    for (const i in pickup[0].chars) {
      const char = pickup[0].chars[i]
      if (upList[char]) {
        upChar(char, start)
      }
    }
  }
}
const upListHeader = [
  { title: '干员', value: 'name', sortable: true },
  {
    title: '上线日期',
    key: 'onlineTime',
    sortable: true,
    value: (item) => item.onlineTime.substring(0, 10)
  },
  {
    title: '最近卡池日期',
    key: 'lastUp',
    sortable: true,
    value: (item) => item.lastUp.substring(0, 10)
  },
  {
    title: '最近兑换日期',
    key: 'lastShop',
    sortable: true,
    value: (item) => item.lastShop.substring(0, 10)
  }
]

const route = useRoute()
const tab = ref('story')

const tabHeaderHeight = 60
const droplineRef = ref()
const materialCellSize = 50

watchEffect(() => {
  if (route.params.module) {
    tab.value = route.params.module
  }
  if (route.params.item) {
    selectedMaterial.clear()
    selectedMaterial.add(route.params.item)
  }
})
watch(
  tab,
  (cur) => {
    if (cur === 'material') {
      nextTick(() => (droplineRef.value.scrollTop = materialCellSize * (currentAct.index - 1)))
    }
  },
  { immediate: true }
)
</script>
<template>
  <v-sheet
    class="d-flex flex-row pl-1"
    height="100%"
    :style="{ '--header-height': `${tabHeaderHeight}px` }"
  >
    <v-tabs v-model="tab" color="primary" direction="vertical">
      <v-btn prepend-icon="mdi-home" color="secondary" to="/"></v-btn>
      <v-tab prepend-icon="mdi-radioactive-circle-outline" text="情报记述" value="story"></v-tab>
      <v-tab prepend-icon="mdi-package-variant" text="材料掉落" value="material"></v-tab>
      <v-tab prepend-icon="mdi-target" text="寻访列表" value="pool"></v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="h-100 w-100">
      <v-tabs-window-item value="story" class="h-100 w-100">
        <div class="text-body-1 text-secondary tab-header">按照活动顺序倒序排列</div>
        <div
          class="d-flex flex-column align-content-start story-list text-body-2"
          :style="{ '--row-height': '50px' }"
        >
          <div class="d-flex story-list-header">
            <div class="story-list-name-col border border-primary d-flex ga-2 justify-center pt-3">
              <v-checkbox density="comfatable" v-model="storyTypes" value="ss">
                <template v-slot:label>
                  <span class="text-body-2">Sidestory</span>
                </template>
              </v-checkbox>
              <v-checkbox density="comfatable" v-model="storyTypes" value="mn">
                <template v-slot:label>
                  <span class="text-body-2">故事集</span>
                </template></v-checkbox
              >
            </div>
            <div
              class="story-list-time-col border border-primary d-flex justify-center align-center"
            >
              <span>上线</span>
            </div>
            <div
              class="story-list-time-col border border-primary d-flex justify-center align-center"
            >
              <span>复刻</span>
            </div>
            <div
              class="story-list-time-col border border-primary d-flex justify-center align-center"
            >
              <span>记录修复</span>
            </div>
          </div>
          <div class="d-flex flex-column overflow-auto story-list-content" ref="droplineRef">
            <div class="d-flex story-list-row" v-for="story in storyList" :key="story.id">
              <div class="story-list-name-col border border-primary">
                <div class="story-list-tag text-caption bg-primary text-surface text-center">
                  {{ story.type === 'MINISTORY' ? '故事集' : 'Sidestory' }}
                </div>
                {{ story.name }}
              </div>
              <div class="story-list-time-col border border-primary">
                {{ story.first.substring(0, 10) }}
              </div>
              <div class="story-list-time-col border border-primary">
                {{ story.rerun ? story.rerun.substring(0, 10) : '-' }}
              </div>
              <div class="story-list-time-col border border-primary">
                {{ story.trail ? story.trail.substring(0, 10) : '-' }}
              </div>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="material" class="h-100">
        <div class="text-body-1 text-secondary tab-header d-flex">
          <span>按照活动顺序倒序排列</span>
        </div>
        <div
          class="d-flex flex-column align-content-start material-list"
          :style="{ '--cell-size': `${materialCellSize}px` }"
        >
          <div class="d-flex material-list-header">
            <div class="material-list-name-col border border-primary"></div>
            <div
              v-for="mat in matList"
              :key="mat"
              class="material-list-material-col border border-primary"
              :class="{
                'material-list-cell-active': currentAct.drop.includes(mat),
                'material-list-cell-selection': selectedMaterial.has(mat)
              }"
              @click="selectMaterial(mat)"
            >
              <ark-img :src="`material/${mat}`" class="cursor-pointer" />
            </div>
          </div>
          <div class="d-flex flex-column overflow-auto material-list-content" ref="droplineRef">
            <div class="d-flex" v-for="act in actList" :key="act.id">
              <div
                class="material-list-name-col border border-primary d-flex flex-column"
                :class="{
                  'material-list-cell-active': act.id === currentAct.id,
                  'material-list-cell-selection': selectedActivity === act.id
                }"
                @click="selectActivity(act)"
              >
                <span class="text-body-2">
                  {{ act.name }}
                  <v-chip
                    v-if="currentAct.active && currentAct.id === act.id"
                    size="small"
                    class="bg-warning text-secondary"
                  >
                    开放中
                  </v-chip>
                </span>
                <span class="text-caption">
                  {{
                    act.fake
                      ? `预计 ${dayjs(act.start).format('YYYY-MM')}`
                      : dayjs(act.start).format('YYYY-MM-DD')
                  }}
                </span>
              </div>
              <div
                v-for="mat in matList"
                :key="mat"
                class="material-list-material-col border border-primary position-relative"
                :class="{
                  'material-list-cell-active': act.id === currentAct.id,
                  'material-list-cell-selection':
                    selectedMaterial.has(mat) || selectedActivity === act.id
                }"
                @click="selectMaterial(mat)"
              >
                <ark-img
                  v-if="act.drop.includes(mat)"
                  :src="`material/${mat}`"
                  class="cursor-pointer"
                />
                <div
                  class="material-list-infinity-material position-absolute top-0 right-0"
                  v-if="act.infinity && act.infinity.includes(mat)"
                >
                  <ark-img :src="`material/${mat}`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="pool" class="h-100">
        <div class="text-body-1 text-secondary list-header">按照实装顺序倒序排列</div>
        <div class="d-flex ga-1 overflow-auto" style="height: calc(100% - 60px)">
          <!-- <div class="d-flex flex-column flex-wrap">
            <v-card v-for="char in Object.values(upList)" :key="char.id">
              <v-card-text> {{ char.name }} {{ char.lastUp }} {{ char.lastShop }} </v-card-text>
            </v-card>
          </div> -->
          <v-data-table
            :headers="upListHeader"
            sticky
            :items="Object.values(upList).filter((v) => !v.classicTime)"
            density="compact"
            :items-per-page="-1"
            hide-default-footer
          ></v-data-table>
          <v-data-table
            :headers="upListHeader"
            sticky
            :items="Object.values(upList).filter((v) => v.classicTime)"
            density="compact"
            :items-per-page="-1"
            hide-default-footer
          ></v-data-table>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>
<style lang="scss" scoped>
.tab-header {
  height: var(--header-height);
  line-height: var(--header-height);
}
.tab-content {
  height: calc(100% - var(--header-height));
}
.material-list {
  height: calc(100% - var(--header-height));
  &-header {
    height: var(--cell-size);
  }
  &-content {
    height: calc(100% - var(--cell-size));
  }
  &-cell-active {
    background: rgba(var(--v-theme-success), 0.35);
  }
  &-cell-selection {
    background: rgba(var(--v-theme-primary), 0.35) !important;
  }
  &-name-col {
    width: 220px;
    height: var(--cell-size);
    cursor: pointer;
  }
  &-material-col {
    width: var(--cell-size);
    height: var(--cell-size);
  }
  &-infinity-material {
    --infinity-material-size: 24px;
    width: var(--infinity-material-size);
    height: var(--infinity-material-size);
  }
}
.story-list {
  height: calc(100% - var(--header-height));
  &-header {
    height: var(--row-height);
  }
  &-content {
    height: calc(100% - var(--row-height));
  }
  &-name-col {
    width: 220px;
  }
  &-time-col {
    width: 180px;
    text-align: center;
  }
  &-row {
    width: fit-content;
    &:hover {
      background: rgba(var(--v-theme-primary), 0.35);
    }
  }
  &-tag {
    display: inline-block;
    width: 80px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
}
</style>
