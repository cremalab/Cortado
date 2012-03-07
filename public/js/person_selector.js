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

    PersonSelector.prototype.initialize = function() {};

    PersonSelector.prototype.handle_keys = function() {
      if (e.keyCode === 38) {
        return this.go_up();
      } else if (e.keyCode === 40) {
        return this.go_down();
      }
    };

    PersonSelector.prototype.render = function() {
      this.template = _.template($('#person_selector').html(), this.model.toJSON());
      $(this.el).html(this.template);
      $(this.el).attr('contenteditable', true);
      return this;
    };

    return PersonSelector;

  })(Backbone.View);

}).call(this);
