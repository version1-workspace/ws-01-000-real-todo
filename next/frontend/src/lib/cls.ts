export const rgbaToHex = (rgba: string) => {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "")
      .split(",")
      .slice(0, 3)
      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("")
  )
}

export const classHelper = (obj: { [key: string]: boolean | undefined }) =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      return acc + " " + key
    }

    return acc
  }, "")

export const join = (...args: (string | undefined)[]) => {
  return args.filter((it) => !!it).join(" ")
}
