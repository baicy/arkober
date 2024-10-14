<script>
import { ref } from 'vue'
import { useCharacterStore } from '@/stores/character'

export default {
  props: {
    character: Object
  },
  setup(props) {
    const characterStore = useCharacterStore()
    const list = characterStore.listById
    const { name } = props.character
    const realname = ref(name)
    if (name.substr(0, 5) === 'char_') {
      realname.value = list[name].name
    }
    return { realname }
  }
}
</script>
<template>
  <el-text>
    <character-label v-if="character.status === 'reward'" :status="character.status" />
    {{ realname }}
    <character-label
      v-if="character.status && character.status !== 'reward'"
      :status="character.status"
    />
  </el-text>
</template>
