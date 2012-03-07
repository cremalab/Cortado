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



class Project extends Backbone.Model
	initialize : ->
		@set('beans' : new Beans)
		@get('beans').is_master = true 

		people = new Backbone.Collection
		people.url = '/data/people.json'
		
		people.fetch
			success : =>
				@set('people' : people)



create_new_project = ->

	window.project 	= new Project
	new_bean		= new Bean
	project.get('beans').add(new_bean)


$ ->
	shortcuts = new ShortcutKeys
	create_new_project()