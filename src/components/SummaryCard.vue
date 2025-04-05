<script setup>
import { ref, computed } from 'vue'
import { useSystemStore } from '@/stores/system'
import materials from '@/data/store.json'
import dayjs from 'dayjs'
const mats = materials
const system = useSystemStore()
const auth = computed(() => system.auth)
const activities = computed(() => system.activities)
const resourceDaily = [
  ['red', 'tank', 'medic', 'pioneer', 'support', 'warrior', 'special'], //周日
  ['red', 'tank', 'medic', 'sniper', 'caster'], //周一
  ['sniper', 'caster', 'warrior', 'special'], //周二
  ['pioneer', 'support', 'warrior', 'special'], //周三
  ['red', 'tank', 'medic', 'pioneer', 'support'], //周四
  ['tank', 'medic', 'sniper', 'caster'], //周五
  ['red', 'sniper', 'caster', 'pioneer', 'support', 'warrior', 'special'] //周六
]
const now = dayjs()
const day = now.hour() < 4 ? (now.day() === 0 ? 6 : now.day() - 1) : now.day()
system.activities.push({ id: 'daily', drop: resourceDaily[day] })
system.activities.push({ id: 'gacha', drop: ['gacha'] })
const expanded = ref(false)
const todo = ref(false)
</script>
<template>
  <div class="w-60 position-absolute bottom-0 right-0">
    <v-card
      elevation="12"
      class="position-relative d-flex flex-column ga-2"
      :height="expanded ? 400 : 100"
    >
      <div class="d-flex justify-space-between">
        <v-btn icon="mdi-refresh" size="xsmall" @click="system.getInfo"></v-btn>
        <v-btn
          :icon="expanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'"
          size="xsmall"
          @click="expanded = !expanded"
        ></v-btn>
      </div>
      <v-card-text v-if="expanded">
        <div>今日掉落</div>
        <div v-for="act in activities" :key="act.id">
          <div v-for="drop in act.drop" :key="drop">
            <div v-if="Object.keys(mats).includes(drop)" class="d-flex ga-2">
              <div v-for="item in mats[drop]" :key="item.id">
                {{ item.name }} -
                {{
                  (auth.cultivate.items.find((v) => v.id == [item.itemId]) || { count: '0' }).count
                }}
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-text v-if="expanded">
        <span>
          库存更新时间：
          {{ dayjs.unix(auth.player.status.storeTs).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </v-card-text>
      <v-card-text>
        <span class="text-button" v-if="auth.timestamp">
          AP: {{ auth.player.status.ap.current }} / {{ auth.player.status.ap.max }}
          最近恢复于
          {{ dayjs.unix(auth.player.status.ap.lastApAddTime).format('YYYY-MM-DD HH:mm:ss') }}
          将于
          {{ dayjs.unix(auth.player.status.ap.completeRecoveryTime).format('YYYY-MM-DD HH:mm:ss') }}
          全部恢复
        </span>
        <span class="text-button">
          {{
            auth.timestamp
              ? `更新于${dayjs.unix(auth.timestamp).format('YYYY-MM-DD HH:mm:ss')}`
              : '无数据'
          }}
        </span>
      </v-card-text>
    </v-card>
  </div>
</template>
