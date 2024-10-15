import { dayjs } from 'element-plus'
import type { Pool, ActivePool } from '@/utils/types'
import normalPools from '@/data/pool/normal.json'
import standardPools from '@/data/pool/standard.json'
import classicPools from '@/data/pool/classic.json'

const POOL_DURATION = 14

export const isActive = (pool: Pool) => {
  const { open: openTime } = pool
  let open = dayjs.unix(openTime as number)
  if (open.hour() === 12) {
    open = open.hour(16)
  }
  const close = open.add(POOL_DURATION, 'day').hour(4).subtract(1, 'second')
  const active = dayjs().diff(close) < 0
  return active
    ? {
        active: true,
        info: {
          ...pool,
          open,
          close,
          type: 'pool',
          poolType: pool.type
        }
      }
    : { active: false, info: null }
}

const getNormals = () => {
  const pools = normalPools.sort((a, b) => b.open - a.open).slice(0, 5)
  const activePools = [] as ActivePool[]
  for (const pool of pools) {
    const { active, info } = isActive(pool)
    active && activePools.push(info as ActivePool)
  }
  return activePools
}

const getStandard = () => {
  const pool = standardPools.sort((a, b) => b.open - a.open)[0]
  const { active, info } = isActive(pool)
  return active ? [{ ...info, poolType: 'standard' } as ActivePool] : []
}

const getClassic = () => {
  const pool = classicPools.sort((a, b) => b.open - a.open)[0]
  const { active, info } = isActive(pool)
  return active ? [{ ...info, poolType: 'classic' } as ActivePool] : []
}

export const getActivePools: () => ActivePool[] = () => [
  ...getNormals(),
  ...getStandard(),
  ...getClassic()
]
