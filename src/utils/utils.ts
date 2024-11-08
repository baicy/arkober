import { DEFAULT_SKIN_COLOR } from '@/utils/constants'
import { calcAPCA } from 'apca-w3'

export const getShadowColor = (color: string) => {
  const c = color || DEFAULT_SKIN_COLOR
  const b = Math.abs(Number(calcAPCA(0, c)))
  const w = Math.abs(Number(calcAPCA(0xffffff, c)))
  return w > Math.min(b, 50) ? 'white' : 'black'
}

export const getTextColor = (color: string) => {
  const b = Math.abs(Number(calcAPCA(0, color)))
  const w = Math.abs(Number(calcAPCA(0xffffff, color)))
  return w > Math.min(b, 10) ? 'white' : 'black'
}

export const duration = (diff: number) => {
  let remain = diff
  const day = Math.floor(remain / (24 * 3600))
  remain -= day * 24 * 3600
  const hour = Math.floor(remain / 3600)
  remain -= hour * 3600
  const minute = Math.floor(remain / 60)
  remain -= minute * 60
  const second = remain
  return `${day}天 ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`
}

export const len = function (str: string) {
  if (typeof str !== 'string') {
    return 0
  }
  return str.replace(/[^\\x00-\xff]/g, '01').length
}

export const ato = (arr: any[], key: string) => {
  return arr.reduce((obj, cur) => {
    obj[cur[key]] = cur
    return obj
  }, {})
}

export const firstLetterUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
