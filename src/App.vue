<script setup>
import { onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { RouterView } from 'vue-router'
import { useCharacterStore } from '@/stores/character'

const zIndex = 3000
const size = 'default'

onMounted(() => {
  const characterStore = useCharacterStore()
  characterStore.initListById()
})
</script>

<template>
  <el-config-provider :size="size" :zIndex="zIndex" :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
