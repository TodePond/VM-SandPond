
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

let cachedMotherTode = "if (!REBUILD) {\n"
if (REBUILD) {

	cachedMotherTode += "\n" + MotherTode `
	Line :: [_] Instruction [_] EOF >> ([_, i]) => i.output
	Instruction :: Label | JumpFunction | Print | HeaderDeclaration | Function
	Value :: UInt | SInt | Binary | String | Field | Register | Element
	Destination :: Register | Field
	`

	cachedMotherTode += "\n" + MotherTode `
	Function :: Copy | Swap | Equal | Negate | Not | Or | And | Add | Sub | Mul | Compare | Nop | Exit
	Copy :: "Copy" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = " + v
	Add :: "Add" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " + " + rhs
	Sub :: "Sub" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " - " + rhs
	Mul :: "Mul" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " * " + rhs
	Equal :: "Equal" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = parseInt(" + lhs + " == " + rhs + ")"
	Or :: "Or" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " || " + rhs
	And :: "And" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " && " + rhs
	Negate :: "Negate" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = -" + v
	Not :: "Not" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = parseInt(!" + v + ")"
	Nop :: "Nop" >> () => ""
	Exit :: "Exit" >> () => "loadedInstructionPosition = loadedInstructions.length"
	Swap (
		:: "Swap" [_] Destination [_] Destination
		>> ([s, g1, lhs, g2, rhs]) => \`{ const temp = \${lhs}; \${lhs} = \${rhs}; \${rhs} = temp; }\`
	)
	Compare (
		:: "Compare" [_] Destination [_] Destination
		>> ([s, g1, lhs, g2, rhs]) => \`{ const l = \${lhs}; const r = \${rhs}; if (l < r) return -1; if (l > r) return 1; return 0; }\`
	)
	`

	// TODO: Bitwise funcs and SPLAT funcs

	cachedMotherTode += "\n" + MotherTode `
	JumpFunction :: Jump | Jmp | JumpRelativeOffset | JumpZero | JumpNonZero | JumpLessThanZero | JumpGreaterThanZero
	Label (
		:: Name ":"
		>> (label) => { currentLabelPositions[label[0]] = currentPosition; return "// " + label[0]; }
	)
	JumpZero :: "JumpZero" [_] Name [_] Value >> ([j, g1, label, g2, value]) => \`if (\${value} === 0) loadedInstructionPosition = loadedLabelPositions['\${label}']\`
	JumpNonZero :: "JumpNonZero" [_] Name [_] Value >> ([j, g1, label, g2, value]) => \`if (\${value} !== 0) loadedInstructionPosition = loadedLabelPositions['\${label}']\`
	JumpLessThanZero :: "JumpLessThanZero" [_] Name [_] Value >> ([j, g1, label, g2, value]) => \`if (\${value} < 0) loadedInstructionPosition = loadedLabelPositions['\${label}']\`
	JumpGreaterThanZero :: "JumpGreaterThanZero" [_] Name [_] Value >> ([j, g1, label, g2, value]) => \`if (\${value} > 0) loadedInstructionPosition = loadedLabelPositions['\${label}']\`
	JumpRelativeOffset :: "JumpRelativeOffset" [_] Name >> ([j, _, l]) => "loadedInstructionPosition += " + l
	Jump :: "Jump" [_] Name >> ([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"
	Jmp :: "Jmp" [_] Name >> ([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"
	Print :: "Print" [_] Value >> ([p, _, msg]) => "console.log(" + msg + ")"
	`

	cachedMotherTode += "\n" + MotherTode `
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
	cachedMotherTode += "\n" + MotherTode`
	Symmetry :: "NONE" | "ALL" | "FLIPX" | "NORMAL"
	Symmetries :: TwoSymmetries | Symmetry
	TwoSymmetries :: Symmetry "," [_] Symmetries
	Site :: "#" IntLiteral
	Field :: AbsoluteField | RelativeField >> () => { throw new Error("Accessing fields is unimplemented because I don't understand it yet") }
	AbsoluteField :: Register "$" Name
	RelativeField :: "$" Name
	Register :: NumberedRegister | NamedRegister
	NumberedRegister :: "R" IntLiteral >> ([_, n]) => "loadedNumberedRegisters[" + n + "]"
	NamedRegister :: "R_SelfRaw" | "R_SelfType" | "R_SelfHeader" | "R_SelfChecksum" | "R_SelfData" | "R_UniformRandom" >> () => { throw new Error("Other registers are not implemented yet") }
	Name :: /[A-Za-z_]/+
	Element :: "%" Name >> ([_, n]) => "loadedElementPositions['" + n + "']"
	`

	cachedMotherTode += "\n" + MotherTode `
	HeaderDeclaration :: FieldDeclaration | MetadataDeclaration
	MetadataDeclaration :: "." Name [_] (Value | Text) >> ([_, name, g, value]) => { currentMetadata[name] = value; return ""; }
	Text :: /[^\\n]/+
	FieldDeclaration (
		:: ".Field" [_] Name [_] [Value] 
		>> () => { throw new Error("Declaring fields is unimplemented because I don't understand it yet") }
	)
	`
	cachedMotherTode += "\n}"
	//cachedMotherTode = cachedMotherTode.replaceAll("`", "\\`")
}


let currentLabelPositions = {}
let currentFields = {}
let currentPosition = 0
let currentMetadata = {}

// Returns a 'program' object
const transpile = (source) => {

	currentPosition = 0
	currentLabelPositions = {}
	currentFields = {}
	currentMetadata = {}
	
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
	const metadata = {...currentMetadata}
	const funcs = instructions.map(instruction => new Function(instruction))
	const numberedRegisters = [0].repeated(16)
	
	return {metadata, numberedRegisters, instructions, fields, funcs, labelPositions, instructionPosition: 0}
}

//==========//
// Run-Time //
//==========//
let loadedInstructions = []
let loadedLabelPositions = {}
let loadedFields = {}
let loadedInstructionPosition = 0
let loadedNumberedRegisters = [0].repeated(16)
let loadedElementPositions = {Empty: 0}
let loadedElements = ["Empty"]

const loadElement = (program) => {
	
}

const run = (program, count = INSTRUCTIONS_PER_TICK) => {
	const {metadata, instructions, numberedRegisters, labelPositions, funcs, instructionPosition, fields} = program
	loadedInstructions = instructions
	loadedLabelPositions = labelPositions
	loadedInstructionPosition = instructionPosition
	loadedFields = fields
	loadedNumberedRegisters = numberedRegisters
	if (funcs.length > 0) for (let i = 0; i < count; i++) {
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
const tinker = () => {
	TERM.UInt("5").d
	TERM.UInt("5u").d
	TERM.SInt("-1i").d
	TERM.Binary("0b0111").d
	TERM.Label("loop:").d
	TERM.Jmp("Jmp loop").d
	TERM.Symmetry("NONE").d
	TERM.Symmetry("ALL").d
	TERM.Site("#0").d
	TERM.Site("#1").d
	//TERM.Field("$active_count").d
	//TERM.Field("R_SelfData$active_count").d
	//TERM.FieldDeclaration(".Field active_count").d
	//TERM.FieldDeclaration(".Field is_active 1").d
	TERM.Element("%Empty").d
	TERM.Symmetries("NORMAL, FLIPX").d

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
			Nop
			Jmp loop
	`)
	print(reg.instructions)
	run(reg)
	
	const sandy = transpile(`
		.Name Sand
		.Desc Falls down and piles up.
		.Author Luke Wilson
		.License MIT
		.Radius 4
		.BgColor #fc0
		.FgColor #fc0
		.Symmetries NORMAL, FLIPX
	`)
	print(sandy.instructions)
	run(sandy)
	
	const swapper = transpile(`
		Copy R0 2
		Copy R1 3
		loop:
			Swap R0 R1
			Print "Swapped"
			Print R0
			Print R1
			Jmp loop
	`)
	print(swapper.instructions)
	run(swapper, 20)
	
	
	
}

tinker()
