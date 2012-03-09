(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.PersonSelector = (function(_super) {

    __extends(PersonSelector, _super);

    function PersonSelector() {
      PersonSelector.__super__.constructor.apply(this, arguments);
    }

    PersonSelector.prototype.className = 'person_selector';

    PersonSelector.prototype.events = {
      'keyup': 'handle_keys'
    };

    PersonSelector.prototype.initialize = function() {
      return this.parent = this.options.parent;
    };

    PersonSelector.prototype.handle_keys = function(e) {
      if (e.keyCode === 27) {
        return this.delete_me();
      } else if (e.keyCode === 13) {
        return this.add_me();
      } else if (e.keyCode === 38) {
        return this.go_up();
      } else if (e.keyCode === 40) {
        return this.go_down();
      } else {
        return this.determine_match();
      }
    };

    PersonSelector.prototype.determine_match = function() {
      var input_text,
        _this = this;
      input_text = this.input.val();
      return $.each($(this.el).find('li'), function(i, item) {
        var name;
        name = $(item).find('.name').text();
        if (!_this.string_is_part_of_string(input_text, name)) {
          return $(item).hide();
        } else {
          return $(item).show();
        }
      });
    };

    PersonSelector.prototype.add_me = function() {
      var this_guy,
        _this = this;
      this_guy = parseInt(this.get_selected().find('.uid').text());
      _.each(project.get('people').models, function(person) {
        if (person.get('uid') === this_guy) {
          return _this.parent.model.get('people').add(person);
        }
      });
      return this.delete_me();
    };

    PersonSelector.prototype.delete_me = function() {
      var _this = this;
      $(this.el).removeClass('show');
      return setTimeout((function() {
        $(_this.el).remove();
        return _this.parent.person_selector = null;
      }), 500);
    };

    PersonSelector.prototype.go_up = function() {
      var selected;
      selected = this.get_selected();
      if (selected.prev().length) {
        return selected.removeClass('selected').prev().addClass('selected');
      } else {
        return selected.removeClass('selected').parent().find('li:last-child').addClass('selected');
      }
    };

    PersonSelector.prototype.go_down = function() {
      var selected;
      selected = this.get_selected();
      if (selected.next().length) {
        return selected.removeClass('selected').next().addClass('selected');
      } else {
        return selected.removeClass('selected').parent().find('li:first-child').addClass('selected');
      }
    };

    PersonSelector.prototype.get_selected = function() {
      return $(this.el).find('ul').find('li.selected');
    };

    PersonSelector.prototype.string_is_part_of_string = function(sub, long) {
      sub = sub.toLowerCase();
      long = long.toLowerCase();
      if (long.indexOf(sub) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    PersonSelector.prototype.render = function() {
      var html,
        _this = this;
      html = '<input type="text" /><ul>';
      _.each(this.collection.models, function(person, i) {
        return html += _.template($('#barista').html(), person.attributes);
      });
      html += '</ul>';
      $(this.el).html(html);
      $(this.el).attr('contenteditable', false);
      this.input = $(this.el).find('input');
      return this;
    };

    return PersonSelector;

  })(Backbone.View);

}).call(this);
