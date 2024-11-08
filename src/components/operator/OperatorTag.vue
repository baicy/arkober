<script setup>
import { RouterLink } from 'vue-router'
import OperatorIcon from './OperatorIcon.vue'

const statusTypes = {
  new: '新',
  limited: '限',
  shop: '兑'
}

const { char } = defineProps({ char: String })
</script>
<template>
  <router-link :to="`/operator/${char}`">
    <operator-icon :id="char" :width="50" v-if="char.substring(0, 5) === 'char_'"></operator-icon>
    <v-btn v-else>{{ char }}</v-btn>
    <v-chip v-if="status" class="ml-1" color="error" variant="outlined" size="small">
      {{ statusTypes[status] }}
    </v-chip>
  </router-link>
</template>
