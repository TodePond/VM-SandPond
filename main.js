
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
const stripComments = (source) => source.split("\n").map(line => line.split("//")[0]).filter(line => !line.is(WhiteSpace)).join("\n")

const labelPositions = {}
let currentPosition = 0

MotherTode `
Line :: [_] Instruction [_] EOF >> ([_, i]) => i.output
Instruction :: Label | Jump

Label (
	:: LabelName ":"
	>> (label) => { labelPositions[label[0]] = currentPosition; return "// " + label[0]; }
)
LabelName :: /[a-z]/+

Jump :: "Jmp" [_] LabelName >> ([j, _, l]) => "instructionPosition = getLabelPosition('" + l + "')"

UInt :: IntLiteral | UIntLiteral
IntLiteral :: /[1-9]/ (/[0-9]/+)?
UIntLiteral :: IntLiteral "u"
`



const transpile = (source) => {
	const strippedSource = stripComments(source)
	const lines = strippedSource.split("\n")
	const instructions = []
	for (let i = 0; i < lines.length; i++) {
		currentPosition = i
		const line = lines[i]
		const result = TERM.Line(line)
		const instruction = result.output
		instructions.push(instruction)
	}
	
	return instructions
}



//==========//
// Run-Time //
//==========//
const instructions = []
const getLabelPosition = (name) => {
	if (name === "exit") return instructions.length
	return labelPositions[name]
}

let instructionPosition = 0

//========//
// Tinker //
//========//
const test = () => {
	TERM.IntLiteral("5").d
	TERM.UIntLiteral("5u").d
	TERM.Label("loop:").d
	TERM.Jump("Jmp loop").d

	transpile(`
		loop:
		Jmp loop
	`).d


}

test()
