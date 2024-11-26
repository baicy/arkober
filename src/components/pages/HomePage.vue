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
    <timeline-inventory :currentYear="currentYear" />
    <v-btn height="100%" variant="outlined" class="px-0" @click="viewYear(currentYear + 1)">
      <v-icon icon="mdi-pan-right"></v-icon>
      {{ currentYear + 1 }}
    </v-btn>
  </v-container>
</template>
