<script>
export default {
  props: {
    activity: Object
  },
  setup(props) {
    const { reward } = props.activity
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
    <character-tag :character="rewardCharacter" />
  </el-space>
</template>
