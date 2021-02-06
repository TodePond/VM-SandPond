
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
	
	Equal R_0 #3 %Empty
	JumpZero exit R_0
	Swap #0 #3
	exit:
`)
loadElement(Sand)

start() // Start the world after loading elements