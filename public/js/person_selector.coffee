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

			#TODO - just make this better
			@get_selected().removeClass('selected')
			selected = $(@el).find('li:first-child')
			i = 0
			while selected.is(':hidden') && i<10
				selected = selected.next()
			selected.addClass('selected')


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
		#TODO - just make this better
		selected 	= @get_selected().removeClass('selected')
		next_item	= selected.prev()
		if !next_item.length then next_item = selected.parent().find('li:last-child')
		
		i = 0
		while next_item.is(':hidden') && i<10
			if !next_item.prev().length
				next_item = selected.parent().find('li:last-child').addClass('selected')
			else
				next_item = next_item.prev()
			i++

		next_item.addClass('selected')

	go_down : ->
		#TODO - just make this better
		selected 	= @get_selected().removeClass('selected')
		next_item	= selected.next()
		if !next_item.length then next_item = selected.parent().find('li:first-child')

		i = 0
		while next_item.is(':hidden') && i<10
			if !next_item.next().length
				next_item = selected.parent().find('li:first-child').addClass('selected')
			else
				next_item = next_item.next()
			i++

		next_item.addClass('selected')

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