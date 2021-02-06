
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
Instruction :: Label | Jump | Print | FieldDeclaration | Function
Value :: UInt | SInt | Binary | String | Field | Register
Destination :: Register | Field
`

MotherTode `
Function :: Copy | Add
Copy :: "Copy" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = " + v
Add :: "Add" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " + " + rhs
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
Field :: AbsoluteField | RelativeField >> () => { throw new Error("Accessing fields is unimplemented because I don't understand it yet") }
AbsoluteField :: Register "$" Name
RelativeField :: "$" Name
Register :: NumberedRegister | NamedRegister
NumberedRegister :: "R" IntLiteral >> ([_, n]) => "loadedNumberedRegisters[" + n + "]"
NamedRegister :: "R_SelfRaw" | "R_SelfType" | "R_SelfHeader" | "R_SelfChecksum" | "R_SelfData" | "R_UniformRandom" >> () => { throw new Error("Other registers are not implemented yet") }
Name :: /[a-z_]/+
`

MotherTode `
FieldDeclaration (
	:: ".Field" [_] Name [_] [Value] 
	>> () => { throw new Error("Declaring fields is unimplemented because I don't understand it yet") }
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
	const numberedRegisters = [0].repeated(16)
	
	return {numberedRegisters, instructions, fields, funcs, labelPositions, instructionPosition: 0}
}



//==========//
// Run-Time //
//==========//
let loadedInstructions = []
let loadedLabelPositions = {}
let loadedFields = {}
let loadedInstructionPosition = 0
let loadedNumberedRegisters = [0].repeated(16)

const run = (program, count = INSTRUCTIONS_PER_TICK) => {
	const {instructions, numberedRegisters, labelPositions, funcs, instructionPosition, fields} = program
	loadedInstructions = instructions
	loadedLabelPositions = labelPositions
	loadedInstructionPosition = instructionPosition
	loadedFields = fields
	loadedNumberedRegisters = numberedRegisters
	for (let i = 0; i < count; i++) {
		const func = funcs[loadedInstructionPosition]
		func()
		loadedInstructionPosition++
		if (loadedInstructionPosition >= funcs.length) {
			loadedInstructionPosition = 0
			//loadedNumberedRegisters = [0].repeated(16) //Reset numbered registers?
		}
	}
	
	program.instructionPosition = loadedInstructionPosition
	program.fields = loadedFields
	program.numberedRegisters = loadedNumberedRegisters
	
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
	//TERM.Field("$active_count").d
	//TERM.Field("R_SelfData$active_count").d
	//TERM.FieldDeclaration(".Field active_count").d
	//TERM.FieldDeclaration(".Field is_active 1").d
	
	TERM.Site("#2").d

	const hello = transpile(`
		loop:
			Print "Hello world!"
			Jmp loop
	`)
	print(hello.instructions)
	run(hello)
	
	const reg = transpile(`
		Copy R0 1
		loop:
			Add R0 R0 R0
			Print R0
			Jmp loop
	`)
	print(reg.instructions)
	run(reg)


}

test()
