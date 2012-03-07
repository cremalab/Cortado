(function() {
  var Project, ShortcutKeys, create_new_project,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ShortcutKeys = (function(_super) {

    __extends(ShortcutKeys, _super);

    function ShortcutKeys() {
      ShortcutKeys.__super__.constructor.apply(this, arguments);
    }

    ShortcutKeys.prototype.shortcuts = {
      '⌘+s': 'save_document',
      'enter': 'carriage_return',
      'tab': 'tab_key',
      'shift+tab': 'tab_key'
    };

    ShortcutKeys.prototype.save_document = function(e) {
      e.preventDefault();
      return project.save();
    };

    ShortcutKeys.prototype.carriage_return = function(e) {
      return e.preventDefault();
    };

    ShortcutKeys.prototype.tab_key = function(e) {
      return e.preventDefault();
    };

    return ShortcutKeys;

  })(Backbone.Shortcuts);

  Project = (function(_super) {

    __extends(Project, _super);

    function Project() {
      Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.initialize = function() {
      var people,
        _this = this;
      this.set({
        'beans': new Beans
      });
      this.get('beans').is_master = true;
      people = new Backbone.Collection;
      people.url = '/data/people.json';
      return people.fetch({
        success: function() {
          return _this.set({
            'people': people
          });
        }
      });
    };

    return Project;

  })(Backbone.Model);

  create_new_project = function() {
    var new_bean;
    window.project = new Project;
    new_bean = new Bean;
    return project.get('beans').add(new_bean);
  };

  $(function() {
    var shortcuts;
    shortcuts = new ShortcutKeys;
    return create_new_project();
  });

}).call(this);
