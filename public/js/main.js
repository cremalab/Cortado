(function() {
  var ShortcutKeys, iterate_over_items,
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
      var all_data;
      e.preventDefault();
      console.log(project.get('beans').models[0]);
      all_data = JSON.stringify(project.get('beans').models[0].get('children'));
      return $.ajax({
        method: 'POST',
        url: '/add/project',
        data: 'project=' + all_data({
          success: function() {
            return console.log('yes');
          },
          error: function(err) {
            return console.log(err);
          }
        })
      });
    };

    ShortcutKeys.prototype.carriage_return = function(e) {
      return e.preventDefault();
    };

    ShortcutKeys.prototype.tab_key = function(e) {
      return e.preventDefault();
    };

    return ShortcutKeys;

  })(Backbone.Shortcuts);

  window.Project = Backbone.RelationalModel.extend({
    initialize: function() {
      var people,
        _this = this;
      _.bindAll(this, 'update_breadcrumb');
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
    },
    update_breadcrumb: function() {
      var _this = this;
      return setTimeout((function() {
        var element, html, i, new_crumb;
        $('#breadcrumb').find('ul').empty();
        element = $('.bean.focus');
        html = [];
        html.push('<li>' + element.find('.textarea').text() + '</li>');
        while (element.hasClass('bean')) {
          element = element.parent().prev();
          if (element.find('.textarea').length) {
            html.push('<li>' + element.find('.textarea').text() + '</li>');
          }
        }
        html.reverse();
        new_crumb = '';
        for (i in html) {
          new_crumb += html[i];
        }
        return $('#breadcrumb').find('ul').append(new_crumb);
      }), 10);
    }
  });

  iterate_over_items = function(parent) {
    var i, _results;
    if (parent.get('parent') === null) {
      console.debug(parent.get('content'), parent);
    }
    i = 0;
    parent = parent.get('children').models;
    _results = [];
    while (i < parent.length) {
      if (parent[i].get('children').models) {
        console.debug(parent[i].get('content'), parent[i]);
        iterate_over_items(parent[i]);
      }
      _results.push(i++);
    }
    return _results;
  };

  window.bean_debug = function() {
    return iterate_over_items(project.get('beans').models[0]);
  };

  $(function() {
    var bean, shortcuts;
    shortcuts = new ShortcutKeys;
    window.project = new Project;
    bean = new Bean;
    bean.url = '/add/project';
    bean.set({
      'content': 'Brand New Project'
    });
    return project.get('beans').add(bean);
  });

}).call(this);
