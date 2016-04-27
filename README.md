# F3P competition program

## Cloud 9 (c9.io)
Development is done using C9.io, so all the setup steps are no longer required.

## GitHub
The code is now on GitHub and linked to the Heroku project. Changes pushed to GitHub will be automatically deployed to Heroku.

## CircleCI
The code is automatically built and tested on CircleCI when changes are pushed to GitHub

## Initial setup

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

### Git setup  
Install [Git](http://git-scm.com/download/win)  
Make sure to install the git bash.

### Express setup

```sh
$ npm install express-generator -g
$ express F3P
$ cd F3P
$ npm install mongoose --save
```

Add mongoose  

```sh
$ npm install mongoose --save
```

Create a .gitignore file and add this to it:

```sh
node_modules
.env
Dockerfile
docker-compose.yml
```

Initialize git and commit the initial app

```sh
$ git init
$ git add .
$ git commit -am "Initial commit"
```

### Heroku setup

```sh
$ heroku login
$ heroku create f3p
$ git push heroku master
```

Add MongoLab
```sh
$ heroku addons:create mongolab:sandbox
```

Add Stormpath
```sh
$ heroku addons:create stormpath:developer
```

## Running Locally

Create a .env file and put the stormpath and mongolab keys into it.  
NOTE: Do not submit this file (needs to be specified in the .gitignore file)
You can get these environment settings from the server:
```sh
heroku config
```

Add it to the .env file in this format:

```sh
MONGOLAB_URI=mongodb://...
STORMPATH_API_KEY_ID=...
STORMPATH_API_KEY_SECRET=...
STORMPATH_SECRET_KEY=...
STORMPATH_URL=...
```

Create a Procfile and add the startup code to it:

```sh
web: node bin/www
```

For debuggin add a Profile.local with the following startup code:
```sh
web: node --debug=5858 --nolazy bin/www
```

Start the local server

```sh
$ heroku local -f Procfile.local
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Running latest changes on Heroku

```sh
$ git add .
$ git commit -am "My comment here"
$ git push heroku master
$ heroku open
```

## Cleaning Heroku node cache
```sh
$ heroku config:set NODEMODULESCACHE=false
$ git commit -am 'clean npm cache' --allow-empty
$ git push heroku master
$ heroku config:unset NODEMODULESCACHE
```

## Update packages using ncu
```sh
$ npm install -g npm-check-updates
$ ncu
```

## Running bash on Heroku
```sh
$ heroku run bash
```

## Checking logs

```sh
$ heroku logs
```

## Visual Studio Code tips

For markdown file, use `Ctrl + Shit + v` to change from code to preview  
Run VS Code with administator rights, otherwise the debugger does not work!

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
