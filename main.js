
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
	throw new Error("Unimplemented")
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

const currentLabelPositions = {}
let currentPosition = 0

MotherTode `
Line :: [_] Instruction [_] EOF >> ([_, i]) => i.output
Instruction :: Label | Jump

Label (
	:: LabelName ":"
	>> (label) => { currentLabelPositions[label[0]] = currentPosition; return "// " + label[0]; }
)
LabelName :: /[a-z]/+

Jump :: "Jmp" [_] LabelName >> ([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"

UInt :: IntLiteral | UIntLiteral
IntLiteral :: /[1-9]/ (/[0-9]/+)?
UIntLiteral :: IntLiteral "u"
`

// Returns a 'program' object
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
	
	const labelPositions = {...currentLabelPositions}
	const funcs = instructions.map(instruction => new Function(instruction))
	
	return {instructions, funcs, labelPositions, instructionPosition: 0}
}



//==========//
// Run-Time //
//==========//
let loadedInstructions = []
let loadedLabelPositions = {}
let loadedInstructionPosition = 0

const run = (program, count = INSTRUCTIONS_PER_TICK) => {
	const {instructions, labelPositions, funcs, instructionPosition} = program
	loadedInstructions = instructions
	loadedLabelPositions = labelPositions
	loadedInstructionPosition = instructionPosition
	for (let i = 0; i < count; i++) {
		const func = funcs[loadedInstructionPosition].d
		loadedInstructionPosition++
		if (loadedInstructionPosition >= funcs.length) loadedInstructionPosition = 0
	}
	
	program.instructionPosition = loadedInstructionPosition
}


//========//
// Tinker //
//========//
const test = () => {
	TERM.IntLiteral("5").d
	TERM.UIntLiteral("5u").d
	TERM.Label("loop:").d
	TERM.Jump("Jmp loop").d

	const program = transpile(`
		loop:
		Jmp loop
	`).d
	
	run(p)


}

test()
