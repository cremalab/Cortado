class BeanView extends Backbone.View
	className : 'bean'
	events :
		'keyup': 'handle_keys'


	initialize : ->
		@last_four_keys	= []
		_.bindAll @,
			'focus_me'
			'add_user'
			'change_hours_spent'
			'update_hours_spent'


	handle_keys : (e) ->
		if !@person_selector
			if e.keyCode == 13
				if $(@el).text() != '' then @add_bean()
			else if e.keyCode == 9 && e.shiftKey == true
				@tab_back($(@el))
			else if e.keyCode == 9 then @tab_over()
			else if e.keyCode == 38 then @go_up()
			else if e.keyCode == 40 then @go_down()
			else @key_record(e.keyCode, e.shiftKey)


	change_hours_spent : ->
		full_string 		= $(@el).find('.textarea').text()
		index		= full_string.search('#hrs') - 1
		current_char	= parseInt(full_string.charAt(index))
		string_num	= ''

		while isFinite(current_char)
			string_num   = current_char + string_num
			current_char = parseInt(full_string.charAt(index-=1))

		if isFinite(parseInt(string_num))
			#TODO - this should be it's own backbone view so we can delete them later
			template = "<div class='hours'>#{string_num}</div>"
			delete_me = string_num + '#hrs'
			full_string = full_string.replace(delete_me, ' ')

			$(@el).find('.textarea').text(full_string)
			$(@el).find('.hour_wrap').append(template)

			#TODO - would be neat to have this more of a utility function. hate this syntax...
			setTimeout (=> $(@el).find('.hours').addClass('show') ), 10

			hours = @model.get('my_hours_spent')  + parseInt(string_num)
			@model.set('my_hours_spent' : hours)


	change_hours_estimated : ->


	update_hours_spent : (hrs) ->
		$(@el).find('.hrs_spent').text(hrs)
	update_hours_estimated : (hrs) ->
		$(@el).find('.hrs_total').text(hrs)

	add_user : (user) ->
		#TODO - this actually needs 
		wrap 		= $(@el).find('.people')
		name		= user.get('name')
		img_path	= user.get('img_path')
		template 	= "<div class='user_photo'><img class='user' src=/img/#{img_path} alt=#{name} /></div>"

		wrap.append template
		setTimeout (=> $(@el).find('.user').addClass('show') ), 10


	key_record : (code, shiftKey) ->
		if code == 16 then return false

		if code == 50 && shiftKey
			@person_selector = new PersonSelector
				collection 	: project.get('people')
				parent 	: @

			$(@el).find('.textarea').append(@person_selector.render().el)
			$(@el).find('.person_selector').find('li:first-child').addClass('selected')
			$(@el).find('.person_selector').find('input').focus()

			setTimeout (=>  $(@el).find('.person_selector').addClass('show') ), 10

		@last_four_keys.unshift(code)
		if @last_four_keys.length > 4
			@last_four_keys.pop()

		if _.isEqual(@last_four_keys, [83, 82, 72, 51])
			@change_hours_spent()

		else if _.isEqual(@last_four_keys, [84, 83, 69, 51])
			@change_hours_estimated()
			

	add_bean : ->
		@save_content()
		@model.get('parent').get('children').add(new Bean)

	tab_over : ->
		if @model != @model.collection.models[0] 
			@save_content()
			current_parent	= @model.get('parent').get('children')
			this_index	 	= _.indexOf(current_parent.models, @model)
			new_parent 	= current_parent.models[this_index - 1].get('children').add(@model)


	tab_back : ->
		if @model.get('parent')
			@save_content()
			@model.get('parent').get('parent').get('children').add(@model)


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




window.Bean = Backbone.RelationalModel.extend(
	
	relations : [
		type			: Backbone.HasMany
		key 			: 'children'
		relatedModel 	: 'Bean'
		collectionType 	: 'Beans'
		reverseRelation	:
			key 		: 'parent'
			type 		: Backbone.HasOne
	]
	
	defaults :
		content 		: ''
		people 		: []
		keywords 		: []
		my_hours_est 	: 0
		my_hours_spent	: 0
		hours_est 		: 0
		hours_spent 	: 0

	initialize : ->

		@set(view : new BeanView(model : @))

		_.bindAll @,
			'add_bean'
			'remove_bean'
			'add_user'
			'update_hours_spent'
			'update_hours_estimated'

		@on 'change:my_hours_spent',  =>
			if !@get('children').models.length
				@set('hours_spent' : @get('my_hours_spent'))

			parent = @get('parent')
			if parent != null
				parent.update_hours_spent()
			else
				@update_hours_spent()

		@on 'change:hours_spent', =>
			@get('view').update_hours_spent(@get('hours_spent'))
			parent = @get('parent')
			if parent != null then parent.update_hours_spent()


	update_hours_spent : ->
		new_hours = @get('my_hours_spent')
		_.each @get('children').models, (child) ->
			if child.get('children').models.length
				new_hours += child.get('hours_spent')
			else
				new_hours += child.get('my_hours_spent')

		@set('hours_spent' : new_hours)

	update_hours_estimated : ->


	add_bean : (added_bean) ->
		view = $(@get('view').el)

		#TODO - this actually isn't working right yet
		view.after('<div class="wrap"></div>')
		wrap = view.next()

		_.each @get('children').models, (bean) =>
			wrap.append(bean.get('view').render().el)
			if added_bean == bean
				bean.get('view').focus_me()

	remove_bean : ->
		view = $(@get('view').el)
		wrap = view.next()
		wrap.empty()
		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)

	add_user : (uid) ->
		uid	= parseInt(uid)
		_.each project.get('people').models, (person) =>
			if person.get('uid') == uid  then @get('view').add_user(person)
)


window.Beans = Backbone.Collection.extend(

	initialize : ->
		@on 'add', (bean) =>
			bean_view 	= bean.get('view')
			if @is_master == true
				$('#cortado').find('.wrap').append(bean_view.render().el)
			else
				#TODO - this is a major design flaw. See Backbone relational documentation and fix at some point
				setTimeout (=>  bean.get('parent').add_bean(bean) ), 10

			bean_view.focus_me()
)