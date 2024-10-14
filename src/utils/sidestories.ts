import { dayjs } from 'element-plus'
import type { Sidestory, ActiveSidestory } from '@/utils/types'
import sidestorys from '@/data/activity/sidestory.json'

const SIDESTORY_BATTLE_DURATION = 13
const SIDESTORY_EXTRA_SHOP_DURATION = 7
const SIDESTORY_RE_BATTLE_DURATION = 9
const SIDESTORY_RE_EXTRA_SHOP_DURATION = 4
const SIDESTORY_LARGE_BATTLE_DURATION = 20

export const isActive = (params: { sidestory: Sidestory; re?: boolean }) => {
  const { sidestory, re } = params
  const { first, rerun, large, reward, drop } = sidestory
  let open = dayjs.unix(re ? rerun : first)
  if (open.hour() === 12) {
    open = open.hour(16)
  }
  const battle = open
    .add(
      re
        ? SIDESTORY_RE_BATTLE_DURATION
        : large
          ? SIDESTORY_LARGE_BATTLE_DURATION
          : SIDESTORY_BATTLE_DURATION,
      'day'
    )
    .add(12, 'hour')
    .subtract(1, 'second')
  const shop = battle.add(
    re ? SIDESTORY_RE_EXTRA_SHOP_DURATION : SIDESTORY_EXTRA_SHOP_DURATION,
    'day'
  )
  const inBattle = dayjs().diff(battle) < 0
  const inShop = dayjs().diff(shop) < 0
  return inBattle || inShop
    ? {
        active: true,
        info: {
          id: sidestory.id,
          name: sidestory.name,
          open,
          close: inBattle ? battle : shop,
          status: inBattle ? 'battle' : 'shop',
          type: 'sidestory',
          re,
          reward,
          drop
        }
      }
    : { active: false, info: null }
}

const getActiveNew = () => {
  const { active, info } = isActive({
    sidestory: sidestorys.sort((a, b) => b.first - a.first)[0]
  })
  return active ? [info as ActiveSidestory] : []
}

const getActiveRe = () => {
  const { active, info } = isActive({
    sidestory: sidestorys.sort((a, b) => b.rerun - a.rerun)[0],
    re: true
  })
  return active ? [info as ActiveSidestory] : []
}

export const getActiveSidestories: () => ActiveSidestory[] = () => [
  ...getActiveNew(),
  ...getActiveRe()
]
