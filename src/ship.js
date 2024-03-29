import { pi, to_radians } from "./math"

export const default_ship = (width, height) => {
	return {
		x: width / 2,
		y: height / 2,
		r: 15,
		a: to_radians(90),
		blink_num: 15,
		blink_time: 6,
		can_shoot: true,
		is_dead: false,
		has_crashed: false,
		explode_time: 0,
		lasers: [],
		rot: 0,
		is_thrusting: false,
		thrust: {
			x: 0,
			y: 0
		}
	}
}

export const draw_lasers = (context, ship) => ship.lasers.forEach((laser) => {
	if (laser.explode_time != 0) return
	context.beginPath()
	context.arc(laser.x, laser.y, 1.8, 0, 2 * pi)
	context.fillStyle = "white"
	context.fill()
})