<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { useSystemStore } from '@/stores/system'
import OperatorInfo from '@/components/operator/OperatorInfo.vue'
import PoolInfo from '@/components/pool/poolInfo.vue'

const message = useMessageStore()
const msg = computed(() => {
  return {
    show: message.show,
    text: message.text
  }
})
const system = useSystemStore()
const infoDialog = computed(() => system.infoDialog)
</script>
<template>
  <v-app>
    <v-main height="calc(100vh)" class="overflow-auto">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['OperatorPage']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
    <v-snackbar v-model="msg.show">{{ msg.text }}</v-snackbar>
    <v-dialog v-model="infoDialog.open" fullscreen transition="dialog-bottom-transition">
      <v-sheet class="position-relative">
        <div class="position-absolute top-0 left-0">
          <v-btn icon="mdi-close" @click="infoDialog.open = false" color="error"></v-btn>
        </div>
        <v-sheet class="w-100 h-100 pa-15">
          <operator-info v-if="infoDialog.type === 'char'" :char="infoDialog.item" />
          <pool-info v-if="infoDialog.type === 'pool'" :pool="infoDialog.item" />
        </v-sheet>
      </v-sheet>
    </v-dialog>
  </v-app>
</template>
