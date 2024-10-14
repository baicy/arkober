const duration = (diff: number) => {
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

export { duration }
