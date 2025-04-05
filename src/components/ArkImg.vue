<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: String,
  w: Number || undefined,
  h: Number || undefined
})
const { src, w, h } = props
const width = ref(w)
const height = ref(h)
const url = ref('')
const loaded = ref(false)

if (!w || !h) {
  width.value = 24
  height.value = 24
}
const loadImg = () => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url.value
  })
}
const imgExsit = async () => {
  url.value = `${import.meta.env.BASE_URL}${src}.png`
  loaded.value = await loadImg(url.value)
}
onMounted(() => {
  imgExsit()
})
</script>
<template>
  <img v-if="loaded" :src="url" class="ark-img" />
  <v-btn v-else icon="mdi-image-broken-variant"></v-btn>
</template>
<style scoped>
.ark-img {
  width: 100%;
}
</style>
