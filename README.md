# DevConnector

> Small social network app built with the MERN stack. This is part of my "MERN Stack Front To Back" Udemy course
https://www.udemy.com/mern-stack-front-to-back/

## Quick Start

```bash
# Install dependencies for server
npm install

# Install dependencies for client
npm run client-install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

You will need to create a keys_dev.js in the server config folder with

```
module.exports = {
  mongoURI: 'YOUR_OWN_MONGO_URI',
  secretOrKey: 'YOUR_OWN_SECRET'
};
```

### Author

Amer Hasanbegović

### Version

1.0.0
