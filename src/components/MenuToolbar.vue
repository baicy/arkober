<script setup>
import { computed, reactive, ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import materials from '@/data/store.json'
import dayjs from 'dayjs'
import { ato } from '@/utils/utils'

const system = useSystemStore()
const auth = computed(() => system.auth)

const credInput = reactive({
  open: false,
  cred: auth.value.cred,
  copied: false
})
const openInput = () => {
  credInput.open = true
  credInput.copied = false
}
const copyCode = async () => {
  await navigator.clipboard.writeText('copy(localStorage.SK_OAUTH_CRED_KEY)')
  credInput.copied = true
}
const login = () => {
  if (credInput.cred) {
    system.login(credInput.cred)
    credInput.open = false
  }
}

const store = auth.value.uid ? ato(auth.value.cultivate.items, 'id') : {}
const actDrops = computed(() => {
  const drops = system.activities.reduce((prev, cur) => [...(prev.drop ?? []), ...cur.drop], [])
  const list = []
  for (const i in drops) {
    const drop = drops[i]
    const item = {}
    item.id = drop
    item.count = store[materials[drop].find((v) => v.rarity === 3).itemId].count
    list.push(item)
  }
  return list
})
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
const dailyDrops = resourceDaily[day]
const todo = ref(false)
</script>
<template>
  <v-toolbar color="primary" density="compact" elevation="6" :height="80">
    <v-btn to="/operator">干员统计</v-btn>
    <v-btn to="/activity">活动统计</v-btn>
    <v-spacer></v-spacer>
    <v-btn v-if="!auth.uid" @click="openInput">登录</v-btn>
    <template v-else>
      <div v-if="actDrops.length" class="d-flex align-center">
        <span class="mr-2 text-button">当前活动掉落</span>
        <div v-for="drop in actDrops" :key="drop.id" class="d-flex flex-column align-center">
          <div class="thumb">
            <img :src="`material/${drop.id}.png`" />
          </div>
          <span class="text-caption">{{ drop.count }}</span>
        </div>
      </div>
      <v-btn stacked id="viewStatus">
        <v-badge color="error" dot :model-value="todo">
          <v-icon icon="mdi-package-variant-closed"></v-icon>
        </v-badge>
      </v-btn>
    </template>
  </v-toolbar>
  <v-bottom-sheet inset activator="#viewStatus">
    <v-card elevation="12" class="text-button">
      <v-card-text>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <span>
            {{
              auth.timestamp
                ? `数据获取：${dayjs.unix(auth.timestamp).format('YYYY-MM-DD HH:mm:ss')}`
                : '无数据'
            }}
          </span>
          <v-btn @click="system.getInfo" icon="mdi-refresh" size="xsmall" variant="text"></v-btn>
        </div>
        <div class="d-flex justify-space-between w-75">
          <span> 理智: {{ auth.player.status.ap.current }} / {{ auth.player.status.ap.max }} </span>
          <span>
            全部恢复：
            {{
              dayjs.unix(auth.player.status.ap.completeRecoveryTime).format('YYYY-MM-DD HH:mm:ss')
            }}
          </span>
          <span>
            更新时间：
            {{ dayjs.unix(auth.player.status.ap.lastApAddTime).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </div>
        <div class="w-75">
          <div class="w-100 d-flex">
            <span>今日资源收集</span>
            <v-spacer></v-spacer>
            <span>
              库存更新时间：
              {{ dayjs.unix(auth.player.status.storeTs).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
          </div>
          <div v-for="drop in dailyDrops" :key="drop" class="d-flex">
            <div v-for="item in materials[drop]" :key="item.id" style="width: 120px">
              {{ item.name }} : {{ store[item.itemId].count }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
  <v-dialog :model-value="credInput.open" persistent>
    <v-card>
      <v-card-text>
        <v-alert color="info">
          <div class="d-flex ga-3">
            <span>登录森空岛网页版后在控制台输入</span>
            <span>copy(localStorage.SK_OAUTH_CRED_KEY)</span>
            <v-icon icon="mdi-content-copy" class="cursor-pointer" @click="copyCode"></v-icon>
            <span v-if="credInput.copied">已复制</span>
          </div>
        </v-alert>
        <v-text-field v-model="credInput.cred"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="login">登录</v-btn>
        <v-btn @click="credInput.open = false">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.thumb {
  --thumb-size: 30px;
  width: var(--thumb-size);
  height: var(--thumb-size);
  img {
    width: 100%;
  }
}
</style>
