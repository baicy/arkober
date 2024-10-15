<script setup>
import { useActivityStore } from '@/stores/activity'
const store = useActivityStore()
const activities = store.activities
const dailyworks = store.dailyworks
const comings = store.comings
</script>

<template>
  <el-row>
    <el-col :sm="24" :md="9">
      <activity-card v-for="activity in activities" :key="activity.id" :activity="activity" />
    </el-col>
    <el-col :sm="24" :md="9">
      <activity-card v-for="dailywork in dailyworks" :key="dailywork.id" :activity="dailywork" />
    </el-col>
    <el-col :sm="24" :md="6">
      <activity-card v-for="coming in comings" :key="coming.id" :activity="coming" />
    </el-col>
  </el-row>
</template>
