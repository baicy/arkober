<script>
import { h } from 'vue'

export default {
  props: {
    pool: Object
  },
  setup(props) {
    const { poolType, re, pick6, pick5, pick4 } = props.pool
    const char6 = []
    const char5 = []
    const char4 = []
    for (const i in pick6) {
      // 这个i竟然是string
      const name = pick6[i]
      let status = ''
      if (poolType === 'single' && !re && i === '0') {
        status = 'new'
      }
      if (['standard', 'classic'].includes(poolType) && i === '0') {
        status = 'shop'
      }
      if (poolType === 'limited' && i === '0') {
        status = 'limited'
      }
      char6.push({ name, status })
    }
    for (const i in pick5) {
      const name = pick5[i]
      let status = ''
      if (poolType === 'single' && !re && i === '0') {
        status = 'new'
      }
      if (['standard', 'classic'].includes(poolType) && i === '0') {
        status = 'shop'
      }
      if (poolType === 'linkage') {
        status = 'limited'
      }
      char5.push({ name, status })
    }
    pick4 && char4.push({ name: pick4, status: 'new' })
    const spacer = h(ElDivider, { direction: 'vertical' })
    return { char6, char5, char4, spacer }
  }
}
</script>
<template>
  <el-space direction="vertical" alignment="flex-start" class="card-content">
    <el-text v-if="pool.name">{{ pool.name }}</el-text>
    <el-space :spacer="spacer">
      <character-tag v-for="char in char6" :key="char.name" :character="char" />
    </el-space>
    <el-space :spacer="spacer">
      <character-tag v-for="char in char5" :key="char.name" :character="char" />
    </el-space>
    <el-container v-if="char4.length">
      <character-tag v-for="char in char4" :key="char.name" :character="char" />
    </el-container>
  </el-space>
</template>
