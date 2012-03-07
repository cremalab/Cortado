class BeanView extends Backbone.View
	className : 'bean'
	events :
		'keyup': 'handle_keys'

	initialize : ->
		@last_four_keys	= []

	#TODO - this should be able to extend off of the Shortcut Keys instead of here
	handle_keys : (e) ->

		if e.keyCode == 13
			if $(@el).text() != '' then @add_bean()
		else if e.keyCode == 9 && e.shiftKey == true
			@tab_back($(@el))
		else if e.keyCode == 9
			@tab_over()
		else if e.keyCode == 38
			@go_up()
		else if e.keyCode == 40
			@go_down()
		else
			@key_record(e.keyCode, e.shiftKey)

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

	add_bean : ->
		@save_content()
		new_bean = new Bean
		new_bean.set('parent' : @model.get('parent'))
		@model.collection.add(new_bean)

	tab_over : ->
		if @model != @model.collection.models[0] 

			@save_content()

			all_models	= @model.collection.models
			this_index 	= _.indexOf(all_models, @model)
			parent 	= all_models[this_index - 1]

			@model.collection.remove(@model)
			@model.set('parent' : parent)
			parent.get('beans').add(@model)

	tab_back : ->
		@model.set(content : $(@el).html())
		@model.collection.remove(@model)
		#@model.get('parent').add(@model)

	go_up : ->
		if $(@el).prev().hasClass('bean')
			$(@el).prev().focus()

		else if $(@el).prev().hasClass('wrap')
			#TODO - this should probably be more complicated
			$(@el).prev().children('.bean:last').focus()

		else if $(@el).parent().prev().hasClass('bean')
			$(@el).parent().prev().focus()
		
		else if $(@el).parent().prev().hasClass('wrap')
			$(@el).parent().prev().children('.bean:last').focus()

		else return false

	go_down : ->
		if $(@el).next().hasClass('bean')
			$(@el).next().focus()

		else if $(@el).next().hasClass('wrap')
			$(@el).next().children('.bean:first').focus()

		else
			parent = $(@el).parent()
			while (!(parent.next().hasClass('bean')) || !(parent.next().hasClass('wrap')))
				if parent.attr('id') == 'cortado' then break
				parent = parent.parent()
			
			if parent.attr('id') != 'cortado' 
				parent.next().children('.bean:first').focus()

	save_content : ->
		@model.set(content : $(@el).html())

	render : ->
		@template = _.template($('#bean').html(), @model.toJSON())
		$(@el).html(@template)
		$(@el).attr('contenteditable', true)
		return @


class window.Bean extends Backbone.Model
	
	defaults :
		parent : ''
		content : ''

	initialize : ->
		@set(beans : new Beans)
		@set(view : new BeanView(model : @))

		_.bindAll @,
			'add_child',
			'remove_child'

	add_child : (added_bean) ->
		view = $(@get('view').el)

		unless view.next().hasClass('wrap')
			view.after('<div class="wrap"></div>')

		wrap = view.next()
		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)
			if added_bean == bean
				$(bean.get('view').el).focus()

	remove_child : ->
		view = $(@get('view').el)
		wrap = view.next()
		wrap.empty()
		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)



class window.Beans extends Backbone.Collection
	initialize : ->
		@on 'add', (bean) =>
			bean_view 	= bean.get('view').render().el
			if @is_master == true
				$('#cortado').find('.wrap').append(bean_view)
			else
				bean.get('parent').add_child(bean)
			$(bean_view).focus()