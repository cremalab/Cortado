(function() {

  $(function() {
    $('.textarea').focus();
    $('.textarea').live('click', function(e) {
      if ($(e.target).next().hasClass('wrap')) {
        return $(e.target).next().slideToggle();
      }
    });
    /*
    	key 'shift+3', (e, handler) ->
    		new_text = ''
    		$(e.target).bind 'keyup', (event) ->
    			console.log event
    			if event.keyCode != 51 || event.keyCode != 16
    				
    		#$(e.target).unbind('keyup')
    		#$(e.target).append('<div class="hours">X hours</div> something')
    
    	#key 'shift+3', (e, handler) ->
    		#$(e.target).append('<div class="hours">X hours</div> something')
    */
    key('enter', function(e, handler) {
      e.preventDefault();
      $(e.target).parent().append('<div class="textarea"  contenteditable="true"></div>');
      $(e.target).next().focus();
      if ($(e.target).text() === '') {
        if ($(e.target).siblings().length === 0) {
          return $(e.target).parent().remove();
        } else {
          return $(e.target).remove();
        }
      }
    });
    key('tab', function(e, handler) {
      var prev;
      e.preventDefault();
      prev = $(e.target).prev();
      if (prev.length) {
        if (prev.hasClass('wrap')) {
          $(e.target).remove();
          prev.append($(e.target));
          return $(e.target).focus();
        } else {
          $(e.target).wrap('<div class="wrap"></div>');
          return $(e.target).focus();
        }
      }
    });
    key('shift+tab', function(e, handler) {
      var parent;
      e.preventDefault();
      if ($(e.target).parent().parent().attr('id') !== 'cortado') {
        if ($(e.target).siblings().length) {
          parent = $(e.target).parent().parent();
          $(e.target).remove();
          parent.append($(e.target));
          $(e.target).focus();
        } else {
          $(e.target).unwrap();
        }
        return $(e.target).focus();
      }
    });
    key('up', function(e, handler) {
      if ($(e.target).prev().hasClass('textarea')) {
        $(e.target).prev().focus();
      } else if ($(e.target).prev().hasClass('wrap')) {
        $(e.target).prev().children('.textarea:last').focus();
      } else {
        if ($(e.target).parent().prev().hasClass('textarea')) {
          $(e.target).parent().prev().focus();
        } else if ($(e.target).parent().prev().hasClass('wrap')) {
          $(e.target).parent().prev().focus();
        }
      }
      if ($(e.target).text() === '') {
        if ($(e.target).siblings().length === 0) {
          return $(e.target).parent().remove();
        } else {
          return $(e.target).remove();
        }
      }
    });
    return key('down', function(e, handler) {
      if ($(e.target).next().hasClass('textarea')) {
        return $(e.target).next().focus();
      } else if ($(e.target).next().hasClass('wrap')) {
        return $(e.target).next().children('.textarea:first').focus();
      } else {
        if ($(e.target).parent().next().hasClass('textarea')) {
          return $(e.target).parent().next().focus();
        } else if ($(e.target).parent().next().hasClass('wrap')) {
          return $(e.target).parent().next().focus();
        } else {
          return $(e.target).parent().parent().next().focus();
        }
      }
    });
  });

}).call(this);
