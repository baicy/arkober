<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useCharacterStore } from '@/stores/character'
import { useMaterialStore } from '@/stores/material'

const operators = useCharacterStore().list
const materials = useMaterialStore().list

const { affair } = defineProps({ affair: Object })
const { name, start, days = 14, type, color = [], pickup, reward, drop } = affair
const isActive = ref(
  dayjs().isBefore(dayjs(start).add(days, 'day')) && dayjs().isAfter(dayjs(start))
)
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
        {{ `${name}${type === 'rerun' ? '·复刻' : ''}` }}
      </div>
      <div
        v-if="
          [
            'single',
            'rerun',
            'joint',
            'special',
            'spring',
            'summer',
            'fes',
            'linkage',
            'limited',
            'standard',
            'classic'
          ].includes(type) && pickup[0].chars.length < 7
        "
        class="d-flex"
      >
        <div v-for="char in pickup[0].chars" :key="char">
          <v-btn v-if="operators[char]" variant="text" :to="`/operator/${char}`" :height="30">
            {{ operators[char].name }}
          </v-btn>
          <v-btn v-else variant="text">{{ char }}</v-btn>
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
        <div class="d-flex ga-1">
          <div v-for="mat in drop" :key="mat">{{ materials[mat].name }}</div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
