
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

const Diffuser = transpile(`
	.Name Diffuser
	.FgColor #ff80ff
	.Symmetries Normal, Flip_Y_Swap_XY, Flip_XY, Flip_X_Swap_XY
	
	Equal R_0 #3$type %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Diffuser)

start() // Start the world after loading elements