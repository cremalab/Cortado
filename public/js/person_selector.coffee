class window.PersonSelector extends Backbone.View
	className : 'person_selector'
	events :
		'keyup': 'handle_keys'

	initialize : ->
		@parent = @options.parent
	
	handle_keys : (e) ->
		if e.keyCode	== 27 then @delete_me()
		else if e.keyCode == 13 then @add_me()
		else if e.keyCode == 38 then @go_up()
		else if e.keyCode == 40 then @go_down()
		else @determine_match()
			
	determine_match : ->
		input_text = @input.val()
		$.each $(@el).find('li'), (i, item) =>
			name = $(item).find('.name').text()
			if !@string_is_part_of_string(input_text, name)
				$(item).hide()
			else
				$(item).show()

	add_me : ->
		this_guy = parseInt(@get_selected().find('.uid').text())
		_.each project.get('people').models, (person) =>
			if person.get('uid') == this_guy  then @parent.model.get('people').add(person)
		@delete_me()

	delete_me : ->
		$(@el).removeClass('show')
		setTimeout (=>  
			$(@el).remove()
			@parent.person_selector = null
		), 500

	go_up : ->
		selected = @get_selected()
		if selected.prev().length
			selected.removeClass('selected').prev().addClass('selected')
		else
			selected.removeClass('selected').parent().find('li:last-child').addClass('selected')

	go_down : ->
		selected = @get_selected()
		if selected.next().length
			selected.removeClass('selected').next().addClass('selected')
		else
			selected.removeClass('selected').parent().find('li:first-child').addClass('selected')

	get_selected : ->
		$(@el).find('ul').find('li.selected')

	string_is_part_of_string : (sub, long) ->
		sub	= sub.toLowerCase()
		long 	= long.toLowerCase()
		if long.indexOf(sub) != -1 then return true else return false

	render : ->
		html = '<input type="text" /><ul>'
		_.each @collection.models, (person, i) =>
			html += _.template($('#barista').html(), person.attributes)
		html += '</ul>'

		$(@el).html(html)
		$(@el).attr('contenteditable', false)

		@input = $(@el).find('input')
		return @