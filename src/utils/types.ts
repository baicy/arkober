import { dayjs } from 'element-plus'

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
  open: number
  battle: number
  shop: number
  reward: string
}

export type ActiveActivity = {
  id: string
  name: string
  open: dayjs.Dayjs
  close: dayjs.Dayjs
  status: string
  reward: string
}

export type Pool = {
  id: string
  name?: string
  type?: string
  open: number
  pick6: string[]
  pick5: string[]
  pick4?: string
}

export type ActivePool = {
  id: string
  name: string
  type: string
  poolType: string
  open: dayjs.Dayjs
  close: dayjs.Dayjs
  pick6: string[]
  pick5: string[]
  pick4?: string
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
  subProfessionId: string
  type?: string
  onlineTime?: number
  source?: string
  classic?: boolean
  recruit?: boolean
}

export type Rogue = {
  id: string
  name: string
  start: number
  monthlyName: string
}
