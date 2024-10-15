<script>
export default {
  props: {
    sidestory: Object
  },
  setup(props) {
    const { reward } = props.sidestory
    const rewardCharacter = {
      name: reward,
      status: 'reward'
    }
    return { rewardCharacter }
  }
}
</script>
<template>
  <el-space direction="vertical" alignment="flex-start" class="card-content">
    <el-text>{{ sidestory.name }}</el-text>
    <character-tag :character="rewardCharacter" />
    <el-text> 掉落：{{ sidestory.drop.join(' ') }} </el-text>
  </el-space>
</template>
