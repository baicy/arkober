import dayjs from 'dayjs'

export type Sidestory = {
  id: string
  name: string
  first: number
  rerun: number
  trail: number
  reward: string
  large?: boolean
  linkage?: boolean
  drop?: string[]
}

export type ActiveSidestory = {
  id: string
  name: string
  re: boolean
  open: dayjs.Dayjs
  close: dayjs.Dayjs
  status: string
  reward: string
  drop: string[]
  type: string
}

export type Activity = {
  id: string
  name: string
  type: string
  color?: string[]
  startTime: number
  endTime: number
  rewardEndTime: number
  isReplicate: boolean
  reward?: any
}

export type ActiveActivity = {
  id: string
  name: string
  open: dayjs.Dayjs
  close: dayjs.Dayjs
  status: string
  reward: string
}

interface Pickup {
  rarity: number
  chars: string[]
}

export interface Pool {
  fake: boolean
  id: string
  name: string
  type: string
  start: string
  pickup: Pickup[]
  color: string[]
  status: '' | 'up' | 'shop'
  duration: number
}

export type PoolInfo = {
  id: string
  name: string
  type: string
  poolType: string
  re?: boolean
  status: 'active' | 'coming' | 'closed'
  open: dayjs.Dayjs
  close: dayjs.Dayjs
  pick6: string[]
  pick5: string[]
  pick4?: string
}

export interface Affair {
  fake: boolean
  id: string
  name: string
  start: string
  days?: number
  type: string
  rerun: boolean
  color: string[]
  pickup?: Pickup[]
  reward?: any
  drop?: string[]
}

export interface Character {
  id: string
  name: string
  color1: string
  color2: string
  nationId: string | null
  groupId: string | null
  teamId: string | null
  displayNumber: string
  appellation: string
  rarity: number
  profession: string
  subProfession: string
  sp: number
  passport: string
  type?: string
  source?: string
  onlineTime: string
  recruitTime: string
  classicTime: string
  comic: string
  skins: Skin[]
  pools: Pool[]
  cultivate: any
}

export interface Skin {
  id: string
  char: string
  img: string
  name: string
  colors: string[]
  groupId: string
  groupName: string
  tag: string
  online: string
}

export type Rogue = {
  id: string
  name: string
  start: number
  monthlyName: string
}

export type Material = {
  id: string
  name: string
  rarity: number
  type: string
  sortId: number
  description: string
  usage: string
}

// 合成小游戏
export interface ChessboardCell {
  id: string
  name: string
  rarity: number
  profession: string
  subProfession: string
  elite: 1 | 2
}

export interface ChessboardSelected {
  char: ChessboardCell
  x: number
  y: number
}

export interface ProfessionTerms {
  profession?: string
  subProfession?: string
}

export interface AlbumCell {
  id: string
  name: string
  rarity: number
  color1: string
  color2: string
  sp: number
  unlock: boolean
  product: number
  elite: number
  favor: number
}

export interface Force {
  id: string
  name: string
  color: string
  chars: string[]
  favor: number
  allFavor: number
  unlock: boolean
}
