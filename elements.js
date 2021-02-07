
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
	.Symmetries Normal
	
	fall:
		Equal R_0 #3 %Empty
		Equal R_1 #3 %Water
		Or R_2 R_1 R_0
		JumpZero slide R_2
			Swap #0 #3
			Exit
	
	slide:
		Equal R_0 #8 %Empty
		Equal R_1 #8 %Water
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
	
	Equal R_0 #1 %Empty
	JumpZero exit R_0
	Swap #0 #1
	exit:
`)
loadElement(Water)

const Faller = transpile(`
	.Name Faller
	.FgColor #ff4646
	
	Equal R_0 #3 %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Faller)

start() // Start the world after loading elements