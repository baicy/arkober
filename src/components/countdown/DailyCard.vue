<script>
export default {
  props: {
    work: Object
  }
}
</script>
<template>
  <el-space direction="vertical" alignment="flex-start" class="card-content">
    <el-text v-for="mission in work.contents" :key="mission">{{ mission }}</el-text>
  </el-space>
</template>
