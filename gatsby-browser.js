import React from "react"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"

const client = new ApolloClient({
  uri: "https://graphql.fauna.com/graphql",
  request: operation => {
    operation.setContext({
      headers: {
        Authorization: "Bearer <CLIENT KEY>",
      },
    })
  },
})

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
