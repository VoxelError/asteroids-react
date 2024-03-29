import { debug_collisions, draw_collision } from "./index.js"
import { pi, sin, cos } from "./math"

export const draw_asteroids = (context, asteroids_list) => asteroids_list.forEach((asteroid) => {
	const { x, y, r, a, vert } = asteroid
	const offsets = asteroid.offs
	const vertex = (x_axis, index) => (x_axis
		? x + (r * offsets[index] * cos(a + (index * pi * 2 / vert)))
		: y + (r * offsets[index] * sin(a + (index * pi * 2 / vert)))
	)

	context.strokeStyle = "grey"
	context.beginPath()
	context.moveTo(vertex(true, 0), vertex(false, 0))
	offsets.forEach((v, index) => context.lineTo(vertex(true, index), vertex(false, index)))
	context.closePath()
	context.stroke()

	// debug_collisions && draw_collision(x, y, r)
})