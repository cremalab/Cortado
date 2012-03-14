$ ->
	shortcuts = new ShortcutKeys

	if !window.project
		window.project 	= new Project
		bean 			= new Bean
		bean.url 		= '/add/project'

		bean.set('content' : 'Brand New Project')
		project.get('beans').add bean

iterate_over_items = (parent) ->
	if parent.get('parent') == null
		console.debug parent.get('content'), parent
	
	i = 0
	parent = parent.get('children').models
	while i < parent.length		
		if parent[i].get('children').models
			console.debug parent[i].get('content'), parent[i]
			iterate_over_items(parent[i])
		i++


window.bean_debug = ->
	iterate_over_items(project.get('beans').models[0])