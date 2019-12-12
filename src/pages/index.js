import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { graphql } from "gatsby"
import React, { useState } from "react"

import Layout from "../components/layout"

// Query for fetching at build-time
export const query = graphql`
  {
    fauna {
      allProducts {
        data {
          _id
          title
          description
        }
      }
    }
  }
`

// Query for fetching on the client
const GET_REVIEWS = gql`
  query GetReviews($productId: ID!) {
    findProductByID(id: $productId) {
      reviews {
        data {
          _id
          username
          text
        }
      }
    }
  }
`

const IndexPage = props => {
  const [productId, setProductId] = useState(null)
  const { loading, data } = useQuery(GET_REVIEWS, {
    variables: { productId },
    skip: !productId,
  })

  return (
    <Layout>
      <ul>
        {props.data.fauna.allProducts.data.map(product => (
          <li>
            <button
              onClick={() => setProductId(product._id)}
              disabled={loading}
            >
              Get Reviews
            </button>
            {product.title} - {product.description}
            {productId === product._id && data && (
              <ul>
                {data.findProductByID.reviews.data.map(
                  ({ _id, text, username }) => (
                    <li key={_id}>
                      {username}: "{text}"
                    </li>
                  )
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default IndexPage
