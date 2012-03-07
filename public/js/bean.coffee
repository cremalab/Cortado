class BeanView extends Backbone.View
	className : 'bean'
	events :
		'keyup': 'handle_keys'

	initialize : ->
		@last_four_keys	= []
		_.bindAll @,
			'focus_me',

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

	add_hours_spent : ->
		full_string 		= $(@el).find('.textarea').text()
		index		= full_string.search('#hrs') - 1
		current_char	= parseInt(full_string.charAt(index))
		string_num	= ''

		while isFinite(current_char)
			string_num   = current_char + string_num
			current_char = parseInt(full_string.charAt(index-=1))

		if isFinite(parseInt(string_num))
			#TODO - this should be it's own backbone view so we can delete them later
			template = "<div class='hours'>#{string_num} hours</div>"
			delete_me = string_num + '#hrs'
			full_string = full_string.replace(delete_me, ' ')

			$(@el).find('.textarea').text(full_string)
			$(@el).find('.hour_wrap').append(template)

			$(@el).find('.hrs_spent').text(@model.add_hours_spent(string_num))

			#TODO - would be neat to have this more of a utility function. hate this syntax...
			setTimeout (=> $(@el).find('.hours').addClass('show') ), 10


	add_hours_estimated : ->
		console.log 'est'


	key_record : (code, shiftKey) ->
		if code == 16 then return false

		if code == 50 && shiftKey
			person_selector = new PersonSelector( collection : project.people)
			$(@el).append(person_selector.render().el)
			setTimeout (=>
				$(@el).find('.person_selector').addClass('show')
			), 10
			return false

		@last_four_keys.unshift(code)
		if @last_four_keys.length > 4
			@last_four_keys.pop()

		if _.isEqual(@last_four_keys, [83, 82, 72, 51])
			@add_hours_spent()

		else if _.isEqual(@last_four_keys, [84, 83, 69, 51])
			@add_hours_estimated()
			

	add_bean : ->
		@save_content()
		new_bean = new Bean
		new_bean.set('parent' : @model.get('parent'))
		@model.collection.add(new_bean)

	tab_over : ->
		if @model != @model.collection.models[0] 
			#TODO - look into using backbone relational
			@save_content()

			all_models	= @model.collection.models
			this_index 	= _.indexOf(all_models, @model)
			parent 	= all_models[this_index - 1]

			@model.collection.remove(@model)
			@model.set('parent' : parent)
			parent.get('beans').add(@model)

	tab_back : ->
		@save_content()
		
		if @model.get('parent') != ''
			#TODO - look into using backbone relational
			double = @model.get('parent').get('parent')
			single = @model.get('parent')
			@model.get('parent').get('beans').remove(@model)
			@model.set('parent' : double)
			single.collection.add(@model)

	go_up : ->
		if $(@el).prev().hasClass('bean')
			@focus_me($(@el).prev())

		else if $(@el).prev().hasClass('wrap')
			#TODO - this should probably be more complicated
			@focus_me($(@el).prev().children('.bean:last'))

		else if $(@el).parent().prev().hasClass('bean')
			@focus_me($(@el).parent().prev())
		
		else if $(@el).parent().prev().hasClass('wrap')
			@focus_me($(@el).parent().prev().children('.bean:last'))

		else return false

	go_down : ->
		if $(@el).next().hasClass('bean')
			@focus_me($(@el).next())

		else if $(@el).next().hasClass('wrap')
			@focus_me($(@el).next().children('.bean:first'))

		else
			parent = $(@el).parent()
			while (!(parent.next().hasClass('bean')) || !(parent.next().hasClass('wrap')))
				if parent.attr('id') == 'cortado' then break
				parent = parent.parent()
			
			if parent.attr('id') != 'cortado' 
				@focus_me(parent.next().children('.bean:first'))

	save_content : ->
		@model.set(content : $(@el).find('.textarea').text())

	focus_me : (el = $(@el)) ->
		$('.bean').removeClass('focus')
		el.addClass('focus')
		el.find('.textarea').focus()

	render : ->
		@template = _.template($('#bean').html(), @model.toJSON())
		$(@el).html(@template)
		return @


class window.Bean extends Backbone.Model
	
	defaults :
		parent : ''
		content : ''
		hours_estimated : 0
		hours_spent : 0

	initialize : ->
		@set(beans : new Beans)
		@set(view : new BeanView(model : @))

		_.bindAll @,
			'add_child',
			'remove_child'
			'add_hours_spent'

	add_child : (added_bean) ->
		view = $(@get('view').el)

		#unless view.next().hasClass('wrap')
		view.find('.wrap').remove()
		view.after('<div class="wrap"></div>')
		wrap = view.next()

		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)
			if added_bean == bean
				bean.get('view').focus_me()

	remove_child : ->
		view = $(@get('view').el)
		wrap = view.next()
		wrap.empty()
		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)

	add_hours_spent : (to_add) ->
		hours = @get('hours_spent')  + parseInt(to_add)
		@set('hours_spent' : hours)
		return hours




class window.Beans extends Backbone.Collection
	initialize : ->
		@on 'add', (bean) =>
			bean_view 	= bean.get('view')
			if @is_master == true
				$('#cortado').find('.wrap').append(bean_view.render().el)
			else
				bean.get('parent').add_child(bean)

			bean_view.focus_me()