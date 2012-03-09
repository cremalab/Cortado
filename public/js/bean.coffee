###
TODO
* update hours on tab in and tab out
* get up and down arrows working properly
###


class BeanView extends Backbone.View
	className : 'bean'
	events :
		'keyup'	: 'handle_keys'
		'click'		: 'handle_focus'


	initialize : ->
		@last_four_keys	= []
		_.bindAll @,
			'focus_me'
			'append_user'
			'append_child_bean'
			'update_hours_spent'

	handle_focus : ->
		#TODO - this is stupid. By default backbone passes the event
		# as the first parameter. This will just strip out the param and 
		# pass it to the next function
		@focus_me()


	handle_keys : (e) ->
		if !@person_selector
			if e.keyCode == 13
				if $(@el).find('.textarea').text().length > 1
					@save_content()
					if @model.get('parent') != null
						@model.get('parent').get('children').add(new Bean)
					else
						@model.get('children').add(new Bean)
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


	append_child_bean : (bean) ->
		unless $(@el).next().hasClass('wrap')
			$(@el).after('<div class="wrap"></div>')
		
		new_bean = bean.get('view').render().el
		$(@el).next().append(new_bean)
		$(new_bean).find('.textarea').focus()

	append_user : (user) ->
		#TODO - this actually needs  to work
		wrap 		= $(@el).find('.people')
		name		= user.get('name')
		img_path	= user.get('img_path')
		template 	= "<div class='user_photo'><img class='user' src=/img/#{img_path} alt=#{name} /></div>"
		wrap.append template
		setTimeout (=> $(@el).find('.user').addClass('show') ), 10

	tab_over : ->
		if @model.collection != null
			if @model != @model.collection.models[0] 
				@save_content()
				current_parent	= @model.get('parent').get('children')
				this_index	 	= _.indexOf(current_parent.models, @model)
				new_parent 	= current_parent.models[this_index - 1].get('children').add(@model)

	tab_back : ->
		if @model.get('parent').get('parent') != null
			@save_content()
			if $(@el).parent().children().length == 1
				wrap = $(@el).parent()
				setTimeout (=> wrap.remove() ), 1000
			@model.get('parent').get('parent').get('children').add(@model)


	go_up : ->
		if $(@el).prev('.bean').length 
			@focus_me($(@el).prev('.bean'))
		else if $(@el).prev().prev('.bean').length
			@focus_me($(@el).prev().prev('.bean'))
		else if $(@el).parent().hasClass('wrap')
			@focus_me($(@el).parent().prev('.bean'))
		else return false

	go_down : ->
		if $(@el).next().hasClass('bean') then @focus_me($(@el).next())
		else if $(@el).next().hasClass('wrap') then @focus_me($(@el).next().children('.bean:first'))

		else
			el = $(@el).parent()
			re_focus = true
			while (!(el.next('.bean')).length)
				if el.attr('id') == 'cortado' 
					re_focus = false
					break
				else 
					el = el.parent()
					re_focus = true

			if re_focus 
				@focus_me(el.next())

	save_content : ->
		@model.set(content : $(@el).find('.textarea').text())

	focus_me : (el = $(@el)) ->
		$('.bean').removeClass('focus')
		el.addClass('focus')
		el.find('.textarea').focus()

	render : ->
		@template = _.template($('#bean').html(), @model.toJSON())
		#TODO - make this a new instance of a view
		other_html = ''
		_.each @model.get('people').models, (person) ->
			img_path 	= person.get('img_path')
			name 	= person.get('name')
			template 	= "<div class='user_photo'><img class='user show' src=/img/#{img_path} alt=#{name} /></div>"
			other_html += template
		$(@el).html(@template)
		$(@el).find('.people').append(other_html)

		#TODO - probably shouldn't go here, but not sure how to do this yet
		if @model.get('my_hours_spent') == 0
			$(@el).find('.hour_wrap').find('.hours').remove()
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
		people 		: ''
		keywords 		: []
		my_hours_est 	: 0
		my_hours_spent	: 0
		hours_est 		: 0
		hours_spent 	: 0

	initialize : ->
		#setting the people in the defaults will some how magically
		#duplicate the people from the parents MAGIC!
		@set(people : new Backbone.Collection)
		@set(view : new BeanView(model : @))

		_.bindAll @,
			'update_hours_spent'
			'update_hours_estimated'

		@get('people').on 'add', (person) =>
			@get('view').append_user(person)

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


	remove_bean : ->
		view = $(@get('view').el)
		wrap = view.next()
		wrap.empty()
		_.each @get('beans').models, (bean) =>
			wrap.append(bean.get('view').render().el)
)


window.Beans = Backbone.Collection.extend(

	initialize : ->
		@on 'add', (bean) =>
			bean_view 	= bean.get('view')
			if @is_master == true
				$('#cortado').append(bean_view.render().el)
			else
				#TODO - this is a MAJOR design flaw. See Backbone relational documentation and fix at some point
				#when I have a really bad bug and don't know wtf is going on.... it'l be this.
				setTimeout (=>  bean.get('parent').get('view').append_child_bean(bean) ), 10

			bean_view.focus_me()
)