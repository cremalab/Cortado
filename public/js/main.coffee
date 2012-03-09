class ShortcutKeys extends Backbone.Shortcuts
	shortcuts:
		'⌘+s' 	: 'save_document'
		'enter'	: 'carriage_return'
		'tab'		: 'tab_key'
		'shift+tab'	: 'tab_key'

	save_document : (e) ->
		e.preventDefault()
		console.log project.get('beans').models[0]
		all_data = JSON.stringify(project.get('beans').models[0].get('children'))
		$.ajax
			method	: 'POST'
			url 		: '/add/project'
			data		: 'project=' + all_data
				success : ->
					console.log 'yes'
				error : (err) ->
					console.log err
		

	carriage_return : (e) ->
		e.preventDefault()

	tab_key : (e) ->
		e.preventDefault()


window.Project = Backbone.RelationalModel.extend(

	initialize : ->

		@set('beans' : new Beans)
		@get('beans').is_master = true

		people = new Backbone.Collection
		people.url = '/data/people.json'
		people.fetch
			success : =>
				@set('people' : people)
)



$ ->
	shortcuts 		= new ShortcutKeys
	window.project 	= new Project

	#start a new project
	bean = new Bean
	bean.url = '/add/project'
	bean.set('content' : 'Brand New Project')
	project.get('beans').add bean
	#