<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '@/stores/character'

const operators = useCharacterStore().list

const { affair } = defineProps({ affair: Object })
const { name, start, days = 14, type, rerun, color = [], pickup, reward, drop, fake } = affair
const isActive = ref(
  dayjs().isBefore(dayjs(start).add(days, 'day')) && dayjs().isAfter(dayjs(start))
)

const router = useRouter()
const viewMaterialList = (material) => {
  router.push({
    name: 'activityStat',
    params: {
      module: 'material',
      item: material
    }
  })
}
</script>
<template>
  <v-sheet
    :elevation="isActive ? 5 : 1"
    class="position-absolute bg-transparent border"
    :class="{ 'opacity-60': !isActive }"
  >
    <div
      class="w-100 h-100 pl-2 pt-1"
      :style="{ borderLeft: `15px solid ${color[0] || '#0098dc'}` }"
    >
      <div v-if="name">
        {{ `${fake ? '(疑)' : ''}${name}${rerun ? '·复刻' : ''}` }}
      </div>
      <div
        v-if="
          ['main', 'sub', 'attain', 'standard', 'classic'].includes(type) &&
          pickup[0].chars.length < 7
        "
        class="d-flex ga-2"
      >
        <div v-for="char in pickup[0].chars" :key="char">
          {{ operators[char] ? operators[char].name : char }}
        </div>
      </div>
      <div v-else-if="reward" class="d-flex ga-2">
        <div v-if="reward.type === 'char'">
          {{ operators[reward.id] ? operators[reward.id].name : reward.id }}
        </div>
        <div v-else-if="reward.type === 'skin'">
          {{
            operators[reward.id.split('@')[0]]
              ? `${operators[reward.id.split('@')[0]].name} 时装`
              : `${reward.id} 时装`
          }}
        </div>
        <div v-else>
          {{ reward.id }}
        </div>
        <div v-if="drop">/</div>
        <div class="d-flex">
          <div v-for="mat in drop" :key="mat" class="thumb" @click="viewMaterialList(mat)">
            <img :src="`material/${mat}.png`" alt="" />
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
<style scoped>
.thumb {
  --thumb-size: 30px;
  width: var(--thumb-size);
  height: var(--thumb-size);
  cursor: pointer;
  img {
    width: 100%;
  }
}
</style>
