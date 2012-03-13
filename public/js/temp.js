  #Add me to my parent
  #If my previous sibling has children, add me after those please
  append_child_bean : (bean, at_index) ->

    unless $(@el).next().hasClass('wrap')
      $(@el).after('<div class="wrap"></div>')
    
    @childs_html = $('<div class="temp"></div>')
    @iterate_over_children(bean)

    closest_kin = $(@el).next().children('.bean').eq(at_index - 1)
    if !closest_kin.length
      $(@el).next().append(@childs_html)
    else if closest_kin.next().hasClass('wrap')
      closest_kin.after(@childs_html)
    else
      closest_kin.after(@childs_html)

    console.log @childs_html

    $(bean.get('view').el).find('.textarea').focus()


  iterate_over_children : (parent) ->

    children    = parent.get('children').models
    parent_view   = $(parent.get('view').render().el)
    wrap      = $('<div class="wrap"></div>')

    @childs_html.append(parent_view)

    if children.length
      @childs_html.append(wrap)

    i = 0
    while i < children.length
      @childs_html.find(wrap).append(children[i].get('view').render().el)
      @iterate_over_children(children[i])
      i++

