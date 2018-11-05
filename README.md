# wxZing

> love wedding wechat project

## Build dev

``` bash
# install dependencies
$ npm install # Or yarn install*[see note below]

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

*Note: Due to a bug in yarn's engine version detection code if you are
using a prerelease version of Node (i.e. v7.6.0-rc.1) you will need to either:
  1. Use `npm install`
  2. Run `yarn` with a standard release of Node and then switch back

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## deploy

``` bash

# setup
$ pm2 deploy ecosystem.json production setup

# deploy
$ pm2 deploy ecosystem.json production

```

## setup server envrionment

``` bash

$ sudo apt-get update
$ sudo apt-get install nvm
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$ nvm install v10.3.0
$ sudo apt-get install nginx
$ sudo apt-get install -y mongodb-org
$ sudo ln -s "$NVM_DIR/versions/node/v10.3.0/bin/node" "/usr/local/bin/node"
$ sudo ln -s "$NVM_DIR/versions/node/v10.3.0/bin/npm" "/usr/local/bin/npm"
$ sudo ln -s "$NVM_DIR/versions/node/v10.3.0/bin/pm2" "/usr/local/bin/pm2"
$ npm install vue-cli pm2 -g
$ nohup sudo mongod  > output 2>&1 &

```
