<script setup>
import { ref } from 'vue'
import { resourceCrate } from '@/utils/constants'
import { RouterLink } from 'vue-router'

const statusTypes = {
  new: '新',
  limited: '限',
  shop: '兑'
}

const { char } = defineProps({ char: String })
</script>
<template>
  <router-link :to="`/operator/${id}`">
    <div class="operator-cell">
      <img
        v-if="id.substring(0, 5) === 'char_'"
        :src="`${resourceCrate}/avatar/${id}.png`"
        :alt="name"
      />
      <v-btn v-else>{{ char }}</v-btn>
      <v-chip v-if="status" class="ml-1" color="error" variant="outlined" size="small">
        {{ statusTypes[status] }}
      </v-chip>
    </div>
  </router-link>
</template>
<style lang="scss" scoped>
$length: 50px;
.operator-cell {
  display: inline-block;
  width: $length;
  height: $length;
  img {
    width: $length;
    height: $length;
  }
}
</style>
