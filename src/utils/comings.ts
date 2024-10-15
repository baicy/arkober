import { dayjs } from 'element-plus'
import lives from '@/data/activity/live.json'

const getLive = () => {
  const now = dayjs()
  const { title, type, time, forecast } = lives[0]
  return now.unix() < lives[0].time
    ? [
        {
          id: 'comingLive',
          title,
          type: 'live',
          liveType: type,
          close: dayjs.unix(time),
          forecast
        }
      ]
    : []
}

export const getActiveComings = () => {
  return [...getLive()]
}
