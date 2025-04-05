<script setup>
import { ref, computed } from 'vue'
import professions from '@/data/professions.json'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useCharacterStore } from '@/stores/character'
import { useSystemStore } from '@/stores/system'

const operators = useCharacterStore().list
const system = useSystemStore()

for (const c of system.auth.player.chars) {
  operators[c.charId].cultivate = { ...c }
}

const types = ref(['activity', 'normal', 'classic', 'limited', 'linkage'])
const rarities = ref([1, 2, 3, 4, 5, 6])
const infoType = ref([])
const ownType = ref([0, 1])
const charlist = computed(() => {
  const list = {}
  let chars = Object.values(operators)
  if (!types.value.length) {
    return list
  }
  if (!ownType.value.length) {
    return list
  }
  if (ownType.value.length === 1) {
    if (ownType.value.includes(1)) {
      chars = chars.filter((v) => v.cultivate)
    } else {
      chars = chars.filter((v) => !v.cultivate)
    }
  }
  if (!types.value.includes('activity')) {
    chars = chars.filter((v) => !['activity', 'recruit'].includes(v.type))
  }
  if (!types.value.includes('normal')) {
    chars = chars.filter(
      (v) =>
        !(
          v.type === '' &&
          (([6, 5].includes(v.rarity) && !v.classicTime) || [4, 3].includes(v.rarity))
        )
    )
  }
  if (!types.value.includes('classic')) {
    chars = chars.filter((v) => !([6, 5].includes(v.rarity) && v.classicTime))
  }
  if (!types.value.includes('limited')) {
    chars = chars.filter((v) => !['limited'].includes(v.type))
  }
  if (!types.value.includes('linkage')) {
    chars = chars.filter((v) => !['linkage', 'linkageActivity'].includes(v.type))
  }
  chars = chars.filter((v) => rarities.value.includes(v.rarity))
  if (infoType.value.includes('skin')) {
    chars = chars.filter((v) => !v.skins.length)
  }
  if (infoType.value.includes('comic')) {
    chars = chars.filter((v) => !v.comic)
  }
  if (infoType.value.includes('passport')) {
    chars = chars.filter(
      (v) =>
        !v.passport && !['linkage', 'linkageActivity'].includes(v.type) && !/_amiya\d/.test(v.id)
    )
  }
  for (const i in chars) {
    const char = chars[i]
    const time = dayjs(char.onlineTime)
    if (time.isAfter('2019-05-02')) {
      if (list[`${time.year()}年`]) {
        if (list[`${time.year()}年`][`${time.month() + 1}月`]) {
          list[`${time.year()}年`][`${time.month() + 1}月`].push(char)
        } else {
          list[`${time.year()}年`][`${time.month() + 1}月`] = [char]
        }
      } else {
        list[`${time.year()}年`] = { [`${time.month() + 1}月`]: [char] }
      }
    } else {
      if (list['2019年']) {
        if (list['2019年']['开服']) {
          list['2019年']['开服'].push(char)
        } else {
          list['2019年']['开服'] = [char]
        }
      } else {
        list['2019年'] = { 开服: [char] }
      }
    }
  }
  return list
})

const showOperator = (char) => {
  system.infoDialog.open = true
  system.infoDialog.type = 'char'
  system.infoDialog.item = char
}

const route = useRoute()
const tab = ref(route.hash.substring(1) || 'list')
</script>
<template>
  <v-sheet class="d-flex flex-row pl-1" height="100%">
    <v-tabs v-model="tab" color="primary" direction="vertical">
      <v-btn prepend-icon="mdi-home" color="secondary" to="/"></v-btn>
      <v-tab prepend-icon="mdi-chess-knight" text="干员列表" value="list"></v-tab>
      <v-tab prepend-icon="mdi-square-outline" text="职业列表" value="uniequip"></v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="h-100 w-100">
      <v-tabs-window-item value="list" class="h-100 w-100">
        <div class="text-body-1 text-secondary d-flex flex-column h150">
          <div class="d-flex h40">
            <v-checkbox v-model="types" value="activity">
              <template v-slot:label>
                <span class="text-success">赠送(包含公招/不含联动)</span>
              </template>
            </v-checkbox>
            <v-checkbox v-model="types" value="normal">
              <template v-slot:label>
                <span>标准(包含4星)</span>
              </template>
            </v-checkbox>
            <v-checkbox v-model="types" value="classic">
              <template v-slot:label>
                <span class="text-info">中坚(仅6/5星)</span>
              </template>
            </v-checkbox>
            <v-checkbox v-model="types" value="limited">
              <template v-slot:label>
                <span class="text-error">限定</span>
              </template>
            </v-checkbox>
            <v-checkbox v-model="types" value="linkage">
              <template v-slot:label>
                <span class="text-error">联动(包含赠送)</span>
              </template>
            </v-checkbox>
            <v-btn
              @click="types = ['activity', 'normal', 'classic', 'limited', 'linkage']"
              size="small"
              class="mt-3 ml-2"
            >
              全选
            </v-btn>
            <v-btn @click="types = []" size="small" class="mt-3 ml-2" color="error"> 清空 </v-btn>
          </div>
          <div class="d-flex h40">
            <v-checkbox
              v-for="r in 6"
              :key="r"
              v-model="rarities"
              :label="`${r}星`"
              :value="r"
            ></v-checkbox>
            <v-btn @click="rarities = [1, 2, 3, 4, 5, 6]" size="small" class="mt-3 ml-2">
              全选
            </v-btn>
            <v-btn @click="rarities = []" size="small" class="mt-3 ml-2" color="error">
              清空
            </v-btn>
          </div>
          <div class="d-flex h40">
            <v-checkbox label="无时装" value="skin" v-model="infoType"></v-checkbox>
            <v-checkbox label="无123罗德岛!?" value="comic" v-model="infoType"></v-checkbox>
            <v-checkbox
              label="无通行证(不包含联动干员)"
              value="passport"
              v-model="infoType"
            ></v-checkbox>
            <v-checkbox label="已持有" :value="1" v-model="ownType"></v-checkbox>
            <v-checkbox label="未持有" :value="0" v-model="ownType"></v-checkbox>
          </div>
        </div>
        <div class="d-flex flex-column overflow-auto" style="height: calc(100% - 150px)">
          <div
            v-for="(yearlist, year) in charlist"
            :key="year"
            class="d-flex flex-column ga-1 position-relative"
          >
            <div class="year-banner bg-white pl-2 mb-2 text-h6">{{ year }}</div>
            <div
              v-for="(chars, month) in yearlist"
              :key="month"
              class="d-flex justify-space-between ga-2"
            >
              <div class="month-banner text-right">{{ month }}</div>
              <v-row no-gutters>
                <v-col
                  :cols="3"
                  v-for="char in chars"
                  :key="char.id"
                  class="d-flex justify-space-between"
                >
                  <span class="cursor-pointer" @click="showOperator(char)">
                    {{ char.name }}
                  </span>
                </v-col>
              </v-row>
            </div>
          </div>
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
    </v-tabs-window>
  </v-sheet>
</template>
<style scoped>
.list-header {
  --header-height: 60px;
  height: var(--header-height);
  line-height: var(--header-height);
}
.year-banner {
  position: sticky;
  top: 0;
  border-left: 5px solid rgb(var(--v-theme-primary));
}
.month-banner {
  min-width: 60px;
}
</style>
