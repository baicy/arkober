<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useMessageStore } from './stores/message'

const router = useRouter()
const route = useRoute()

const drawer = ref(false)
const message = useMessageStore()
const msg = computed(() => {
  return {
    show: message.show,
    text: message.text
  }
})
</script>
<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary location="right" color="secondary">
      <v-list color="surface">
        <v-list-item></v-list-item>
        <v-list-item prepend-icon="mdi-home" title="首页" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-controller" title="干员合合" to="/game/merge"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main height="calc(100vh)" class="overflow-auto">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['OperatorView']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
    <div class="position-absolute right-0 pa-2" style="z-index: 9999">
      <v-btn color="secondary" v-if="route.name !== 'home'" @click="router.back()">
        <v-icon icon="mdi-chevron-left"></v-icon>
      </v-btn>
      <v-btn color="secondary" @click="drawer = !drawer">
        <ark-icon icon="logo-rhodes-island" only></ark-icon>
      </v-btn>
    </div>
    <v-snackbar v-model="msg.show">{{ msg.text }}</v-snackbar>
  </v-app>
</template>
