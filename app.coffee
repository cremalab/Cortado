express		= require 'express'
path			= require 'path'
passport 		= require 'passport'
fs 			= require 'fs'
stylus 		= require 'stylus'
app 			= express.createServer()
io			= require('socket.io').listen(app)
port 			= 3000

LocalStrategy	= require('passport-local').Strategy

users = [
	id: 		1
	username:	'username'
	password:	'password'
	email:	'user@cremalab.com'
]
	
passport.serializeUser (user, done) ->
	done null, user.id

passport.deserializeUser (id, done) ->
	find_by_id id, (err, user) ->
		done err, user

passport.use(new LocalStrategy( (username, password, done) ->
	process.nextTick ->
		find_by_username username, (err, user) ->
			return done err if err
			return done null, false if !user
			return done null, false if user.password != password
			return done null, user
))

ensure_authenticated = (req, res, next) ->
	return next()
	#return next() if req.isAuthenticated()
	#res.redirect '/login'

find_by_id = (id, fn) ->
	idx = id - 1
	if users[idx]
		fn null, users[idx]
	else 
		fn(new Error('User ' + id ' does not exist'))

find_by_username = (username, fn) ->
	for user in users
		return fn(null, user) if user.username == username
	fn null, null

app.get '/add/project', ensure_authenticated, (req, res) ->
	console.log req.query


app.configure ->
	#app.use express.logger format: ':method :url :status'
	app.use express.cookieParser()
	app.use express.bodyParser()
	app.use express.session secret: 'keyboard cat'

	app.set 'stylesheets', 'css', 'css'
	app.use stylus.middleware
		debug: true
		force: true
		src: path.join __dirname + '/public/'
	app.use express.static path.join __dirname, 'public'
	app.set 'views', path.join __dirname, 'views'
	app.set 'view engine', 'jade'

	app.use passport.initialize()
	app.use passport.session()


date = new Date()
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
today = months[date.getMonth()] + ' ' + date.getUTCDate()

app.get '/', (req, res) ->
	res.render 'index'
		today : today
		num_requests : 3

app.get '/login', (req, res) ->
	res.render 'login'

app.get '/logout', (req, res) ->
	req.logout()
	res.render 'logout'

app.get '/admin', ensure_authenticated, (req, res) ->
	res.render 'admin'

app.listen port
console.log 'server running on port ' + port