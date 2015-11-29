# F3P competition program

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
Note: Heroku does currently not work in git bash shell on windows, so use cmd

```sh
$ heroku login
$ heroku create f3p
$ git push heroku master
```

## Running Locally

```sh
$ heroku local
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Running latest changes on Heroku

```sh
$ git add .
$ git commit -am "My comment here"
$ git push heroku master
$ heroku open
```

## Checking logs

```sh
$ heroku logs
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)