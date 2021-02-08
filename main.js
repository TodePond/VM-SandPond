//========//
// Engine //
//========//
const WORLD_SIZE = 100
const SPACE_COUNT = WORLD_SIZE * WORLD_SIZE
const SPACE_SIZE = 8

const PROGRAMS_PER_TICK = SPACE_COUNT // TODO: we should limit instructions, NOT programs

const spaces = new Uint8Array(SPACE_COUNT)

const $Space = (x, y) => {
	if (x >= WORLD_SIZE) {
		return loadedElementPositions["Void"]
	}
	if (y >= WORLD_SIZE) return loadedElementPositions["Void"]
	if (y < 0) return loadedElementPositions["Void"]
	if (x < 0) return loadedElementPositions["Void"]
	const element = spaces[getSpaceId(x, y)]
	return element
}
const getSpaceId = (x, y) => y * WORLD_SIZE + x
const getSpacePosition = (id) => [id % WORLD_SIZE, Math.floor(id / WORLD_SIZE)]

const canvas = HTML `<canvas></canvas>`
document.body.appendChild(canvas)
document.body.style["margin"] = 0
document.body.style["background-color"] = "rgb(13, 16, 23)"
canvas.width = WORLD_SIZE * SPACE_SIZE
canvas.height = WORLD_SIZE * SPACE_SIZE
const ctx = canvas.getContext("2d")

const menu = HTML `<div id="menu"></div>`
document.body.appendChild(menu)
const codeDisplay = HTML `<pre id="code"></pre>`
codeDisplay.style["color"] = "white"
codeDisplay.style["font-family"] = "UbuntuMono"
codeDisplay.style["font-size"] = "larger"
codeDisplay.style["position"] = "absolute"
codeDisplay.style["top"] = "20px"
codeDisplay.style["user-select"] = "none"
codeDisplay.style["pointer-events"] = "none"
document.body.appendChild(codeDisplay)

let dropperElement = undefined

/*canvas.on.mousedown(e => {
	const {x, y} = e
	const space = getSpaceId(x, y)
	changeSpacePosition(x, y, dropperElement)
})*/

let dropperX = undefined
let dropperY = undefined

canvas.on.mousemove(e => {
	;[dropperX, dropperY] = [e.offsetX, e.offsetY]
})

canvas.on.touchstart(e => {
	const touch = e.changedTouches[0]
	;[dropperX, dropperY] = [touch.clientX + scrollX, touch.clientY + scrollY]
	e.preventDefault()
})

canvas.on.touchmove(e => {
	const touch = e.changedTouches[0]
	;[dropperX, dropperY] = [touch.clientX + scrollX, touch.clientY + scrollY]
	e.preventDefault()
})

const changeSpacePosition = (x, y, element) => {
	const space = getSpaceId(x, y)
	const oldElement = $Space(x, y)
	if (oldElement === element) return
	if (oldElement === loadedElementPositions["Void"]) return
	spaces[space] = element
	const colour = loadedElementMetadata[element].FgColor
	ctx.fillStyle = colour
	ctx.fillRect(x * SPACE_SIZE, y * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE)
}

const draw = () => {
	let x = 0
	let y = 0
	for (let i = 0; i < SPACE_COUNT; i++) {
		const element = spaces[i]
		const [cx, cy] = [x * SPACE_SIZE, y * SPACE_SIZE]
		
		const colour = loadedElementMetadata[element].FgColor
		ctx.fillStyle = colour
		ctx.fillRect(cx, cy, SPACE_SIZE, SPACE_SIZE)
		
		x++
		if (x >= WORLD_SIZE) {
			x = 0
			y++
		}
	}
}


const randoRatio = (1 / 2**32) * SPACE_COUNT
const RANDOM_COUNT = 16384
const randos = new Uint32Array(RANDOM_COUNT)
let g_r = RANDOM_COUNT

const symmRandos = new Uint32Array(RANDOM_COUNT)
let g_sr = RANDOM_COUNT

const update = () => {
	
	let i = 0
	while (i < PROGRAMS_PER_TICK) {
	
		i++ //placeholder - currently limiting program runs per tick, but it SHOULD limit instructions per tick
		
		// Get random space ID
		if (g_r >= RANDOM_COUNT) {
			crypto.getRandomValues(randos)
			g_r = 0
		}
		const id = Math.floor(randos[g_r] * randoRatio)
		g_r++
		
		// Get origin element
		const element = spaces[id]
		const program = loadedElementPrograms[element]
		
		// Get symmetry
		if (g_sr >= RANDOM_COUNT) {
			crypto.getRandomValues(symmRandos)
			g_sr = 0
		}
		const symmetries = program.symmetries
		const s = symmRandos[g_sr] % symmetries.length
		g_sr++
		const symmId = symmetries[s]
		const symmMap = SYMMETRY_MAPS[symmId]
		
		// Get event window
		const ew = getEventWindow(id, symmMap)
		
		// Fire event
		loadedEventWindow = ew
		run(program, Infinity)
		
		setEventWindow(id, ew, symmMap)
		
	}
}

const SYMMETRY = {
	Normal: ( x, y) => [ x, y],
	Flip_X: ( x, y) => [-x, y],
	Flip_Y: ( x, y) => [ x,-y],
}

const EVENT_WINDOW = [
	[0, 0],
	[-1, 0],
	[0, -1],
	[0, 1],
	[1, 0],
	[-1, -1],
	[-1, 1],
	[1, -1],
	[1, 1],
	[-2, 0],
	[0, -2],
	[0, 2],
	[2, 0],
	[-2, -1],
	[-2, 1],
	[-1, -2],
	[-1, 2],
	[1, -2],
	[1, 2],
	[2, -1],
	[2, 1],
	[-3, 0],
	[0, -3],
	[0, 3],
	[3, 0],
	[-2, -2],
	[-2, 2],
	[2, -2],
	[2, 2],
	[-3, -1],
	[-3, 1],
	[-1, -3],
	[-1, 3],
	[1, -3],
	[1, 3],
	[3, -1],
	[3, 1],
	[-4, 0],
	[0, -4],
	[0, 4],
	[4, 0],
]

const SYMMETRY_MAPS = []
const SYMMETRY_IDS = {}

for (const name in SYMMETRY) {
	const func = SYMMETRY[name]
	const map = EVENT_WINDOW.map(([x, y]) => func(x, y))
	const id = SYMMETRY_MAPS.push(map) - 1
	SYMMETRY_IDS[name] = id
}

const getEventWindow = (space, map = EVENT_WINDOW) => {
	const ew = []
	const [x, y] = getSpacePosition(space)
	for (const [dx, dy] of map) {
		const [ex, ey] = [x+dx, y+dy]
		const element = $Space(ex, ey)
		ew.push({type: element})
	}
	return ew
}

const setEventWindow = (space, ew, map = EVENT_WINDOW) => {
	const [x, y] = getSpacePosition(space)
	for (const [dx, dy] of map) {
		const [ex, ey] = [x+dx, y+dy]
		const element = ew.shift(ew).type
		changeSpacePosition(ex, ey, element)
	}
}

const tick = () => {
	if ((canvas.matches("canvas:active") && Mouse.down) || Touches.length > 0) {
		if (Touches.length > 0) {
			const touch = Touches[0]
			if (touch.x > WORLD_SIZE * SPACE_SIZE || touch.y > WORLD_SIZE * SPACE_SIZE) {}
			else {
				const [sx, sy] = [Math.floor(dropperX / SPACE_SIZE), Math.floor(dropperY / SPACE_SIZE)]
				if (dropperElement !== undefined) changeSpacePosition(sx, sy, dropperElement)
			}
		}
		else {
			const [sx, sy] = [Math.floor(dropperX / SPACE_SIZE), Math.floor(dropperY / SPACE_SIZE)]
			if (dropperElement !== undefined) changeSpacePosition(sx, sy, dropperElement)
		}
	}
	update()
	requestAnimationFrame(tick)
}

const start = () => {
	draw()
	tick()
}

//===========//
// Transpile //
//===========//
const stripComments = (source) => source.split("\n").map(line => line.split("//")[0]).filter(line => !line.is(WhiteSpace)).join("\n")

let cachedMotherTode = "if (!REBUILD) {\n"
if (REBUILD) {

	cachedMotherTode += "\n" + MotherTode `
	Line :: [_] Instruction [_] EOF >> ([_, i]) => i.output
	Instruction :: Label | JumpFunction | Print | HeaderDeclaration | Function
	Value :: UInt | SInt | Binary | String | Register | Element | SiteField | Site
	Destination :: Register | SiteField | Site
	`

	cachedMotherTode += "\n" + MotherTode `
	Function :: Copy | Swap | Equal | Negate | Not | Or | And | Add | Sub | Mul | Compare | Nop | Exit
	Copy :: "Copy" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = " + v
	Add :: "Add" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " + " + rhs
	Sub :: "Sub" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " - " + rhs
	Mul :: "Mul" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " * " + rhs
	Equal :: "Equal" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = Number(" + lhs + " == " + rhs + ")"
	Or :: "Or" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " || " + rhs
	And :: "And" [_] Destination [_] Value [_] Value >> ([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " && " + rhs
	Negate :: "Negate" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = -" + v
	Not :: "Not" [_] Destination [_] Value >> ([c, g1, l, g2, v]) => l + " = Number(!" + v + ")"
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
	JumpFunction :: Jmp | JumpRelativeOffset | JumpZero | JumpNonZero | JumpLessThanZero | JumpGreaterThanZero | Jump
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
	Symmetry :: "None" | "All" | "Flip_X" | "Normal" | "Flip_Y"
	Symmetries :: TwoSymmetries | Symmetry >> (ss) => ss.output.split(",").map(s => s.trim())
	TwoSymmetries :: Symmetry "," [_] Symmetries
	SiteField :: Site [_] RelativeField >> ([s, _, f]) => s + "." + f
	Site :: "#" IntLiteral >> ([_, n]) => "loadedEventWindow[" + n + "]"
	RelativeField :: "$" Name >> ([_, n]) => n.output
	Register :: NumberedRegister | NamedRegister
	NumberedRegister :: "R_" IntLiteral >> ([_, n]) => "loadedNumberedRegisters[" + n + "]"
	NamedRegister :: "R_SelfRaw" | "R_SelfType" | "R_SelfHeader" | "R_SelfChecksum" | "R_SelfData" | "R_UniformRandom" >> () => { throw new Error("Other registers are not implemented yet") }
	Name :: /[A-Za-z_]/+
	Element :: "%" Name >> ([_, n]) => "loadedElementPositions['" + n + "']"
	`

	cachedMotherTode += "\n" + MotherTode `
	HeaderDeclaration :: FieldDeclaration | MetadataDeclaration
	MetadataDeclaration :: "." Name [_] (Symmetries | Text) >> ([_, name, g, value]) => { currentMetadata[name] = value.output; return ""; }
	Text :: /[^\\n]/+
	FieldDeclaration (
		:: ".Field" [_] Name [_] [Value] 
		>> () => { throw new Error("Declaring fields is unimplemented because I don't understand it yet") }
	)
	`
	cachedMotherTode += "\n}"
	//cachedMotherTode = cachedMotherTode.replaceAll("`", "\\`")
	
	print(cachedMotherTode)
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
		const line = lines[i]
		const result = TERM.Line(line)
		if (!result.success) throw new Error(`Failed to transpile line ${i}:\n\n${line}\n`)
		const instruction = result.output
		if (instruction !== "") {
			instructions.push(instruction)
			currentPosition++
		}
	}
	
	const labelPositions = {...currentLabelPositions}
	const fields = {...currentFields}
	const metadata = {...currentMetadata}
	const funcs = instructions.map(instruction => new Function(instruction))
	const numberedRegisters = [0].repeated(16)
	
	const symmetryNames = metadata.Symmetries === undefined? ["Normal"] : metadata.Symmetries
	const symmetries = symmetryNames.map(name => SYMMETRY_IDS[name])
	
	return {source, symmetries, metadata, numberedRegisters, instructions, fields, funcs, labelPositions, instructionPosition: 0}
}

//==========//
// Run-Time //
//==========//
let loadedInstructions = []
let loadedLabelPositions = {}
let loadedFields = {}
let loadedInstructionPosition = 0
let loadedNumberedRegisters = [0].repeated(16)

let loadedElementPositions = {}
let loadedElements = []
let loadedElementMetadata = []
let loadedElementPrograms = []

let loadedEventWindow = []

const menuButtonStyle = HTML `<style>
	.menuButton {
		margin: 10px;
		display: inline-block;
		padding: 10px;
		color: white;
		font-family: Rosario;
		cursor: pointer;
	}
	
	.highlight {
		background-color: white;
		color: black;
	}
</style>`
document.head.appendChild(menuButtonStyle)

const loadElement = (program) => {
	const {metadata} = program
	const name = metadata.Name
	if (name === undefined) throw new Error("Elements need to have a 'Name' property.")
	const id = loadedElements.push(name) - 1
	loadedElementPositions[name] = id
	loadedElementMetadata[id] = {...metadata}
	loadedElementPrograms[id] = program
	const button = HTML `<div class='menuButton'>${name}</div>`
	button.on.click(() => {
		$$(".menuButton").forEach(e => e.classList.remove("highlight"))
		button.classList.add("highlight")
		dropperElement = id
		$("#code").innerHTML = program.source
	})
	$("#menu").appendChild(button)
	if (name === "Sand") {
		dropperElement = id
		button.classList.add("highlight")
		$("#code").innerHTML = program.source
	}
}

const run = (program, count = 10) => {
	const {metadata, instructions, numberedRegisters, labelPositions, funcs, instructionPosition, fields} = program
	loadedInstructions = instructions
	loadedLabelPositions = labelPositions
	loadedInstructionPosition = instructionPosition
	loadedFields = fields
	loadedNumberedRegisters = numberedRegisters
	if (funcs.length > 0) for (let i = 0; i < count; i++) {
		const func = funcs[loadedInstructionPosition]
		//if (program == Sand) print(func)
		func()
		loadedInstructionPosition++
		if (loadedInstructionPosition >= funcs.length) {
			loadedInstructionPosition = 0
			loadedNumberedRegisters = [0].repeated(16) //Reset numbered registers?
			break
		}
	}
	
	//program.instructionPosition = 0
	//program.numberedRegisters = [0].repeated(16)
	
	//program.instructionPosition = loadedInstructionPosition
	//program.fields = loadedFields
	//program.numberedRegisters = loadedNumberedRegisters
	
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
	TERM.Symmetry("None").d
	TERM.Symmetry("All").d
	TERM.Site("#0").d
	TERM.Site("#1").d
	//TERM.Field("$active_count").d
	//TERM.Field("R_SelfData$active_count").d
	//TERM.FieldDeclaration(".Field active_count").d
	//TERM.FieldDeclaration(".Field is_active 1").d
	TERM.Element("%Empty").d
	TERM.Symmetries("Normal, Flip_X").d

	const hello = transpile(`
		loop:
			Print "Hello world!"
			Jmp loop
	`)
	print(hello.instructions)
	run(hello)
	
	const reg = transpile(`
		Copy R_0 1
		loop:
			Add R_0 R_0 R_0
			Print R_0
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
		Copy R_0 2
		Copy R_1 3
		loop:
			Swap R_0 R_1
			Print "Swapped"
			Print R_0
			Print R_1
			Jmp loop
	`)
	print(swapper.instructions)
	run(swapper, 20)
	
	
	
}

//tinker()
