<script>
const statusTypes = {
  new: '新',
  limited: '限',
  shop: '兑',
  reward: '奖'
}

export default {
  props: {
    status: String
  },
  setup(props) {
    const statusText = statusTypes[props.status]
    return { statusText }
  }
}
</script>
<template>
  <el-tag type="danger" effect="dark">{{ statusText }}</el-tag>
</template>
