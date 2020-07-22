An example of all the types mentioned in the GraphQL spec http://spec.graphql.org/,
using the examples given in the spec.

```bash
yarn install
yarn watch
```

Go to http://localhost:4000/graphql to play with the GraphQL IDE.

```graphql
query all {
  hello
  allScalars {
    int
    float
    string
    boolean
    id
  }

  reflectEnum(input: NORTH)

  randomEnum

  whereAmI(input:{ lat: 243.23, long: 213.123123})

  searchResult {
    ... on Person {
      name
    }
  }

  node {
    id
    ... on Order {
      amount
    }
  }

  wrappingTypes {
    foo
    bar
    baz
    bax
  }
}
```
