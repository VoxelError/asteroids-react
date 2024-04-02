import { draw_asteroids, hit_asteroid, move_asteroids, new_asteroid } from "./asteroids.js"
import { draw_score, draw_high_score, high_score, set_high_score, draw_text } from "./hud.js"
import { rng, to_radians, distance, to_array, } from "./math.js"
import { init_ship, draw_hull, draw_lasers, draw_ship, key_down, key_up, move_lasers, move_ship, crash_ship } from "./ship.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const asteroids_list = []

let ship
let game_text = ["", 0]
let game_score
let game_level
let game_lives

document.addEventListener("keydown", (event) => key_down(event, ship))
document.addEventListener("keyup", (event) => key_up(event, ship))

const new_life = () => {
	game_lives--
	ship = init_ship(canvas)

	if (game_lives > 0) return

	ship.is_dead = true
	game_text = ["Game Over", 1]
}

const new_level = () => {
	asteroids_list.length = 0
	game_level++
	game_text = [`Level ${game_level}`, 1]
	to_array(2 + game_level).forEach(() => {
		let x, y
		do {
			x = rng(canvas.width)
			y = rng(canvas.height)
		} while (distance(x, y, ship.x, ship.y) < ship.r + 200)
		new_asteroid(x, y, 50, game_level, asteroids_list)
	})
}

const new_game = () => {
	game_level = 0
	game_score = 0
	game_lives = 3
	ship = init_ship(canvas)
	new_level()
}

setInterval(() => {
	game_lives ?? new_game()
	ship.is_dead && game_text[1] <= 0 && new_game()
	!asteroids_list.length && new_level()

	context.clearRect(0, 0, canvas.width, canvas.height)

	game_score > high_score() && set_high_score(game_score)
	draw_high_score(context, high_score(), canvas.width)
	draw_score(context, game_score, canvas.width)
	draw_text(context, game_text, canvas.width, canvas.height)
	to_array(game_lives).forEach((v, i) => draw_hull(context, (i * 36) + 30, 30, ship.r, to_radians(90)))
	game_text[1] > 0 && (game_text[1] -= 0.01)

	move_ship(canvas, ship)
	ship.has_crashed ? crash_ship(ship, context, new_life) : draw_ship(ship, context)

	move_lasers(canvas, ship)
	draw_lasers(context, ship)

	move_asteroids(asteroids_list, canvas)
	draw_asteroids(context, asteroids_list)
	hit_asteroid(asteroids_list, ship, game_score, game_level)
}, 16)