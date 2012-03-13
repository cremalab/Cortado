(function() {
  var ShortcutKeys, create_new_project, iterate_over_items, use_default_project,
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
      this.beans_json = project.get('beans').models[0].toJSON();
      return project.clean_up_json(this.beans_json);
    };

    ShortcutKeys.prototype.carriage_return = function(e) {
      return e.preventDefault();
    };

    ShortcutKeys.prototype.tab_key = function(e) {
      return e.preventDefault();
    };

    ShortcutKeys.prototype.lasso = function(e) {
      return e.preventDefault();
    };

    return ShortcutKeys;

  })(Backbone.Shortcuts);

  window.Project = Backbone.RelationalModel.extend({
    relations: [
      {
        type: Backbone.HasOne,
        key: 'bean',
        relatedModel: 'Bean',
        collectionType: 'Beans'
      }
    ],
    initialize: function() {
      var people,
        _this = this;
      _.bindAll(this, 'update_breadcrumb', 'clean_up_json');
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
    },
    clean_up_json: function(parent) {
      var i, _results;
      delete parent.view;
      i = 0;
      _results = [];
      while (i < parent.children.length) {
        this.clean_up_json(parent.children[i]);
        _results.push(i++);
      }
      return _results;
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

  create_new_project = function() {
    var bean;
    bean = new Bean;
    bean.url = '/add/project';
    bean.set({
      'content': 'Brand New Project'
    });
    return project.get('beans').add(bean);
  };

  use_default_project = function() {
    var bean,
      _this = this;
    bean = new Bean;
    bean.url = '/data/sample_project.json';
    return bean.fetch({
      success: function(data) {
        return project.get('beans').add(bean);
      }
    });
  };

  $(function() {
    var shortcuts;
    shortcuts = new ShortcutKeys;
    window.project = new Project;
    return create_new_project();
  });

}).call(this);
