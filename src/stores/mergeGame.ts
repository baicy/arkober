import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  ChessboardCell,
  ChessboardSelected,
  ProfessionTerms,
  AlbumCell,
  Force
} from '@/utils/types'
import { CHESSBOARD_SIDE_LENGTH, professions, forces } from '@/utils/constants'
import characters from '@/data/characters.json'
import sps from '@/data/sp.json'
import { Base64 } from 'js-base64'
import { useCharacterStore } from './character'
import { useMessageStore } from './message'

export const useMergeGameStore = defineStore('mergeGame', () => {
  const chessboard = reactive(Array(CHESSBOARD_SIDE_LENGTH).fill(null))
  for (const i in chessboard) {
    chessboard[i] = Array(CHESSBOARD_SIDE_LENGTH).fill({} as ChessboardCell)
  }
  const selected = ref({ char: {}, x: -1, y: -1 } as ChessboardSelected)
  const professionList: Record<string, any> = professions
  const album = reactive({} as Record<string, AlbumCell>)
  for (const i in characters) {
    const { id, name, rarity, color1, color2, sp } = characters[i]
    const c = {
      id,
      name,
      rarity,
      color1,
      color2,
      sp,
      unlock: false,
      product: 0,
      elite: /_amiya/.test(id) ? 2 : 0,
      favor: 0
    }
    album[characters[i].id] = { ...c }
  }
  const tickets = reactive({ red: 0, green: 0, yellow: 0 } as Record<string, number>)
  const character = useCharacterStore().list
  const msg = useMessageStore()

  const forceList = computed(() => {
    const list = reactive({} as Record<string, Force>)
    for (const i in forces) {
      const { id, name, color } = forces[i]
      list[id] = {
        id,
        name,
        color,
        chars: [],
        favor: 0,
        allFavor: 0,
        unlock: false
      }
    }
    for (const i in characters) {
      const { id, nationId, groupId, teamId } = characters[i]
      list[groupId ? groupId : teamId ? teamId : nationId!].chars.push(id)
    }
    for (const i in list) {
      list[i].allFavor = list[i].chars.length * 100
      list[i].favor = list[i].chars.reduce((sum, c) => sum + album[c].favor, 0)
      list[i].unlock = list[i].favor > list[i].allFavor * 0.1
    }
    return list
  })

  const getRandomItem = (arr: any[]): any => {
    const l = arr.length
    const i = Math.floor(Math.random() * l)
    return arr[i]
  }

  function product(terms: ProfessionTerms, rarity: number) {
    const { profession, subProfession } = terms
    let chars = characters
    if (profession) {
      if (subProfession) {
        chars = chars.filter((c) => c.subProfession === subProfession && c.sp < 1)
      } else {
        chars = chars.filter((c) => c.profession === profession && c.sp < 1)
      }
    }
    if (rarity === 0) {
      const r1 = 5,
        r2 = 30
      const rng = Math.floor(Math.random() * 1000)
      const realRarity = rng < r1 ? 1 : rng < r2 ? 2 : 3
      chars = chars.filter((c) => c.rarity === realRarity)
    } else {
      chars = chars.filter((c) => c.rarity === rarity)
    }
    const res = getRandomItem(chars)
    album[res.id].unlock = true
    album[res.id].product++
    if (album[res.id].elite < res.elite) album[res.id].elite = res.elite
    return res
  }

  function findEmptyCell() {
    for (let i = 0; i < CHESSBOARD_SIDE_LENGTH; i++) {
      for (let j = 0; j < CHESSBOARD_SIDE_LENGTH / 2; j++) {
        if (!chessboard[j][i].id) {
          return [j, i]
        }
      }
    }
    for (let i = 0; i < CHESSBOARD_SIDE_LENGTH; i++) {
      for (let j = CHESSBOARD_SIDE_LENGTH / 2; j < CHESSBOARD_SIDE_LENGTH; j++) {
        if (!chessboard[j][i].id) {
          return [j, i]
        }
      }
    }
    return [-1, -1]
  }
  function generate(id: string = '') {
    const [x, y] = findEmptyCell()
    if (x === -1) {
      msg.line('棋盘空间不足')
      return null
    }
    if (id) {
      const char = character[id]
      chessboard[x][y] = { ...char, elite: /_amiya/.test(id) ? 2 : 1 }
      album[id].product++
      msg.line(`调用${char.name}`)
      return char
    } else {
      const char = product({}, 0)
      chessboard[x][y] = { ...char, elite: 1 }
      return char
    }
  }

  function select(x: number, y: number) {
    selected.value = {
      char: chessboard[x][y],
      x,
      y
    }
  }

  function unselect() {
    selected.value = {
      char: { name: '' } as ChessboardCell,
      x: -1,
      y: -1
    }
  }

  function getProfession(p1: ProfessionTerms, p2: ProfessionTerms, rarity: number) {
    let profession,
      subProfession,
      isRandomProfession = false
    const availableProfessions = Object.values(professionList)
      .filter((v) => v.r[rarity - 1] > 0)
      .map((v) => v.id)
    if (p1.profession === p2.profession) {
      profession = p1.profession
      if (!professionList[profession!].r[rarity - 1]) {
        isRandomProfession = true
        profession = getRandomItem(availableProfessions)
      }
    } else {
      isRandomProfession = true
      profession = getRandomItem(availableProfessions)
    }
    // 如果职业不是随机的，5/6星判断子职业
    if (!isRandomProfession && rarity > 4) {
      if (
        p1.subProfession === p2.subProfession &&
        professionList[profession].sub[p1.subProfession!][rarity - 1]
      ) {
        subProfession = p1.subProfession
      } else {
        subProfession = undefined
      }
    }
    return { profession, subProfession }
  }

  function plus(tcell: ChessboardSelected, cell: ChessboardSelected) {
    const { char: tchar, x: tx, y: ty } = tcell
    const { char, x, y } = cell
    const profession = getProfession(char, tchar, char.rarity + 1)
    const merged = {
      ...product(profession, char.rarity + 1),
      ...{ elite: char.elite }
    }
    if (album[merged.id].elite < merged.elite) album[merged.id].elite = merged.elite
    chessboard[tx][ty] = merged
    chessboard[x][y] = {} as ChessboardCell
    selected.value = {
      char: merged,
      x: tx,
      y: ty
    }
    return merged
  }

  const spList: Record<string, any[]> = sps
  function merge(tx: number, ty: number) {
    const { char, x, y } = selected.value
    const tchar = chessboard[tx][ty]
    // 放在原处
    if (x === tx && y === ty) {
      return selected.value
    }
    // 目标为空，移动
    if (!tchar.id) {
      chessboard[tx][ty] = chessboard[x][y]
      chessboard[x][y] = {} as ChessboardCell
      selected.value = {
        char: chessboard[tx][ty],
        x: tx,
        y: ty
      }
      return char
    }
    // 先处理异格
    if (char.id !== tchar.id && (spList[char.id] || spList[tchar.id])) {
      const [origin, addon] = spList[char.id] ? [char, tchar] : [tchar, char]
      const spInfo = spList[origin.id]
      for (const i in spInfo) {
        if ((spInfo[i].elite && origin.elite >= spInfo[i].elite) || !spInfo[i].elite) {
          if (
            addon.id !== spInfo[i].char &&
            addon.rarity === spInfo[i].rarity &&
            addon.profession === spInfo[i].profession
          ) {
            chessboard[x][y] = {} as ChessboardCell
            chessboard[tx][ty] = { ...character[spInfo[i].char], ...{ elite: origin.elite } }
            album[spInfo[i].char].unlock = true
            album[spInfo[i].char].elite = Math.max(album[spInfo[i].char].elite, origin.elite)
            album[spInfo[i].char].product++
            selected.value = {
              char: chessboard[tx][ty],
              x: tx,
              y: ty
            }
            return chessboard[tx][ty]
          }
        }
      }
    }
    // 2个干员相同，4星以上精二
    if (char.id === tchar.id && [4, 5, 6].includes(char.rarity)) {
      // 精一+精一=精二
      if (char.elite === 1 && tchar.elite === 1) {
        chessboard[tx][ty] = { ...chessboard[tx][ty], ...{ elite: 2 } }
        chessboard[x][y] = {} as ChessboardCell
        if (album[char.id].elite < 2) album[char.id].elite = 2
        selected.value = {
          char: chessboard[tx][ty],
          x: tx,
          y: ty
        }
        return chessboard[tx][ty]
      }
      // 2个精二的4/5星合成5/6星精二
      if (char.elite + tchar.elite === 4 && char.rarity + tchar.rarity !== 12) {
        return plus({ char: tchar, x: tx, y: ty }, { char, x, y })
      }
      return selected.value
    }
    // 同级的精英化程度一样的不同干员才可以合成上一级干员，6星封顶
    if (
      char.rarity === tchar.rarity &&
      char.elite === tchar.elite &&
      char.rarity + tchar.rarity < 12
    ) {
      return plus({ char: tchar, x: tx, y: ty }, { char, x, y })
    }
    return selected.value
  }

  function clear() {
    for (const i in chessboard) {
      for (const j in chessboard[i]) {
        chessboard[i][j] = {} as ChessboardCell
      }
    }
    unselect()
  }

  function load() {
    const storageString = localStorage.getItem('merge')
    let storage = {} as { chessboard: any; album: any; tickets: any }
    if (storageString) {
      storage = JSON.parse(decodeURIComponent(Base64.decode(storageString)))
    }
    for (const i in storage.chessboard) {
      const ii = Number(i)
      for (const j in storage.chessboard[i]) {
        const ij = Number(j)
        chessboard[ii][ij] = storage.chessboard[ii][ij]
      }
    }
    for (const i in album) {
      Object.assign(album[i], storage.album[i])
    }
    for (const i in storage.tickets) {
      tickets[i] = storage.tickets[i]
    }
  }

  function battle() {
    const { char, x, y } = selected.value
    album[char.id].favor += char.elite === 2 ? 3 : 1
    chessboard[x][y] = {} as ChessboardCell
    unselect()
  }

  function sell() {
    const { char, x, y } = selected.value
    if (char.rarity === 1) tickets.green += 1
    if (char.rarity === 2) tickets.green += 3
    if (char.rarity === 3) tickets.green += 5
    if (char.rarity === 4) {
      tickets.green += 30 * char.elite
      tickets.yellow += 1 * char.elite
    }
    if (char.rarity === 5) tickets.yellow += 5 * char.elite
    if (char.rarity === 6) tickets.yellow += 10 * char.elite
    chessboard[x][y] = {} as ChessboardCell
    unselect()
  }

  const getPrice = (rarity: number, type: string = 'buy'): Record<string, number> => {
    if (type === 'buy') {
      if (rarity === 1) return { green: 2 }
      if (rarity === 2) return { green: 6 }
      if (rarity === 3) return { green: 10 }
      if (rarity === 4) return { green: 60 }
      if (rarity === 5) return { yellow: 10 }
      if (rarity === 6) return { yellow: 20 }
    }
    if (type === 'unlock') {
      if (rarity < 4) return { green: 30 }
      if (rarity === 4) return { green: 750 }
      if (rarity === 5) return { yellow: 45 }
      if (rarity === 6) return { yellow: 180 }
    }
    return { yellow: 180 }
  }

  function buy(id: string) {
    if (album[id].unlock) {
      const char = generate(id)
      if (!char) return
      const price = getPrice(character[id].rarity)
      for (const color in price) {
        tickets[color] -= price[color]
      }
    } else {
      const { nationId, groupId, teamId, sp, rarity } = character[id]
      const force: string = groupId || teamId || nationId || ''
      if (sp < 1) {
        const price = getPrice(rarity, forceList.value[force].unlock ? 'unlock' : 'unknown')
        for (const color in price) {
          tickets[color] -= price[color]
        }
        Object.assign(album[id], {
          unlock: true,
          elite: 1
        })
      }
    }
  }

  return {
    chessboard,
    selected,
    album,
    forceList,
    tickets,
    generate,
    select,
    unselect,
    merge,
    clear,
    load,
    battle,
    getPrice,
    sell,
    buy
  }
})
