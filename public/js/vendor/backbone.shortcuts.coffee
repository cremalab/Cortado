Shortcuts = (options) ->
	@cid = _.uniqueId("backbone.shortcuts")
	@initialize.apply(@, arguments)
	@delegateShortcuts()

_.extend Shortcuts.prototype, Backbone.Events,
	initialize: ->
	delegateShortcuts: ->
		return unless @shortcuts
		for shortcut, callback of @shortcuts
			method = @[callback] unless _.isFunction(callback)
			throw new Error("Method #{callback} does not exist") unless method
			match = shortcut.match(/^(\S+)\s*(.*)$/)
			shortcutKey = match[1]
			scope = if match[2] == "" then "all" else match[2]
			key(shortcutKey, scope, method)

Backbone.Shortcuts = Shortcuts
Backbone.Shortcuts.extend = Backbone.View.extend