<script setup>
import { useCharacterStore } from '@/stores/character'
import { useRoute } from 'vue-router'

const route = useRoute()
const { id } = route.params
const store = useCharacterStore()
const operator = store.list[id]
</script>
<template>
  <v-row>
    <v-col offset="2">
      <v-sheet>
        <v-btn :color="operator.color1 || operator.color2 || '#c22b34'">
          {{ operator ? operator.name : id }}
        </v-btn>
        <v-list v-if="operator">
          <v-list-title>寻访方式</v-list-title>
          <v-list-item v-if="operator.type === 'activity'">活动获得</v-list-item>
          <v-list-item v-if="!operator.type && operator.classicTime === -1"> 标准寻访 </v-list-item>
          <v-list-item v-if="!operator.type && operator.classicTime != -1"> 中坚寻访 </v-list-item>
          <v-list-item v-if="operator.recruitTime > -1">公开招募</v-list-item>
        </v-list>
      </v-sheet>
    </v-col>
  </v-row>
</template>
