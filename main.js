
const SPACE_SIZE = 10
const TICK_INTERVAL = 200
const INSTRUCTIONS_PER_TICK = 10

const canvas = HTML `<canvas></canvas>`
document.body.appendChild(canvas)
document.body.style["margin"] = 0
canvas.width = innerWidth
canvas.width = innerHeight
const ctx = canvas.getContext("2d")


const draw = () => {
	throw new Error("Unimplemented")
}

const update = () => {
	for (let i = 0; i < INSTRUCTIONS_PER_TICK; i++) {
		throw new Error("Unimplemented")
	}
}

const tick = () => {
	update()
	draw()
	setTimeout(tick, TICK_INTERVAL)
}

//tick()


