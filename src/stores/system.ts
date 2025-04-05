import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { skdApi } from '@/utils/skland'
import type { Affair } from '@/utils/types'

export const useSystemStore = defineStore('system', () => {
  const timelinePosition = ref(0)
  const infoDialog = reactive({ open: false, type: '', item: null })
  const activities = ref([] as Affair[])

  const auth = reactive({
    cred: '',
    token: '',
    timestamp: 0,
    uid: '',
    nickName: '',
    player: null,
    cultivate: null
  } as {
    cred: string
    token: string
    timestamp: number
    uid: string
    nickName: string
    player: any
    cultivate: any
  })
  const localAuthData = localStorage.getItem('skdAuth')
  if (localAuthData) {
    Object.assign(auth, JSON.parse(localAuthData))
  }

  async function login(cred: string) {
    auth.cred = cred
    bind()
  }

  async function bind() {
    auth.token = (await skdApi('/api/v1/auth/refresh', '', '', null)).token
    console.log('get token:', auth.token)
    const bindingList: { list: any[] } = await skdApi(
      '/api/v1/game/player/binding',
      auth.cred,
      auth.token
    )
    const doctors: Array<{
      channelMasterId: string
      channelName: string
      isDefault: boolean
      isDelete: boolean
      isOfficial: boolean
      nickName: string
      uid: string
    }> = bindingList.list.find((v) => v.appCode === 'arknights')?.bindingList ?? []
    if (!doctors.length) {
      auth.token = ''
      return -1
    } else {
      const doctor = doctors.find((v) => v.isDefault)!
      auth.uid = doctor.uid
      auth.nickName = doctor.nickName
      localStorage.setItem('skdAuth', JSON.stringify(auth))
    }
  }

  async function getInfo() {
    try {
      const [player, cultivate] = await Promise.all([
        skdApi(`/api/v1/game/player/info?uid=${auth.uid}`, auth.cred, auth.token),
        skdApi(`/api/v1/game/cultivate/player?uid=${auth.uid}`, auth.cred, auth.token)
      ])
      Object.assign(auth, { timestamp: player.currentTs, player, cultivate })
      localStorage.setItem('skdAuth', JSON.stringify(auth))
    } catch {
      bind()
      getInfo()
    }
  }

  return { timelinePosition, infoDialog, activities, auth, login, getInfo }
})
