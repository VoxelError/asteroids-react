import { to_array } from "./math"

export const high_score = () => localStorage.getItem("highscore") ?? 0
export const set_high_score = (value) => localStorage.setItem("highscore", value)

export const draw_high_score = (context, high_score, width) => {
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.fillStyle = "white"
	context.font = "20px Emulogic"
	context.fillText("HIGH SCORE", width / 2, 30)
	context.fillText(high_score, width / 2, 60)
}

export const draw_score = (context, score, width) => {
	context.textAlign = "right"
	context.textBaseline = "middle"
	context.fillStyle = "white"
	context.font = "20px Emulogic"
	context.fillText(score, width - 15, 30)
}

export const draw_text = (context, alpha, content, width, height) => {
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.fillStyle = `rgba(255, 255, 255, ${alpha})`
	context.font = `small-caps 40px Emulogic`

	alpha > 0 && context.fillText(content, width / 2, height * 0.75)
}