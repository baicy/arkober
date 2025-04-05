<script setup>
import TimelineInventory from '../timeline/TimelineInventory.vue'
import MenuToolbar from '../MenuToolbar.vue'
</script>
<template>
  <v-container max-width="100%" height="100%">
    <v-sheet class="w-100 h-100 mx-auto d-flex flex-column bg-transparent">
      <timeline-inventory :current-year="currentYear" />
      <v-spacer></v-spacer>
      <menu-toolbar></menu-toolbar>
    </v-sheet>
  </v-container>
</template>
