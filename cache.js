if (!REBUILD) {

TERM.Line = TERM.emit(
	TERM.list([
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Instruction"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("EOF")
]),
	([_, i]) => i.output
)
TERM.Instruction = TERM.list([
	TERM.or([
	TERM.term("Label"),
	TERM.or([
	TERM.term("JumpFunction"),
	TERM.or([
	TERM.term("Print"),
	TERM.or([
	TERM.term("HeaderDeclaration"),
	TERM.term("Function")
])
])
])
])
])
TERM.Value = TERM.list([
	TERM.or([
	TERM.term("UInt"),
	TERM.or([
	TERM.term("SInt"),
	TERM.or([
	TERM.term("Binary"),
	TERM.or([
	TERM.term("String"),
	TERM.or([
	TERM.term("Register"),
	TERM.or([
	TERM.term("Element"),
	TERM.or([
	TERM.term("SiteField"),
	TERM.term("Site")
])
])
])
])
])
])
])
])
TERM.Destination = TERM.list([
	TERM.or([
	TERM.term("Register"),
	TERM.or([
	TERM.term("SiteField"),
	TERM.term("Site")
])
])
])
TERM.Function = TERM.list([
	TERM.or([
	TERM.term("Copy"),
	TERM.or([
	TERM.term("Swap"),
	TERM.or([
	TERM.term("Equal"),
	TERM.or([
	TERM.term("Negate"),
	TERM.or([
	TERM.term("Not"),
	TERM.or([
	TERM.term("Or"),
	TERM.or([
	TERM.term("And"),
	TERM.or([
	TERM.term("Add"),
	TERM.or([
	TERM.term("Sub"),
	TERM.or([
	TERM.term("Mul"),
	TERM.or([
	TERM.term("Compare"),
	TERM.or([
	TERM.term("Nop"),
	TERM.term("Exit")
])
])
])
])
])
])
])
])
])
])
])
])
])
TERM.Copy = TERM.emit(
	TERM.list([
	TERM.string(`Copy`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([c, g1, l, g2, v]) => l + " = " + v
)
TERM.Add = TERM.emit(
	TERM.list([
	TERM.string(`Add`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " + " + rhs
)
TERM.Sub = TERM.emit(
	TERM.list([
	TERM.string(`Sub`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " - " + rhs
)
TERM.Mul = TERM.emit(
	TERM.list([
	TERM.string(`Mul`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " * " + rhs
)
TERM.Equal = TERM.emit(
	TERM.list([
	TERM.string(`Equal`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = Number(" + lhs + " == " + rhs + ")"
)
TERM.Or = TERM.emit(
	TERM.list([
	TERM.string(`Or`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " || " + rhs
)
TERM.And = TERM.emit(
	TERM.list([
	TERM.string(`And`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([a, g1, dst, g2, lhs, g3, rhs]) => dst + " = " + lhs + " && " + rhs
)
TERM.Negate = TERM.emit(
	TERM.list([
	TERM.string(`Negate`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([c, g1, l, g2, v]) => l + " = -" + v
)
TERM.Not = TERM.emit(
	TERM.list([
	TERM.string(`Not`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([c, g1, l, g2, v]) => l + " = Number(!" + v + ")"
)
TERM.Nop = TERM.emit(
	TERM.list([
	TERM.string(`Nop`)
]),
	() => ""
)
TERM.Exit = TERM.emit(
	TERM.list([
	TERM.string(`Exit`)
]),
	() => "loadedInstructionPosition = loadedInstructions.length"
)
TERM.Swap = TERM.emit(
	TERM.list([
	TERM.string(`Swap`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination")
]),
	([s, g1, lhs, g2, rhs]) => `{ const temp = ${lhs}; ${lhs} = ${rhs}; ${rhs} = temp; }`
)
TERM.Compare = TERM.emit(
	TERM.list([
	TERM.string(`Compare`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Destination")
]),
	([s, g1, lhs, g2, rhs]) => `{ const l = ${lhs}; const r = ${rhs}; if (l < r) return -1; if (l > r) return 1; return 0; }`
)
TERM.JumpFunction = TERM.list([
	TERM.or([
	TERM.term("Jmp"),
	TERM.or([
	TERM.term("JumpRelativeOffset"),
	TERM.or([
	TERM.term("JumpZero"),
	TERM.or([
	TERM.term("JumpNonZero"),
	TERM.or([
	TERM.term("JumpLessThanZero"),
	TERM.or([
	TERM.term("JumpGreaterThanZero"),
	TERM.term("Jump")
])
])
])
])
])
])
])
TERM.Label = TERM.emit(
	TERM.list([
	TERM.term("Name"),
	TERM.string(`:`)
]),
	(label) => { currentLabelPositions[label[0]] = currentPosition; return "// " + label[0]; }
)
TERM.JumpZero = TERM.emit(
	TERM.list([
	TERM.string(`JumpZero`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([j, g1, label, g2, value]) => `if (${value} === 0) loadedInstructionPosition = loadedLabelPositions['${label}']`
)
TERM.JumpNonZero = TERM.emit(
	TERM.list([
	TERM.string(`JumpNonZero`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([j, g1, label, g2, value]) => `if (${value} !== 0) loadedInstructionPosition = loadedLabelPositions['${label}']`
)
TERM.JumpLessThanZero = TERM.emit(
	TERM.list([
	TERM.string(`JumpLessThanZero`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([j, g1, label, g2, value]) => `if (${value} < 0) loadedInstructionPosition = loadedLabelPositions['${label}']`
)
TERM.JumpGreaterThanZero = TERM.emit(
	TERM.list([
	TERM.string(`JumpGreaterThanZero`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([j, g1, label, g2, value]) => `if (${value} > 0) loadedInstructionPosition = loadedLabelPositions['${label}']`
)
TERM.JumpRelativeOffset = TERM.emit(
	TERM.list([
	TERM.string(`JumpRelativeOffset`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name")
]),
	([j, _, l]) => "loadedInstructionPosition += " + l
)
TERM.Jump = TERM.emit(
	TERM.list([
	TERM.string(`Jump`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name")
]),
	([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"
)
TERM.Jmp = TERM.emit(
	TERM.list([
	TERM.string(`Jmp`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name")
]),
	([j, _, l]) => "loadedInstructionPosition = loadedLabelPositions['" + l + "']"
)
TERM.Print = TERM.emit(
	TERM.list([
	TERM.string(`Print`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Value")
]),
	([p, _, msg]) => "console.log(" + msg + ")"
)
TERM.UInt = TERM.list([
	TERM.or([
	TERM.term("IntLiteral"),
	TERM.term("UIntLiteral")
])
])
TERM.IntLiteral = TERM.list([
	TERM.many(TERM.regexp(/[0-9]/))
])
TERM.UIntLiteral = TERM.emit(
	TERM.list([
	TERM.term("IntLiteral"),
	TERM.string(`u`)
]),
	([n]) => n.output
)
TERM.SInt = TERM.list([
	TERM.term("SIntLiteral")
])
TERM.SIntLiteral = TERM.emit(
	TERM.list([
	TERM.maybe(TERM.string(`-`)),
	TERM.term("IntLiteral"),
	TERM.string(`i`)
]),
	([s, n]) => s + n
)
TERM.Binary = TERM.list([
	TERM.term("BinaryLiteral")
])
TERM.BinaryLiteral = TERM.list([
	TERM.string(`0b`),
	TERM.many(TERM.list([
	TERM.or([
	TERM.string(`0`),
	TERM.string(`1`)
])
]))
])
TERM.String = TERM.list([
	TERM.term("StringLiteral")
])
TERM.StringLiteral = TERM.list([
	TERM.string(`"`),
	TERM.maybe(TERM.list([
	TERM.many(TERM.regexp(/[^"]/))
])),
	TERM.string(`"`)
])
TERM.Symmetry = TERM.list([
	TERM.or([
	TERM.string(`None`),
	TERM.or([
	TERM.string(`All`),
	TERM.or([
	TERM.string(`Flip_X`),
	TERM.or([
	TERM.string(`Normal`),
	TERM.string(`Flip_Y`)
])
])
])
])
])
TERM.Symmetries = TERM.emit(
	TERM.list([
	TERM.or([
	TERM.term("TwoSymmetries"),
	TERM.term("Symmetry")
])
]),
	(ss) => ss.output.split(",").map(s => s.trim())
)
TERM.TwoSymmetries = TERM.list([
	TERM.term("Symmetry"),
	TERM.string(`,`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Symmetries")
])
TERM.SiteField = TERM.emit(
	TERM.list([
	TERM.term("Site"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("RelativeField")
]),
	([s, _, f]) => s + "." + f
)
TERM.Site = TERM.emit(
	TERM.list([
	TERM.string(`#`),
	TERM.term("IntLiteral")
]),
	([_, n]) => "loadedEventWindow[" + n + "]"
)
TERM.RelativeField = TERM.emit(
	TERM.list([
	TERM.string(`$`),
	TERM.term("Name")
]),
	([_, n]) => n.output
)
TERM.Register = TERM.list([
	TERM.or([
	TERM.term("NumberedRegister"),
	TERM.term("NamedRegister")
])
])
TERM.NumberedRegister = TERM.emit(
	TERM.list([
	TERM.string(`R_`),
	TERM.term("IntLiteral")
]),
	([_, n]) => "loadedNumberedRegisters[" + n + "]"
)
TERM.NamedRegister = TERM.emit(
	TERM.list([
	TERM.or([
	TERM.string(`R_SelfRaw`),
	TERM.or([
	TERM.string(`R_SelfType`),
	TERM.or([
	TERM.string(`R_SelfHeader`),
	TERM.or([
	TERM.string(`R_SelfChecksum`),
	TERM.or([
	TERM.string(`R_SelfData`),
	TERM.string(`R_UniformRandom`)
])
])
])
])
])
]),
	() => { throw new Error("Other registers are not implemented yet") }
)
TERM.Name = TERM.list([
	TERM.many(TERM.regexp(/[A-Za-z_]/))
])
TERM.Element = TERM.emit(
	TERM.list([
	TERM.string(`%`),
	TERM.term("Name")
]),
	([_, n]) => "loadedElementPositions['" + n + "']"
)
TERM.HeaderDeclaration = TERM.list([
	TERM.or([
	TERM.term("FieldDeclaration"),
	TERM.term("MetadataDeclaration")
])
])
TERM.MetadataDeclaration = TERM.emit(
	TERM.list([
	TERM.string(`.`),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.list([
	TERM.or([
	TERM.term("Symmetries"),
	TERM.term("Text")
])
])
]),
	([_, name, g, value]) => { currentMetadata[name] = value.output; return ""; }
)
TERM.Text = TERM.list([
	TERM.many(TERM.regexp(/[^\n]/))
])
TERM.FieldDeclaration = TERM.emit(
	TERM.list([
	TERM.string(`.Field`),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.term("Name"),
	TERM.maybe(TERM.list([
	TERM.gap
])),
	TERM.maybe(TERM.list([
	TERM.term("Value")
]))
]),
	() => { throw new Error("Declaring fields is unimplemented because I don't understand it yet") }
)
}