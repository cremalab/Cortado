# Cortado (Temporary Codename)

## SetUp
To get started you'll need [node](http://nodejs.org). After the download and install of node is complete, install [npm](http://npmjs.org/). The one line install is sufficient.

### NPM
* Install all packages `npm install`
* Install node-dev globally 'npm install node-dev -g'

### Running
Run the server with node-dev
`node-dev runner.js`

If you're changing clientside coffeescript you'll have to compile yourself.
`coffee -w -c public/js`

### Database
CouchDB is used and hosted at [irisCouch](http://cremalab.iriscouch.com/). You can inspect entries by visiting [irisCouchPath/_utils](http://cremalab.iriscouch.com/_utils/)

## Client Side Stack
* [Backbone](http://documentcloud.github.com/backbone/)
* [Backbone Relational](http://documentcloud.github.com/underscore/)
* [Underscore](https://github.com/PaulUithol/Backbone-relational)
* [CoffeeScript](http://coffeescript.org/)
* [Jade](http://jade-lang.com/)
* [Stylus](http://learnboost.github.com/stylus/)
* [jQuery](http://jquery.com/)