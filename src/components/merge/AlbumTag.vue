<script setup>
import OperatorIcon from '@/components/operator/OperatorIcon.vue'

const { char, forceColor, forceUnlock } = defineProps({
  char: Object,
  forceColor: String,
  forceUnlock: Boolean
})
</script>
<template>
  <div class="album-tag cursor-pointer bg-background">
    <div class="album-tag-border" :class="`bg-rarity-${char.unlock ? char.rarity : 0}`">
      <v-icon v-if="!char.unlock && !forceUnlock" icon="mdi-help" :color="forceColor"></v-icon>
      <operator-icon
        v-else
        :id="char.id"
        :elite="char.elite"
        :unlock="forceUnlock && !char.unlock"
        style="margin-top: 6px"
      ></operator-icon>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$size: 50px;
.album-tag {
  .album-tag-border {
    width: $size;
    height: $size;
    display: flex;
    justify-content: center;
    align-items: center;
    .album-tag-name {
      font-size: 0.5rem;
    }
  }
}
</style>
