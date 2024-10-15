<script setup>
// import { Edit, View as IconView } from '@element-plus/icons-vue'
const props = defineProps(['live'])
const { live } = props
</script>
<template>
  <el-link href="https://live.bilibili.com/5555734" target="_blank">
    {{ live.title }}<el-icon class="el-icon--right"><CoffeeCup /></el-icon>
  </el-link>
</template>
