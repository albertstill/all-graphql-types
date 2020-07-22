const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type AllScalars {
    int: Int
    float: Float
    string: String
    boolean: Boolean
    id: ID
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

  type Person {
    name: String
    age: Int
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
    hello: String
    
    allScalars: AllScalars

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
    hello: () => 'Hello world!',

    allScalars: () => ({
      int: 42,
      float: 42.2,
      string: 'oi',
      boolean: true,
      id: 4,
    }),

    reflectEnum: (_, { input }) => input,

    randomEnum: () => {
      const enums = ['NORTH', 'SOUTH', 'EAST', 'WEST'];

      return enums[Math.floor(enums.length * Math.random())];
    },

    whereAmI: () => 'That\'s Mexico pretty sure',

    searchResult: () => ({ name: 'Joe', age: 31, __typename: 'Person' }),

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

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Now browse to http://localhost:4000${server.graphqlPath}`));
