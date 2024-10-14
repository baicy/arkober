import { dayjs } from 'element-plus'
import nosans from '@/data/activity/nosan.json'
import type { Activity, ActiveActivity } from '@/utils/types'

export const isActive = (activity: Activity) => {
  const { open: openTime, battle: battleTime, shop: shopTime, reward } = activity
  const open = dayjs.unix(openTime)
  const battle = dayjs.unix(battleTime)
  const shop = dayjs.unix(shopTime)
  const inBattle = dayjs().diff(battle) < 0
  const inShop = dayjs().diff(shop) < 0
  return inBattle || inShop
    ? {
        active: true,
        info: {
          id: activity.id,
          name: activity.name,
          open,
          close: inBattle ? battle : shop,
          status: inBattle ? 'battle' : 'shop',
          type: 'nosan',
          reward
        }
      }
    : { active: false, info: null }
}
export const getActiveNosans = () => {
  const activities = nosans.sort((a, b) => b.shop - a.shop).slice(0, 5)
  const activeActivities = [] as ActiveActivity[]
  for (const activity of activities) {
    const { active, info } = isActive(activity)
    active && activeActivities.push(info as ActiveActivity)
  }
  return activeActivities
}
