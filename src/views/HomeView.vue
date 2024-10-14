<script setup>
import { useActivityStore } from '@/stores/activity'
const store = useActivityStore()
const activities = store.activities
</script>

<template>
  <el-row>
    <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />
  </el-row>
</template>
