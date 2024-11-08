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
  id: string
  name: string
  type: string
  open: number
  pickup: Pickup[]
  color?: string[]
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
  type: 'activity' | 'pool'
  status: 'present' | 'future' | 'past'
  id: string
  name: string
  open: number
  close: number
  remain: number
}

export interface ActivityAffair extends Affair {
  color?: string
  activityType: string
  activityStatus: 'battle' | 'shop'
  isReplicate: boolean
}

export interface PoolAffair extends Affair {
  color?: string[]
  poolType: string
  pickup: Pickup[]
}

export type Character = {
  id: string
  name: string
  nationId: string | null
  groupId: string | null
  teamId: string | null
  displayNumber: string
  appellation: string
  rarity: number
  profession: string
  subProfession: string
  sp: number
  type?: string
  onlineTime?: number
  source?: string
  classic?: boolean
  recruit?: boolean
  pools?: string[]
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
