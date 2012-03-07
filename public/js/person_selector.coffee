class window.PersonSelector extends Backbone.View
	className : 'person_selector'
	events :
		'keyup': 'handle_keys'

	initialize : ->

	handle_keys : ->
		if e.keyCode == 38
			@go_up()
		else if e.keyCode == 40
			@go_down()
			

	render : ->
		@template = _.template($('#person_selector').html(), @model.toJSON())
		$(@el).html(@template)
		$(@el).attr('contenteditable', true)
		return @