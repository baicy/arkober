import { dayjs } from 'element-plus'
import rogueInfo from '@/data/activity/rogue.json'
import towerInfo from '@/data/activity/tower.json'
import type { Rogue } from './types'
import { useCharacterStore } from '@/stores/character'

const RESOURCEACTIVEDAYS: Record<string, any> = {
  ce: { display: 'CE 龙门币', days: [2, 4, 6, 7] }, // 龙门币
  ap: { display: 'AP 红票', days: [1, 4, 6, 7] }, // 红票
  ca: { display: 'CA 技能书', days: [2, 3, 5, 7] }, // 技能书
  pra: { display: 'PR-A 医疗芯片 重装芯片', days: [1, 4, 5, 7] }, // 医疗/重装
  prb: { display: 'PR-B 术师芯片 狙击芯片', days: [1, 2, 5, 6] }, // 术师/狙击
  prc: { display: 'PR-C 辅助芯片 先锋芯片', days: [3, 4, 6, 7] }, // 辅助/先锋
  prd: { display: 'PR-D 特种芯片 近卫芯片', days: [2, 3, 6, 7] } // 特种/近卫
}

const diffDaysDisplay = (days: number) => {
  let str = `${days}天后`
  if (days === 1) str = '明天'
  if (days === 2) str = '后天'
  return str
}

const nextDay = (today: number, days: number[]) => {
  const pos = days.indexOf(today)
  let nextPos = pos + 1
  let diffDays = days[nextPos] - today
  if (pos === 3) {
    nextPos = 0
    diffDays = days[nextPos] + 7 - today
  }
  return diffDaysDisplay(diffDays)
}

const getDailyWork = () => {
  const now = dayjs()
  const dayend = now.add(1, 'day').hour(4).minute(0).second(0)
  const contents = [] as string[]
  contents.push('日常任务')
  const today = now.day()
  for (const i in RESOURCEACTIVEDAYS) {
    const battle = RESOURCEACTIVEDAYS[i]
    if (battle.days.includes(today)) {
      contents.push(`${battle.display} 下次开放：${nextDay(today, battle.days)}`)
    }
  }
  return { id: 'dailywork', type: 'daily', dailyType: 'day', close: dayend, contents }
}

const getWeeklyWork = () => {
  const now = dayjs()
  const weekend = now
    .add(7 - now.day(), 'day')
    .hour(4)
    .minute(0)
    .second(0)
  const contents = [] as string[]
  contents.push('周常任务')
  contents.push('剿灭作战')
  return { id: 'weeklywork', type: 'daily', dailyType: 'week', close: weekend, contents }
}

const getMonthlyWork = () => {
  const now = dayjs()
  const monthend = now.add(1, 'month').date(1).hour(4).minute(0).second(0)
  const contents = [] as string[]
  contents.push('绿票商店')
  contents.push('黄票商店')
  contents.push('模组块 - 红票商店')
  if (rogueInfo.monthSquad[0].close > now.unix()) {
    const { rogue, chars } = rogueInfo.monthSquad[0]
    const store = useCharacterStore()
    const char = store.listById[chars[0]].name
    const rogues: Record<string, Rogue> = rogueInfo.topics

    contents.push(`月度小队 - ${rogues[rogue].name} - ${char}`) // eslint-disable-line
  }
  return { id: 'monthlywork', type: 'daily', dailyType: 'month', close: monthend, contents }
}

const getActiveTower = () => {
  const { seasons } = towerInfo
  const season = seasons[0]
  if (dayjs().unix() > season.endTs) return []
  return [
    {
      id: 'towerwork',
      type: 'tower',
      open: dayjs.unix(season.startTs),
      close: dayjs.unix(season.endTs),
      contents: [`${season.name}首通`]
    }
  ]
}

export const getActiveDailyWorks = () => {
  return [getDailyWork(), getWeeklyWork(), getMonthlyWork(), ...getActiveTower()]
}
