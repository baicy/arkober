<script setup>
import { computed } from 'vue'
import AffairCard from '@/components/AffairCard.vue'
import { useAffairStore } from '@/stores/affair'

const affair = useAffairStore()
const affairs = computed(() => affair.affairs)
</script>
<template>
  <v-container min-width="100%" height="100%" class="pa-0 overflow-auto">
    <div class="h-50">
      <div class="d-flex ga-2 h-100 overflow-hidden">
        <affair-card v-for="(aff, index) in affairs.present" :key="index" :affair="aff" />
      </div>
    </div>
    <div class="h-50">
      <div class="d-flex ga-2 h-100 overflow-hidden float-right">
        <affair-card v-for="(aff, index) in affairs.future" :key="index" :affair="aff" />
      </div>
    </div>
  </v-container>
</template>
