export const classHelper = (obj: {[key: string]: boolean}) => Object.keys(obj).reduce((acc, key) => {
  if (obj[key]) {
    return acc + ' ' + key
  }

  return acc
}, "")
