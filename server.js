require("dotenv").config();

const http = require('http')
const { Nuxt, Builder } = require('nuxt')
const express = require('express')
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require("parse-dashboard");


// const roleACL = new Parse.ACL();
// roleACL.setPublicReadAccess(true);
// roleACL.setPublicWriteAccess(true);
// const role = new Parse.Role("Administrator", roleACL);
// role.save()

const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'
const serverURL = isProd ? process.env.PRODUCTION_URL + '/parse' : "http://localhost:3000/parse";

const api = new ParseServer({
  databaseURI: isProd ? process.env.MONGODB_LINK : "mongodb://localhost/parse",
  cloud: "./cloud.js",
  appId: "1",
  fileKey: "jnklpw",
  masterKey: process.env.MASTER_KEY,
  serverURL
});

var dashboard = new ParseDashboard({
  trustProxy: 1,
  users: [
    {
      user: "yaoyao", // 控制台登陆
      pass: "xiaoyaoyao"
    }
  ],
  apps: [
    {
      serverURL,
      appId: "1",
      masterKey: "888888",
      appName: "yao",
      production: true,
    }
  ]
});

const app = express()
const server = http.createServer(app)

// We instantiate Nuxt.js with the options
const config = require('./nuxt.config.js')
config.dev = !isProd

const nuxt = new Nuxt(config)
// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

app.use('/parse', api);
app.use("/dashboard", dashboard);

app.use(nuxt.render)

// Listen the server
server.listen(port, '0.0.0.0')
console.log('Server listening on http://localhost:' + port) // eslint-disable-line no-console


process.addListener('unhandledRejection', console.log)
process.addListener('uncaughtException', console.log)