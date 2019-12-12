# Reviewz

This is an example [GatsbyJS application](https://www.gatsbyjs.org/) that demonstrates pre-loading of data at build-time and on-demand loading of data on the client. It uses [FaunaDB as database](https://fauna.com/).

[This commit](https://github.com/kay-is/reviewz/commit/40f7173ee78fd4e565390d10411d6a85f781e61b) shows the changes done to a blank GatsbyJS project to connect it to the FaunaDB GraphQL API.

## Prerequisites

- Git 2.14.5
- Node.js 10.15.3
- NPM 6.4.1

## Setup

### 1. Clone and install the Gatsby project

    git clone git@github.com:kay-is/reviewz.git
    cd reviewz
    npm i
    
### 2. Add an FaunaDB admin key to the `gatsby-config.js` file

An admin key for a FaunaDB database named `reviewz` can be created with the following command:

    npx fauna-shell create-key reviewz admin
    
Under the `plugins` section in the `gatsby-config.js` file is the config for the `gatsby-source-graphql` plugin.

We need to replace the `<ADMIN_KEY>` placeholder with an actual FaunaDB admin key.

### 3. Add an FaunaDB client key to the `gatsby-browser.js` file

The built-in **client** role of FaunaDB doesn't allow read access to indexes, so we need to create a custom role. This can't be done via the Fauna Shell, so we have to do it on the Fauna Dashboard.

1. Open https://dashboard.fauna.com/roles/@db/reviewz in a browser
2. Click on **New Role**
3. Name the new role **ClientRead**
4. Add the **Product** and **Review** collections, and the **product_reviews_by_product** and **AllProducts** indexes
5. Check for all added collections and indexes the **read** permission
6. Click **Save**
7. Open https://dashboard.fauna.com/keys/@db/reviewz in a browser
8. Click **New Key**
9. Select the **reviewz** database and the **ClientRead** role
10. Click **Save**

We need to replace the `<CLIENT KEY>` placeholder in the `gatsby-browser.js` file with the **ClientRead** key we just created.

### 4. Start the GatsbyJS development server

To start a development server we need to run the following command:

    npm run develop
    
### 5. Look at the new website

To see the website, we have to open http://localhost:8000 in a browser.

If we open <http://localhost:8000/__graphql> in a browser, the GatsbyJS development server presents us the GraphiQL UI. In the **Explorer** on the left, we can see the `fauna` GraphQL endpoint we configured in the `gatsby-config.js` file before.
