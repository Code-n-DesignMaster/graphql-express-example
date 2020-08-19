# GraphQL example

This repository is example of using GraphQL with Express

## Installation

```bash
git clone https://github.com/Code-n-DesignMaster/graphql-express-example.git
npm install
node src/index.js
open link http://localhost:8080/graphql in Your browser
```

## Usage

### Read data

```pyton
  {
    users {
      id, name, lastName,
      email {
        id, email
      }
    }
    emails {
      id, email,
      user {
        id, name, lastName,
      }
  }  
}
```

### Modify data
```pyton
  mutation {
    addUser (name: "John", lastName:"DOe"){
      id, name, lastName
    }
  }
```