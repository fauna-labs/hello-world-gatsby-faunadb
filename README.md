# Hello World Gatsby FaunaDb

This is an example [GatsbyJS application](https://www.gatsbyjs.org/) that demonstrates pre-loading of data at build-time and on-demand loading of data on the client. It uses [FaunaDB as database](https://fauna.com/). This code is accompagnied by a blog post will be easier to follow than the readme.

## Prerequisites

- Git 2.14.5
- Node.js 10.15.3
- NPM 6.4.1

## Setup

### 1. Clone and install the Gatsby project

    git@github.com:fauna-brecht/hello-world-gatsby-faunadb.git
    cd hello-world-gatsby-faunadb
    npm i

### 2. Create a new database
1. Open https://dashboard.fauna.com/ in a browser
2. Click on **New Database** and give it a name

### 3. Add the GraphQL schema to the database to automatically create collections an indices 

1. Still in https://dashboard.fauna.com/, go to the GraphQL tab on the left
2. Save the following GraphQL schema to a file and upload it with the 'Import Schema' button: 
```
type Product {
  title: String!
  description: String
  reviews: [Review] @relation
}

type Review {
  username: String!
  text: String!
  product: Product!
}

type Query {
  allProducts: [Product]
}
```
3. FaunaDB will now have created a Product and Review collection for you including indexes to query them. You should now be presented with a GraphQL playground, feel free to test a GraphQL query or look around in the dashboard for the collections and indexes.
    
### 4. Add an FaunaDB server key to the `gatsby-config.js` file

Create a FaunaDB server key for the database you have just created. still in the UI at https://dashboard.fauna.com, go to the Security tab on the left and click the 'New Key' button. Select the 'Role' to be Server, give it a name and save it, you will receive a secret. 

Copy paste the secret in the the `plugins` section in the `gatsby-config.js` file. You need to replace the `<SERVER_KEY>` placeholder. This key will be used to get data when pregenerating pages. 

### 5. Add an FaunaDB client key to the `gatsby-browser.js` file

Server keys or Admin keys are not meant to be passed to the frontend. 
Instead we have to create a key with a new role which grants access to the specifically database entities that should be accessed.

1. Go to Security and then click on Roles in the newly created database in the UI of https://dashboard.fauna.com/
2. Click on **New Role** and give it a name.
3. Add the **Product** and **Review** collections, and the **product_reviews_by_product** and **AllProducts** indexes. These are already there because FaunaDB created them when you imported the GraphQL schema. 
4. Check for all added collections and indexes the **read** permission
5. Click **Save**
6. Go back to Security on https://dashboard.fauna.com/
7. Click **New Key**
8. Select your database and the newly created role
9. Click **Save**

Again you will receive a key, copy it since we need to place it in the `<CLIENT KEY>` placeholder in the `gatsby-browser.js` file. This key will be used on the frontend side. 

Note: you have probably noticed the Membership tab on this page. Although we are not using it in this tutorial, it is interesting enough to explain it since it's an alternative way to get security tokens. In the Membership tab can specify that entities of a collection (let's say we have a 'Users' collection) in FaunaDb are members of a particular role. That means that if you impersonate one of these entities in that collection, the role privileges apply. You impersonate a database entity (e.g. a User) by associating credentials with the entity and using the Login function, which will return a token. That way you can also implement password-based authentication in FaunaDb. We won't use it in this tutorial, but if that interests you, check the FaunaDB authentication tutorial: https://app.fauna.com/tutorials/authentication

### 6. Add some data 
Still on the https://dashboard.fauna.com/ UI, you can add data by going to the Collections tab on the left. 
Our Products looke like:
``` 
{ 
  "title": "<some title>", 
  "description": "<some description>" 
}
``` 
And Reviews look like: 
```    
{
  "username": "<some username>",
  "text": "<some text>",
  "product": Ref(Collection("Product"), "<some id>")
}
```
Feel free to create some or paste the following two scripts into the Shell (left on the menu in the UI) to create some dummy data. 
```
Map(
  [
    { title: "Screwdriver", description: "Drives screws." },
    { title: "Hair dryer", description: "Dries your hair." },
    { title: "Rocket", description: "Flies you to the moon and back." }
  ],
  Lambda("product",
    Create(Collection("Product"), { data: Var("product") })
  )
);
```
and 
```
Map(
  Paginate(Match(Index("allProducts"))),
  Lambda("ref", Create(Collection("Review"), {
    data: {
      username: "Tina",
      text: "Good product!",
      product: Var("ref")
    }
  }))
)
```


### 7. Start the GatsbyJS development server

To start a development server we need to run the following command:

    npm run develop
    
### 8. Look at the new website

To see the website, we have to open http://localhost:8000 in a browser.

If we open <http://localhost:8000/__graphql> in a browser, the GatsbyJS development server presents us the GraphiQL UI. In the **Explorer** on the left, we can see the `fauna` GraphQL endpoint we configured in the `gatsby-config.js` file before.
