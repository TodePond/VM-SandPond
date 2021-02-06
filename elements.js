
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
	
	Swap #0 #3
`)
loadElement(Sand)

start() // Start the world after loading elements