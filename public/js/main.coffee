# undo
# @ sign recognitiion

total_hours = 0
last_four_keys = []

$ ->
	
	$('.textarea').focus()
	$('.textarea').addClass('focus')

	$('.textarea').live 'click', (e) ->
		if $(e.target).next().hasClass('wrap')
			$(e.target).next().slideToggle()

	$('.textarea').live 'keyup', (e) ->

		if e.keyCode == 16 then return false
		if e.keyCode == 51 && e.shiftKey then e.keyCode = '#'

		if e.keyCode == 50 && e.shiftKey
			some_html = $('#hidden').html()
			$(e.target).append(some_html)
			setTimeout (->
				$(e.target).find('.person_selector').addClass('show')
			), 10

			return false

		last_four_keys.unshift(e.keyCode)
		if last_four_keys.length > 4
			last_four_keys.pop()

		if _.isEqual(last_four_keys, [83, 82, 72, "#"])
			full_string 		= $(e.target).text()
			start			= full_string.search('#hrs')
			end			= start + 4
			index		= start - 1
			current_char	= parseInt(full_string.charAt(index))
			string_num	= ''

			while isFinite(current_char)
				string_num   = current_char + string_num
				current_char = parseInt(full_string.charAt(index-=1))

			if isFinite(parseInt(string_num))
				while index <= end
					full_string = full_string.replaceAt(index, ' ')
					if index == end
						full_string = full_string.replaceAt(index, '<div contenteditable="false" class="hours">' + string_num + ' hours</div> ')
					index++
				$(e.target).html(full_string)
				setTimeout (->
					$(e.target).find('.hours').addClass('show')
				), 10
				add_to_hours(parseInt(string_num))


	add_to_hours = (hrs) ->
		$('.hrs_spent').text(total_hours += hrs)


	key 'enter', (e, handler) ->
		e.preventDefault()
		$(e.target).parent().append('<div class="textarea"  contenteditable="true"></div>')
		$(e.target).next().focus()
		$('.textarea').removeClass('focus')
		$(e.target).next().addClass('focus')
		if $(e.target).text() == ''
			if  $(e.target).siblings().length == 0
				$(e.target).parent().remove()
			else
				$(e.target).remove()



	key 'tab', (e, handler) ->
		e.preventDefault()
		prev = $(e.target).prev()
		if prev.length
			if (prev.hasClass('wrap'))
				$(e.target).remove()
				prev.append($(e.target))
				$(e.target).focus()
				$('.textarea').removeClass('focus')
				$(e.target).addClass('focus')
			else
				$(e.target).wrap('<div class="wrap"></div>')
				$(e.target).focus()
				$('.textarea').removeClass('focus')
				$(e.target).addClass('focus')



	key 'shift+tab', (e, handler) ->
		e.preventDefault()
		if $(e.target).parent().parent().attr('id') != 'cortado'
			if $(e.target).siblings().length
				parent = $(e.target).parent().parent()
				$(e.target).remove()
				parent.append($(e.target))
				$(e.target).focus()
				$('.textarea').removeClass('focus')
				$(e.target).addClass('focus')
			else
				$(e.target).unwrap()
			$(e.target).focus()
			$('.textarea').removeClass('focus')
			$(e.target).addClass('focus')



	key 'up', (e, handler) ->

		if $(e.target).prev().hasClass('textarea')
			$(e.target).prev().focus()
			$('.textarea').removeClass('focus')
			$(e.target).prev().addClass('focus')
		else if $(e.target).prev().hasClass('wrap')
			$(e.target).prev().children('.textarea:last').focus()
			$('.textarea').removeClass('focus')
			$(e.target).prev().children('.textarea:last').addClass('focus')
		else 
			if $(e.target).parent().prev().hasClass('textarea')
				$(e.target).parent().prev().focus()
				$('.textarea').removeClass('focus')
				$(e.target).parent().prev().addClass('focus')
			else if $(e.target).parent().prev().hasClass('wrap')
				$('.textarea').removeClass('focus')
				$(e.target).parent().prev().addClass('focus')
				$(e.target).parent().prev().focus()

		if $(e.target).text() == ''
			if  $(e.target).siblings().length == 0
				$(e.target).parent().remove()
			else
				$(e.target).remove()



	key 'down', (e, handler) ->

		if $(e.target).next().hasClass('textarea')
			$('.textarea').removeClass('focus')
			$(e.target).next().addClass('focus')
			$(e.target).next().focus()
		else if $(e.target).next().hasClass('wrap')
			$(e.target).next().children('.textarea:first').focus()
			$('.textarea').removeClass('focus')
			$(e.target).next().children('.textarea:first').addClass('focus')
		else
			if $(e.target).parent().next().hasClass('textarea')
				$(e.target).parent().next().focus()
				$('.textarea').removeClass('focus')
				$(e.target).parent().next().addClass('focus')
			else if $(e.target).parent().next().hasClass('wrap')
				$(e.target).parent().next().focus()
				$('.textarea').removeClass('focus')
				$(e.target).parent().next().addClass('focus')
			else
				$(e.target).parent().parent().next().focus()
				$('.textarea').removeClass('focus')
				$(e.target).parent().parent().next().addClass('focus')