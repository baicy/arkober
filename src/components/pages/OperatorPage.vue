<script setup>
import { ref, reactive, computed } from 'vue'
import characters from '@/data/characters.json'
import pools from '@/data/pools.json'
import { skins } from '@/data/skins.json'
import professions from '@/data/professions.json'
import axios from 'axios'
import { useRoute } from 'vue-router'

const upList = {}
const mhList = reactive({})
const passLinkList = {}
const skinList = {}
for (const i in characters) {
  const { id, name, type, passport, rarity, onlineTime, classicTime } = characters[i]
  if (!['rogue'].includes(type)) {
    if (rarity === 6 && type === '') {
      upList[id] = { id, name, onlineTime, classicTime, lastUp: '', lastShop: '' }
    }
    // 官漫给U的名字的大小写写错了
    const wrongList = { 'U-Official': 'U-official' }
    mhList[wrongList[name] || name] = ''
    skinList[id] = { id, name, skins: 0, rarity }
    if (!['linkage', 'linkageActivity'].includes(type) && !/_amiya\d/.test(id)) {
      if (passLinkList[passport]) {
        passLinkList[passport].unshift({ id, name })
      } else {
        passLinkList[passport] = [{ id, name }]
      }
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

axios.get('/mh/6253').then(({ data }) => {
  const { episodes } = data.data
  for (const i in episodes) {
    const { cid, title } = episodes[i]
    mhList[title] = cid
  }
})

const passList = []
for (const i in passLinkList) {
  passList.push({ code: i, chars: passLinkList[i] })
}
passList.sort((a, b) => {
  return Number(a.code) - Number(b.code)
})
for (const i in skins) {
  skinList[skins[i].char].skins++
}
const skinRarities = ref([1, 2, 3, 4, 5, 6])
const customSkinList = computed(() =>
  Object.values(skinList).filter((v) => skinRarities.value.includes(v.rarity))
)

const route = useRoute()
const tab = ref(route.hash.substring(1) || 'hunt')
</script>
<template>
  <v-sheet class="d-flex flex-row pl-1" height="100%">
    <v-tabs v-model="tab" color="primary" direction="vertical">
      <v-tab prepend-icon="mdi-target" text="寻访" value="hunt"></v-tab>
      <v-tab prepend-icon="mdi-square-outline" text="模组" value="uniequip"></v-tab>
      <v-tab prepend-icon="mdi-hanger" text="时装" value="skin"></v-tab>
      <v-tab prepend-icon="mdi-numeric" text="123罗德岛！？" value="manhua"></v-tab>
      <v-tab prepend-icon="mdi-account-credit-card" text="通行证" value="passport"></v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="h-100 w-100">
      <v-tabs-window-item value="hunt" class="h-100">
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
      <v-tabs-window-item value="uniequip" class="h-100 w-100">
        <div class="text-body-1 text-secondary list-header">主要展示通用模组</div>
        <div class="d-flex flex-column ga-1 overflow-auto w-100" style="height: calc(100% - 60px)">
          <div v-for="profession in professions" :key="profession.id" class="d-flex ga-0 w-100">
            <v-btn readonly variant="tonal" width="100px">{{ profession.name }}</v-btn>
            <div class="d-flex flex-wrap ga-1 w-100">
              <v-btn
                v-for="(sub, id) in profession.subs"
                :key="id"
                width="180px"
                :variant="Object.keys(sub.equiped).length ? 'flat' : 'tonal'"
              >
                {{ sub.name }}
                {{
                  Object.keys(sub.equiped).length ? `: ${Object.keys(sub.equiped).join(', ')}` : ''
                }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="skin" class="h-100" id="skin">
        <div class="text-body-1 text-secondary list-header d-flex">
          <span>按照实装顺序倒序排列</span>
          <v-checkbox
            v-for="r in 6"
            :key="r"
            v-model="skinRarities"
            :label="`${r}星`"
            :value="r"
          ></v-checkbox>
          <v-btn @click="skinRarities = [1, 2, 3, 4, 5, 6]" size="small" class="mt-3 ml-2">
            全选
          </v-btn>
          <v-btn @click="skinRarities = []" size="small" class="mt-3 ml-2" color="error">
            清空
          </v-btn>
        </div>
        <div
          class="d-flex flex-wrap align-content-start ga-3 overflow-auto"
          style="height: calc(100% - 60px)"
        >
          <v-btn
            v-for="char in customSkinList"
            :key="char.id"
            width="150px"
            :variant="char.skins ? 'flat' : 'tonal'"
          >
            {{ char.name }}:{{ char.skins }}
          </v-btn>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="manhua" class="h-100">
        <div class="text-body-1 text-secondary list-header">按照实装顺序倒序排列</div>
        <div class="overflow-auto d-flex flex-wrap" style="height: calc(100% - 60px)">
          <div style="width: 10%; flex-basis: 10%" v-for="(episode, name) in mhList" :key="name">
            <v-btn
              variant="text"
              :disabled="!episode"
              :href="`https://terra-historicus.hypergryph.com/comic/6253/episode/${episode}`"
              target="_blank"
            >
              {{ name }}
            </v-btn>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="passport" class="h-100 w-100">
        <div class="text-body-1 text-secondary list-header">
          不包含联动干员，同系列按照实装顺序正序排列
        </div>
        <div class="d-flex flex-column ga-1 overflow-auto w-100" style="height: calc(100% - 60px)">
          <div v-for="series in passList" :key="series.code" class="d-flex ga-0 w-100">
            <v-btn readonly variant="tonal" width="100px">{{ series.code || '无' }}</v-btn>
            <div class="d-flex flex-wrap ga-1 w-100">
              <v-btn v-for="char in series.chars" :key="char.id" width="120px">
                {{ char.name }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>
<style scoped>
.list-header {
  --header-height: 60px;
  height: var(--header-height);
  line-height: var(--header-height);
}
</style>
