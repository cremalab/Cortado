class ShortcutKeys extends Backbone.Shortcuts
	shortcuts:
		'⌘+s' 	: 'save_document'
		'enter'	: 'carriage_return'
		'tab'		: 'tab_key'
		'shift+tab'	: 'tab_key'

	save_document : (e) ->
		e.preventDefault()
		project.save()

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
	bean.set('content' : 'Brand New Project')
	project.get('beans').add bean


	bean2 = new Bean
	project.get('beans').models[0].get('children').add(bean2)
	#