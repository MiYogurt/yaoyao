const path = require('path')

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "就爱瑶族",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "江华瑶族自己人的论坛"
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.png" },
      {
        rel: "stylesheet",
        href: "https://cdn.bootcss.com/normalize/8.0.0/normalize.min.css"
      },
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.3.1/css/all.css"
      }
    ]
  },
  plugins: [
    "~/plugins/localforage",
    "~/plugins/parse",
    "~/plugins/time",
    "~/plugins/md2",
    {
      src: "~/plugins/color",
      ssr: false
    },
    {
      src: "~/plugins/storage",
      ssr: false
    },
    {
      src: "~/plugins/clip",
      ssr: false
    },
    {
      src: "~/plugins/message",
      ssr: false
    }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#52c1ed" },
  env: {
    baseUrl: isProd ? process.env.PRODUCTION_URL : "http://localhost:3000",
    cdnUrl: "http://52yaoyao.test.upcdn.net",
    masterKey: process.env.MASTER_KEY,
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ["pell", "vue-color", "xss"],
    extend(config, { isDev, isClient, isServer }) {
      if (isClient) {
        config.resolve.alias["create-api"] = path.resolve(
          __dirname,
          "api/create-client-api.js"
        );
      }
      if (isServer) {
        config.resolve.alias["create-api"] = path.resolve(
          __dirname,
          "api/create-server-api.js"
        );
      }
    }
  }
};
