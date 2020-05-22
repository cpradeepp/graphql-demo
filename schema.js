const { gql } = require('apollo-server');
const typeDefs = gql`
	
	directive @isUserAuthorized on OBJECT | FIELD_DEFINITION

	type Query {
		me: User @isUserAuthorized,
		user(id: ID!): User,
		department(id: ID!): Department
	}

	type User {
		id: ID!,
		name: String,
		email: String,
        phone: String @isUserAuthorized,
	}

	type Post {
		id: ID!,
		name: String,
		address: String,
		users: [User]!
	}

	type Department {
		id: ID!
	}

`;

module.exports = typeDefs