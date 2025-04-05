import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Character, Skin, Pool } from '@/utils/types'
import characters from '@/data/characters.json'
import { skins } from '@/data/skins.json'
import pools from '@/data/pools.json'
import { ato } from '@/utils/utils'
import axios from 'axios'
import dayjs from 'dayjs'

export const useCharacterStore = defineStore('character', () => {
  const chars = characters.filter((c) => c.type != 'rogue') as Character[]

  const load123 = async () => {
    const { episodes } = await (await axios.get('/mh/6253')).data.data
    for (const i in episodes) {
      const { cid, title } = episodes[i]
      // 官漫给U的名字的大小写写错了
      const wrongList = { 'U-official': 'U-Official' } as Record<string, string>
      const c = chars.find((v) => v.name === (wrongList[title] || title))
      if (c) {
        c.comic = cid
      }
    }
  }
  load123()

  const list = reactive(ato(chars, 'id') as Record<string, Character>)

  for (const i in list) {
    list[i].skins = []
    list[i].pools = []
  }

  for (const i in skins) {
    list[skins[i].char].skins.push(skins[i] as Skin)
  }

  const poolList = Object.values(pools)
  for (const i in poolList) {
    const { fake = false, type, pickup } = poolList[i] as Pool
    if (fake) continue
    if (!pickup.length) continue
    for (const up of pickup) {
      for (const index in up.chars) {
        const char = up.chars[index]
        let status = ''
        if (!['attain', 'cattain'].includes(type)) {
          if (type === 'standard') {
            if (index === '0') {
              status = 'shop'
            } else {
              status = 'up'
            }
          } else if (type === 'classic') {
            if (up.rarity === 6) {
              if (up.chars.length > 2) {
                status = 'shop'
              } else {
                status = index === '0' ? 'shop' : 'up'
              }
            } else {
              if (up.chars.length > 3) {
                status = 'shop'
              } else {
                status = index === '0' ? 'shop' : 'up'
              }
            }
          } else {
            status = 'up'
          }
        }
        list[char].pools.push({ ...poolList[i], status } as Pool)
      }
    }
  }
  for (const id in list) {
    const pools = list[id].pools
    let lastUp = ''
    let lastShop = ''
    for (let i = pools.length - 1; i >= 0; i--) {
      const { status, start } = pools[i]
      if (status === 'shop') {
        if (lastShop) {
          pools[i].duration = dayjs(start).diff(dayjs(lastShop), 'day')
        }
        lastShop = start
        lastUp = start
      }
      if (status === 'up') {
        if (lastUp) {
          pools[i].duration = dayjs(start).diff(dayjs(lastUp), 'day')
        }
        lastUp = start
      }
    }
  }

  return { list }
})
