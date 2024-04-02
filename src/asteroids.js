import { pi, sin, cos, distance, random, rng, to_array } from "./math"

export const new_asteroid = (x, y, r, game_level, asteroids_list) => {
	const angle = random() * pi * 2
	const vertices = rng(11, 5)
	const offsets = to_array(vertices).map(() => (random() * 0.8) + 0.6)
	const velocity = () => {
		const roll = (random() * 0.2) + 0.2
		const flip = random() < 0.5 ? -1 : 1
		const mult = game_level * 1.1
		return roll * flip * mult
	}
	asteroids_list.push({ x, y, r, a: angle, xv: velocity(), yv: velocity(), offs: offsets, vert: vertices })
}

export const move_asteroids = (asteroids_list, canvas) => asteroids_list.forEach((asteroid) => {
	asteroid.x += asteroid.xv
	asteroid.y += asteroid.yv

	asteroid.x < -asteroid.r && (asteroid.x = canvas.width + asteroid.r)
	asteroid.x > canvas.width + asteroid.r && (asteroid.x = -asteroid.r)
	asteroid.y < -asteroid.r && (asteroid.y = canvas.height + asteroid.r)
	asteroid.y > canvas.height + asteroid.r && (asteroid.y = -asteroid.r)
})

export const draw_asteroids = (context, asteroids_list) => asteroids_list.forEach((asteroid) => {
	const { x, y, r, a, vert } = asteroid
	const offsets = asteroid.offs
	const vertex = (x_axis, index) => (x_axis
		? x + (r * offsets[index] * cos(a + (index * pi * 2 / vert)))
		: y + (r * offsets[index] * sin(a + (index * pi * 2 / vert)))
	)

	context.beginPath()
	context.moveTo(vertex(true, 0), vertex(false, 0))
	offsets.forEach((v, index) => context.lineTo(vertex(true, index), vertex(false, index)))
	context.closePath()
	context.strokeStyle = "grey"
	context.stroke()
})

export const break_asteroids = (asteroids_list, ship, destroy_asteroid) => asteroids_list.forEach((asteroid, index) => {
	ship.lasers.forEach((laser, i) => {
		if (distance(asteroid.x, asteroid.y, laser.x, laser.y) < asteroid.r) {
			destroy_asteroid(asteroid, index)
			ship.lasers.splice(i, 1)
		}
	})
})