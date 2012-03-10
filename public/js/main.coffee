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

		_.bindAll @,
			'update_breadcrumb'

		@set('beans' : new Beans)
		@get('beans').is_master = true

		people = new Backbone.Collection
		people.url = '/data/people.json'
		people.fetch
			success : =>
				@set('people' : people)

	update_breadcrumb : ->
		#TODO - this is having a hard time finding the bean.focus on time
		setTimeout (=> 
			$('#breadcrumb').find('ul').empty()

			element	= $('.bean.focus')
			html 		= []

			html.push('<li>' + element.find('.textarea').text() + '</li>')

			while element.hasClass('bean')
				element = element.parent().prev()
				if element.find('.textarea').length
					html.push('<li>' + element.find('.textarea').text() + '</li>')

			html.reverse()
			new_crumb = ''
			for i of html
  				 new_crumb += html[i]

			$('#breadcrumb').find('ul').append(new_crumb)
		), 10

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