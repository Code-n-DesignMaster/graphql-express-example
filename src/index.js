const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const users = [
  {
    id: 1,
    name: "Dimon",
    lastName: "Burkovsky"
  },
  {
    id: 2,
    name: "Rus",
    lastName: "Larin"
  },
  {
    id: 3,
    name: "Paha",
    lastName: "Pooh"
  }
];

const emails = [
  {
    id: 1,
    email: "dimon@mail.com",
    userId: 1
  },
  {
    id: 2,
    email: "burkovsky@mail.com",
    userId: 1
  },
  {
    id: 3,
    email: "rus@mail.com",
    userId: 2
  },
  {
    id: 4,
    email: "larin@mail.com",
    userId: 2
  },
  {
    id: 5,
    email: "paha@mail.com",
    userId: 3
  },
  {
    id: 6,
    email: "pooh@mail.com",
    userId: 3
  },
];

const EmailType = new GraphQLObjectType({
  name: 'Email',
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    userId: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve: (email) => {
        return users.find(user => user.id === email.userId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    lastName: { type: GraphQLString },
    emails: {
      type: new GraphQLList(EmailType),
      resolve: (user) => {
        return emails.filter(email => user.id === email.userId);
      }
    },
  })
});



// The root provides a resolver function for each API endpoint
const rootQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => ({
    user: {
      type: UserType,
      description: 'Single user',
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    },
    users: {
      type: new GraphQLList(UserType),
      description: 'User list',
      resolve: () => users
    },
    email: {
      type: EmailType,
      description: 'Single email',
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: (parent, args) => emails.find(email => email.id === args.id)
    },
    emails: {
      type: new GraphQLList(EmailType),
      description: 'Email list',
      resolve: () => emails
    }
  })
});

const rootMutationQuery = new GraphQLObjectType({
  name: 'Mutation',
  description: 'root mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      description: 'Create User',
      args: {
        name: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        console.log('parent', parent);
        const user = {
          id: users.length + 1,
          name: args.name,
          lastName: args.lastName
        };
        users.push(user);
        return user;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutationQuery
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(8080, (err) => {
  if (err) {
    console.log('err ->', err);
  }
  console.log('Running a GraphQL API server at http://localhost:8080/graphql');
});