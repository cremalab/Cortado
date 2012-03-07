key_record : (code, shiftKey) ->
		if code == 16 then return false
		if code == 51 && shiftKey then code = '#'

		if code == 50 && shiftKey
			some_html = $('#hidden').html()
			$(@el).append(some_html)
			setTimeout (=>
				$(@el).find('.person_selector').addClass('show')
			), 10
			return false

		@last_four_keys.unshift(code)
		if @last_four_keys.length > 4
			@last_four_keys.pop()

		if _.isEqual(@last_four_keys, [83, 82, 72, "#"])
			full_string 		= $(@el).text()
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
				$(@el).html(full_string)
				setTimeout (=>
					$(@el).find('.hours').addClass('show')
				), 10
				add_to_hours(parseInt(string_num))