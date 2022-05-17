const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Person {
    name: String
    age: Int
  }

  enum Direction {
    NORTH
    SOUTH
    EAST
    WEST
  }

  input LatLngInput {
    lat: Float!
    long: Float!
  }

  type Photo {
    height: Int
    width: Int
  }

  union SearchResult = Person | Photo

  interface Node {
    id: ID
  }

  type Order implements Node {
    id: ID
    amount: Float
  }

  type WrappingTypes {
    foo: Int!
    bar: [String]
    baz: [String!]!
    bax: [[Int!]]!
  }

  type Query {
    int: Int
    float: Float
    string: String
    boolean: Boolean
    id: ID

    person: Person

    randomEnum: Direction
    reflectEnum(input: Direction): Direction

    whereAmI(input: LatLngInput): String

    searchResult: SearchResult

    node: Node

    wrappingTypes: WrappingTypes
  }

  type Mutation {
    incrementCounter(increment: Int = 1): Int!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

let counter = 0;

const resolvers = {
  Query: {
    int: () => 42,
    float: () => 42.2,
    string: () => 'oi',
    boolean: () => true,
    id: () => 4,

    person: () => ({ name: 'Joe', age: 31 }),

    reflectEnum: (_, { input }) => input,

    randomEnum: () => {
      const enums = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

      return enums[Math.floor(enums.length * Math.random())];
    },

    whereAmI: () => 'That\'s Mexico pretty sure',

    searchResult: () => ({ height: 150, width: 200, __typename: 'Photo' }),

    node: () => ({ id: 42, amount: 1500.50, __typename: 'Order' }),

    wrappingTypes: () => ({
      foo: 42, bar: ['baz', null], baz: ['baz', 'foo'], bax: [[1, 2], [42]],
    }),
  },
  Mutation: {
    incrementCounter: (_, { increment }) => {
      counter += increment;
      return counter;
    },
  },
};

(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`Now browse to http://localhost:4000${server.graphqlPath}`));
})();
