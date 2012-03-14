class window.ShortcutKeys extends Backbone.Shortcuts
	shortcuts:
		'⌘+s' 	: 'save_document'
		'enter'	: 'carriage_return'
		'tab'		: 'tab_key'
		'shift+tab'	: 'tab_key'

	save_document : (e) ->
		e.preventDefault()

		@beans_json = project.get('beans').models[0].toJSON()
		project.clean_up_json(@beans_json)
		project_data = JSON.stringify(@beans_json)

		project_id = $('section#document').data('project_id')

		if project_id.length
			$.ajax
				method	: 'POST'
				url 		: '/project/update'
				data		: 'project_id=' + project_id + '&project_data=' + project_data
				success : ->
					console.log 'saved'
				error : (err) ->
					console.log err

	carriage_return : (e) -> e.preventDefault()
	tab_key : (e) -> e.preventDefault()



window.Project = Backbone.RelationalModel.extend(

	relations : [
		type			: Backbone.HasOne
		key 			: 'bean'
		relatedModel 	: 'Bean'
		collectionType 	: 'Beans'
	]

	initialize : ->

		_.bindAll @,
			'update_breadcrumb'
			'clean_up_json'

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


	#TODO - the fact that this function needs to run exposes a higher level issue with storing views inside models
	clean_up_json : (parent) ->
		delete parent.view
		i = 0
		while i < parent.children.length
			@clean_up_json(parent.children[i])
			i++

)