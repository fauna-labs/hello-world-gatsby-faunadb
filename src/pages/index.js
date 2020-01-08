import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import { graphql } from "gatsby"
import React, { useState } from "react"
import Layout from "../components/layout"
import './index.css'

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
  const [productToReviews, setProductToReviews] = useState({})

  const { loading, data } = useQuery(GET_REVIEWS, {
    variables: { productId },
    skip: !productId,
  })
  if(! loading && data){
    productToReviews[productId] = data.findProductByID.reviews.data
    setProductToReviews(productToReviews)
    setProductId(null)
  }

  return (
    <Layout>
      <div className='product-title-container'> <h2> Products: </h2><span className='explanation'> (The initial products part of this page is pregenerated at compile-time from FaunaDb with Gatsby) </span>  </div>
      <div className='product-card-container'>
        { listProductsAndReviews(props.data.fauna.allProducts.data, productToReviews, setProductId) }
      </div>
    </Layout>
  )
}

const listProductsAndReviews = ( products, productToReviews, setProductId ) => {
  return (
    <ul className='product-card-list'>
      {products.map((product, index) => listOneProductAndReviews(product, index, productToReviews, setProductId))}
    </ul>
  )
}

const listOneProductAndReviews = ( product, index, productToReviews, setProductId) => {
  return (
    <li key={'product-' + index} className='product-list-item'>
      <div className='product-card'>
         <div key={'product-name-' + index} className='product-name'> {product.title} </div>
         <div key={'product-description-' + index} className= 'product-description'> {product.description} </div>
         <button key={'product-reviews-button-' + index} className= 'product-reviews-button' onClick={() => setProductId(product._id)}> Load reviews </button>
      </div>
      { productToReviews[product._id] ? renderReviews(productToReviews[product._id], index) : null }
    </li>
  )
}
const renderReviews = (reviews, pIndex) => {
  return (
    <div className='product-reviews'>
      <div className='explanation'> (These reviews are injected dynamically by querying FaunaDB) </div>
      { renderReviewsList(reviews, pIndex) }
    </div>
  )
}

const renderReviewsList = ( reviews, pIndex ) => {
  return reviews.map((review, index) => {
    return (
      <div key={'prod-' + pIndex + '-rev-' + index} className='review'>
        <div key={'prod-' + pIndex + '-rev-user' + index} className='review-user'>
          {review.username}
        </div>
        <div key={'prod-' + pIndex + '-rev-text' + index} className='review-text'>
          {review.text}
        </div>
      </div>
    )
  })
}

export default IndexPage
