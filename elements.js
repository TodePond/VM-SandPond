
const Empty = transpile(`
	.Name Empty
	.FgColor #2f333d
`)
loadElement(Empty)

const Void = transpile(`
	.Name Void
	.FgColor #0d1017
`)
loadElement(Void)

const Sand = transpile(`
	.Name Sand
	.FgColor #fc0
	.Symmetries Normal, Flip_X
	
	fall:
		Equal R_0 #3$type %Empty
		Equal R_1 #3$type %Water
		Or R_2 R_1 R_0
		JumpZero slide R_2
			Swap #0 #3
			Exit
	
	slide:
		Equal R_0 #8$type %Empty
		Equal R_1 #8$type %Water
		Or R_2 R_1 R_0
		JumpZero exit R_2
			Swap #0 #8
			Exit
	
	exit:
`)
loadElement(Sand)

const Water = transpile(`
	.Name Water
	.FgColor #08f
	.Symmetries Normal, Flip_X
	
	fall:
		Equal R_0 #3$type %Empty
		JumpZero slide R_0
			Swap #0 #3
			Exit
	
	slide:
		Equal R_0 #4$type %Empty
		JumpZero exit R_0
			Swap #0 #4
			Exit
	
	exit:
`)
loadElement(Water)

const Faller = transpile(`
	.Name Faller
	.FgColor #ff4646
	
	Equal R_0 #3$type %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Faller)

const Res = transpile(`
	.Name Res
	.FgColor #ff80ff
	.Symmetries R_000L, R_090L, R_180L, R_270L
	
	Equal R_0 #3$type %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Res)

const Forkbomb = transpile(`
	.Name Forkbomb
	.FgColor #000
	.Symmetries R_000L, R_090L, R_180L, R_270L
	
	Equal R_0 #3$type %Empty
	JumpZero exit R_0
	Copy #3 #0
	exit:
`)
loadElement(Forkbomb)

const Dropper = transpile(`
	.Name Dropper
	.FgColor #00cccc
	.Symmetries R_000L, R_090L, R_180L, R_270L
	
	Equal R_0 #3$type %Empty
	JumpZero exit R_0
	Swap #3$type #0$type
	
	Copy R_1 R_UniformRandom$int
	Mod R_2 R_1 10
	JumpNonZero exit R_2
	Copy #0$type %Sand
	exit:
`)
loadElement(Dropper)

const DReg = transpile(`
	.Name DReg
	.FgColor #ff0000
	.Symmetries R_000L, R_090L, R_180L, R_270L
	
	spawn_dreg:
		Equal R_0 #3$type %Empty
		JumpZero exit R_0
		
		Mod R_0 R_UniformRandom$int 1000
		JumpNonZero spawn_res R_0
		Copy #3$type %DReg
		Exit
		
	spawn_res:
		Mod R_0 R_UniformRandom$int 200
		JumpNonZero diffuse R_0
		Copy #3$type %Res
		Exit
	
	eat_dreg:
		Equal R_0 #3$type %DReg
		JumpZero exit R_0
		
		Mod R_0 R_UniformRandom$int 10
		JumpNonZero exit R_0
		Copy #3$type %Empty
		Exit
		
	eat_anything:
		Mod R_0 R_UniformRandom$int 100
		JumpNonZero exit R_0
		Copy #3$type %Empty
		Exit
	
	diffuse:
		Swap #3 #0
		Exit
		
	exit:
`)
loadElement(DReg)

start() // Start the world after loading elements