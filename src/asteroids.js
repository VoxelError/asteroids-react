import { pi, sin, cos, distance, random, rng, to_array } from "./math"
import { fxExplode, fxHit } from "./sounds"

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

export const break_asteroid = (index, asteroids_list, game_score, game_level) => {
	const { x, y, r } = asteroids_list[index]

	if (r == 50) {
		game_score += 20
		new_asteroid(x, y, 25, game_level, asteroids_list)
		new_asteroid(x, y, 25, game_level, asteroids_list)
	} else if (r == 25) {
		game_score += 50
		new_asteroid(x, y, 12.5, game_level, asteroids_list)
		new_asteroid(x, y, 12.5, game_level, asteroids_list)
	} else game_score += 100

	asteroids_list.splice(index, 1)
	fxHit.play()
}

export const hit_asteroid = (asteroids_list, ship, game_score, game_level) => {
	asteroids_list.forEach((asteroid, index) => {
		ship.lasers.forEach((laser, i) => {
			if (distance(laser.x, laser.y, asteroid.x, asteroid.y) < asteroid.r) {
				ship.lasers.splice(i, 1)
				break_asteroid(index, asteroids_list, game_score, game_level)
			}
		})

		if (!ship.is_dead && ship.blink_num == 0) {
			if (distance(ship.x, ship.y, asteroid.x, asteroid.y) < asteroid.r + ship.r) {
				ship.has_crashed = true
				ship.crash_timer = 20
				ship.can_shoot = false
				break_asteroid(index, asteroids_list, game_score, game_level)
				fxExplode.play()
			}
		}
	})
}