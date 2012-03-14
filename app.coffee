express		= require 'express'
path			= require 'path'
fs 			= require 'fs'
stylus 		= require 'stylus'
app 			= express.createServer()
io			= require('socket.io').listen(app)
port 			= process.env.PORT || 3000

projects = ['southern_attraction', 'ampd']

get_a_project = (project, next) ->
	project_path = __dirname + '/data/projects/' + project  + '.json'
	fs.readFile project_path, 'utf8', (err, data) ->
		next(JSON.parse(data))

app.configure ->
	app.use express.logger format: ':method :url :status'
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


app.get '/', (req, res) ->
	res.render 'index'
		projects : projects

app.get '/project/update', (req, res) ->
	project_path = __dirname + '/data/projects/' + req.query.project_id + '.json'
	fs.writeFile project_path, req.query.project_data, (err) ->
	res.end()

app.post '/project', (req, res) ->
	get_a_project req.body.project, (project_data) ->
		res.render 'project'
			num_requests : 3
			project_data : JSON.stringify(project_data)
			project_id : req.body.project

app.get '/project/new', (req, res) ->
	res.render 'project'
		num_requests : 3

app.listen port
console.log 'server running on port ' + port 