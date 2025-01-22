export const resolvers = {
	Query: {
		async records() {
			return '{ name: "John Doe", position: "Software Engineer", level: 3 }';
		},
	},
};
