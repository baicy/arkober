<script setup>
import TimelineInventory from '../timeline/TimelineInventory.vue'
</script>
<template>
  <v-container max-width="100%" height="100%">
    <v-sheet class="w-100 h-100 mx-auto d-flex flex-column justify-space-between">
      <timeline-inventory :current-year="currentYear" />
      <div class="mt-2 d-flex">
        <v-btn to="/operator">干员统计</v-btn>
        <v-btn to="/activity">活动统计</v-btn>
      </div>
    </v-sheet>
  </v-container>
</template>
