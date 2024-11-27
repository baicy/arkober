<script setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import TimelineInventory from '../timeline/TimelineInventory.vue'

const currentYear = ref(dayjs().year())
const viewYear = (year) => {
  currentYear.value = year
}
</script>
<template>
  <v-container max-width="100%" height="100%" class="d-flex">
    <v-btn height="100%" variant="outlined" class="px-0" @click="viewYear(currentYear - 1)">
      {{ currentYear - 1 }}
      <v-icon icon="mdi-pan-left"></v-icon>
    </v-btn>
    <v-sheet width="calc(100% - 180px)" class="mx-auto">
      <timeline-inventory :current-year="currentYear" />
      <div class="mt-2 d-flex justify-space-evently">
        <v-btn>干员统计</v-btn>
      </div>
    </v-sheet>
    <v-btn height="100%" variant="outlined" class="px-0" @click="viewYear(currentYear + 1)">
      <v-icon icon="mdi-pan-right"></v-icon>
      {{ currentYear + 1 }}
    </v-btn>
  </v-container>
</template>
