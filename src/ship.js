import { pi, cos, sin, to_radians, distance } from "./math"
import { fxExplode, fxLaser, fxThrust } from "./sounds"

export const init_ship = (canvas) => ({
	x: canvas.width / 2,
	y: canvas.height / 2,
	r: 15,
	a: to_radians(90),
	blink_num: 15,
	blink_time: 6,
	can_shoot: true,
	is_dead: false,
	has_crashed: false,
	crash_timer: 0,
	lasers: [],
	rot: 0,
	is_thrusting: false,
	thrust_timer: 0,
	thrust: {
		x: 0,
		y: 0
	}
})

export const key_down = (event, ship) => {
	if (ship.is_dead) return
	event.code == "ArrowUp" && (ship.is_thrusting = true)
	event.code == "ArrowRight" && (ship.rot = -to_radians(3))
	event.code == "ArrowLeft" && (ship.rot = to_radians(3))
	if (ship.has_crashed) return
	event.code == "Space" && shoot_laser(ship)

	event.code == "Delete" && console.log(ship.thrust)
}

export const key_up = (event, ship) => {
	if (ship.is_dead) return
	event.code == "ArrowUp" && (ship.is_thrusting = false)
	event.code == "ArrowRight" && (ship.rot = 0)
	event.code == "ArrowLeft" && (ship.rot = 0)
	event.code == "Space" && (ship.can_shoot = true)
}

export const move_ship = (canvas, ship) => {
	if (ship.is_dead) return

	if (ship.is_thrusting) {
		const { a } = ship

		ship.thrust.x += (cos(a) * 0.083)
		ship.thrust.y -= (sin(a) * 0.083)
		fxThrust.play()

		ship.thrust_timer++
		ship.thrust_timer > 4 && (ship.thrust_timer = 0)
	} else {
		ship.thrust_timer = 0
		Math.abs(ship.thrust.y) > 0.05 ? (ship.thrust.y *= 0.994) : ship.thrust.y = 0
		Math.abs(ship.thrust.x) > 0.05 ? (ship.thrust.x *= 0.994) : ship.thrust.x = 0
		fxThrust.stop()
	}

	ship.x < 0 - ship.r && (ship.x = canvas.width + ship.r)
	ship.x > canvas.width + ship.r && (ship.x = 0 - ship.r)
	ship.y < 0 - ship.r && (ship.y = canvas.height + ship.r)
	ship.y > canvas.height + ship.r && (ship.y = 0 - ship.r)
}

export const draw_hull = (context, x, y, r, a) => {
	context.beginPath()
	context.moveTo(
		x + (4 / 3) * r * cos(a),
		y - (4 / 3) * r * sin(a)
	)
	context.lineTo(
		x - ((cos(a) * 2 / 3) + sin(a)) * r,
		y + ((sin(a) * 2 / 3) - cos(a)) * r
	)
	context.lineTo(
		x - ((cos(a) * 2 / 3) - sin(a)) * r,
		y + ((sin(a) * 2 / 3) + cos(a)) * r
	)
	context.closePath()
	context.strokeStyle = "white"
	context.stroke()
}

export const crash_ship = (ship, context, new_life) => {
	context.beginPath()
	context.arc(ship.x, ship.y, ship.r * 1.5, 0, pi * 2, false)
	context.fillStyle = "white"
	context.fill()

	ship.crash_timer--
	if (ship.crash_timer > 0) return
	ship.has_crashed = false
	new_life()
}

export const draw_ship = (ship, context, asteroids_list, destroy_asteroid) => {
	ship.a += ship.rot
	ship.x += ship.thrust.x / 2
	ship.y += ship.thrust.y / 2

	ship.blink_num % 2 == 0 && !ship.is_dead && draw_hull(context, ship.x, ship.y, ship.r, ship.a)
	ship.blink_num > 0 && ship.blink_time--
	if (ship.blink_time == 0) {
		ship.blink_time = 6
		ship.blink_num--
	}

	if (!ship.is_dead && ship.blink_num == 0) {
		asteroids_list.forEach((asteroid, index) => {
			if (distance(ship.x, ship.y, asteroid.x, asteroid.y) < ship.r + asteroid.r) {
				destroy_asteroid(asteroid, index)
				ship.has_crashed = true
				ship.crash_timer = 20
				ship.can_shoot = false
				fxExplode.play()
			}
		})
	}

	if (ship.has_crashed) return
	if (ship.blink_num % 2 != 0) return
	if (ship.thrust_timer <= 2) return

	const { x, y, r, a } = ship
	
	context.beginPath()
	context.moveTo(
		x - r * (2 / 3 * cos(a) + 0.5 * sin(a)),
		y + r * (2 / 3 * sin(a) - 0.5 * cos(a))
	)
	context.lineTo(
		x - r * 5 / 3 * cos(a),
		y + r * 5 / 3 * sin(a)
	)
	context.lineTo(
		x - r * (2 / 3 * cos(a) - 0.5 * sin(a)),
		y + r * (2 / 3 * sin(a) + 0.5 * cos(a))
	)
	context.closePath()
	context.strokeStyle = "white"
	context.stroke()
}

export const move_lasers = (canvas, ship) => ship.lasers.forEach((laser, index) => {
	laser.x += laser.xv
	laser.y += laser.yv
	laser.dist += Math.hypot(laser.xv, laser.yv)
	laser.dist > (canvas.width * 0.6) && ship.lasers.splice(index, 1)

	laser.x < 0 && (laser.x = canvas.width)
	laser.x > canvas.width && (laser.x = 0)
	laser.y < 0 && (laser.y = canvas.height)
	laser.y > canvas.height && (laser.y = 0)
})

export const draw_lasers = (context, ship) => ship.lasers.forEach((laser) => {
	context.beginPath()
	context.arc(laser.x, laser.y, 1.8, 0, 2 * pi)
	context.fillStyle = "white"
	context.fill()
})

export const shoot_laser = (ship) => {
	const { x, y, r, a } = ship
	const laser_speed = 8

	if (ship.can_shoot && ship.lasers.length < 10) {
		ship.lasers.push({
			x: x + (4 / 3) * r * cos(a),
			y: y - (4 / 3) * r * sin(a),
			xv: laser_speed * cos(a),
			yv: -laser_speed * sin(a),
			dist: 0
		})
		fxLaser.play()
	}
	ship.can_shoot = false
}