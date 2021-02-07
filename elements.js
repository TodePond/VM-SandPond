
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
	.Symmetries Normal, Flip_Y
	
	Equal R_0 #3 %Empty
	Equal R_1 #3 %Water
	Or R_2 R_0 R_1
	JumpZero exit R_2
	Swap #0 #3
	exit:
`)
loadElement(Sand)

const Water = transpile(`
	.Name Water
	.FgColor #08f
	
	Equal R_0 #3 %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Water)

start() // Start the world after loading elements