export const pi = Math.PI
export const { floor, random } = Math
export const sin = (value) => Math.sin(value)
export const cos = (value) => Math.cos(value)
export const rng = (range, min = 1) => floor(Math.random() * range) + min
export const to_radians = (num) => (num * pi) / 180
export const distance = (x1, y1, x2, y2) => Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
export const to_array = (length, fill = 0) => Array(length).fill(fill)