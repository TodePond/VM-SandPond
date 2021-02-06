
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


MotherTode `
Line :: [_] Instruction [_] EOF >> ([_, i]) => i.output
Instruction :: Label | Jump | Print | FieldDeclaration
Value :: UInt | SInt | Binary | String | Field
`

MotherTode `
Label (
	:: Name ":"
	>> (label) => { currentLabelPositions[label[0]] = currentPosition; return "// " + label[0]; }
)
Jump :: "Jmp" [_] Name >> ([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"
Print :: "Print" [_] Value >> ([p, _, msg]) => "console.log(" + msg + ")"
`

MotherTode `
UInt :: IntLiteral | UIntLiteral
IntLiteral :: /[0-9]/+
UIntLiteral :: IntLiteral "u" >> ([n]) => n.output
SInt :: SIntLiteral
SIntLiteral :: "-"? IntLiteral "i" >> ([s, n]) => s + n
Binary :: BinaryLiteral
BinaryLiteral :: "0b" ("0" | "1")+
String :: StringLiteral
StringLiteral :: '"' (/[^"]/+)? '"'
`
MotherTode`
Symmetry :: "NONE" | "ALL" | "FLIPX"
Site :: "#" IntLiteral
Field :: AbsoluteField | RelativeField
AbsoluteField :: Register "$" Name
RelativeField :: "$" Name >> ([_, name]) => currentFields[name]
Register :: "R_SelfRaw" | "R_SelfType" | "R_SelfHeader" | "R_SelfChecksum" | "R_SelfData" | "R_UniformRandom" | ("R" IntLiteral)
Name :: /[a-z_]/+
`

MotherTode `
FieldDeclaration (
	:: ".Field" [_] Name [_] [Value] 
	>> (decl) => { currentFields[decl[2]] = decl[4].output; return ""; }
)
`

let currentLabelPositions = {}
let currentFields = {}
let currentPosition = 0

// Returns a 'program' object
const transpile = (source) => {

	currentPosition = 0
	currentLabelPositions = {}
	currentFields = {}
	
	const strippedSource = stripComments(source)
	const lines = strippedSource.split("\n")
	const instructions = []
	for (let i = 0; i < lines.length; i++) {
		currentPosition = i
		const line = lines[i]
		const result = TERM.Line(line)
		if (!result.success) throw new Error(`Failed to transpile line ${i}:\n\n${line}\n`)
		const instruction = result.output
		if (instruction !== "") instructions.push(instruction)
	}
	
	const labelPositions = {...currentLabelPositions}
	const fields = {...currentFields}
	const funcs = instructions.map(instruction => new Function(instruction))
	
	return {instructions, fields, funcs, labelPositions, instructionPosition: 0}
}



//==========//
// Run-Time //
//==========//
let loadedInstructions = []
let loadedLabelPositions = {}
let loadedFields = {}
let loadedInstructionPosition = 0

const run = (program, count = INSTRUCTIONS_PER_TICK) => {
	const {instructions, labelPositions, funcs, instructionPosition, fields} = program
	loadedInstructions = instructions
	loadedLabelPositions = labelPositions
	loadedInstructionPosition = instructionPosition
	loadedFields = fields
	for (let i = 0; i < count; i++) {
		const func = funcs[loadedInstructionPosition]
		func()
		loadedInstructionPosition++
		if (loadedInstructionPosition >= funcs.length) loadedInstructionPosition = 0
	}
	
	program.instructionPosition = loadedInstructionPosition
	program.fields = loadedFields
	
}

//========//
// Tinker //
//========//
const test = () => {
	TERM.UInt("5").d
	TERM.UInt("5u").d
	TERM.SInt("-1i").d
	TERM.Binary("0b0111").d
	TERM.Label("loop:").d
	TERM.Jump("Jmp loop").d
	TERM.Symmetry("NONE").d
	TERM.Symmetry("ALL").d
	TERM.Site("#0").d
	TERM.Site("#1").d
	TERM.Field("$active_count").d
	TERM.Field("R_SelfData$active_count").d
	TERM.FieldDeclaration(".Field active_count").d
	TERM.FieldDeclaration(".Field is_active 1").d

	const hello = transpile(`
		loop:
			Print "Hello world!"
			Jmp loop
	`)
	print(hello.instructions)
	run(hello)
	
	const fielder = transpile(`
		.Field meaning_of_life 42
		Print $meaning_of_life
	`)
	print(fielder.instructions)
	run(fielder)


}

test()
