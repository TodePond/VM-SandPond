
//========//
// Engine //
//========//
const TICK_INTERVAL = 200
const INSTRUCTIONS_PER_TICK = 10

const canvas = HTML `<canvas></canvas>`
document.body.appendChild(canvas)
document.body.style["margin"] = 0
canvas.width = innerWidth
canvas.height = innerHeight
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

//===========//
// Transpile //
//===========//
MotherTode `
Label :: LabelName ":"
LabelName :: /[a-z]/+

Jump :: "Jmp" [_] LabelName >> ([j, _, l]) => "instructionPosition = getLabelPosition('" + l + "')"

UInt :: IntLiteral | UIntLiteral
IntLiteral :: /[1-9]/ (/[0-9]/+)?
UIntLiteral :: IntLiteral "u"
`

const test = () => {
	TERM.IntLiteral("5").d
	TERM.UIntLiteral("5u").d
	TERM.Label("loop:").d
	TERM.Jump("Jmp loop").d
}

test()

//==========//
// Run-Time //
//==========//
let instructionPosition = 0
