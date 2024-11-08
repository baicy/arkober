import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', () => {
  const text = ref('')
  const show = ref(false)
  const delay = ref(2000)

  function line(str: string) {
    text.value = str
    show.value = true
    setTimeout(() => {
      show.value = false
    }, delay.value)
  }

  return { show, text, line }
})
