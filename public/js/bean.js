(function() {
  var BeanView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BeanView = (function(_super) {

    __extends(BeanView, _super);

    function BeanView() {
      BeanView.__super__.constructor.apply(this, arguments);
    }

    BeanView.prototype.className = 'bean';

    BeanView.prototype.events = {
      'keyup': 'handle_keys'
    };

    BeanView.prototype.initialize = function() {
      this.last_four_keys = [];
      return _.bindAll(this, 'focus_me', 'add_user', 'append_child_bean', 'change_hours_spent', 'update_hours_spent');
    };

    BeanView.prototype.handle_keys = function(e) {
      if (!this.person_selector) {
        if (e.keyCode === 13) {
          if ($(this.el).find('.textarea').text().length > 1) {
            this.save_content();
            return this.model.get('parent').get('children').add(new Bean);
          }
        } else if (e.keyCode === 9 && e.shiftKey === true) {
          return this.tab_back($(this.el));
        } else if (e.keyCode === 9) {
          return this.tab_over();
        } else if (e.keyCode === 38) {
          return this.go_up();
        } else if (e.keyCode === 40) {
          return this.go_down();
        } else {
          return this.key_record(e.keyCode, e.shiftKey);
        }
      }
    };

    BeanView.prototype.change_hours_spent = function() {
      var current_char, delete_me, full_string, hours, index, string_num, template,
        _this = this;
      full_string = $(this.el).find('.textarea').text();
      index = full_string.search('#hrs') - 1;
      current_char = parseInt(full_string.charAt(index));
      string_num = '';
      while (isFinite(current_char)) {
        string_num = current_char + string_num;
        current_char = parseInt(full_string.charAt(index -= 1));
      }
      if (isFinite(parseInt(string_num))) {
        template = "<div class='hours'>" + string_num + "</div>";
        delete_me = string_num + '#hrs';
        full_string = full_string.replace(delete_me, ' ');
        $(this.el).find('.textarea').text(full_string);
        $(this.el).find('.hour_wrap').append(template);
        setTimeout((function() {
          return $(_this.el).find('.hours').addClass('show');
        }), 10);
        hours = this.model.get('my_hours_spent') + parseInt(string_num);
        return this.model.set({
          'my_hours_spent': hours
        });
      }
    };

    BeanView.prototype.change_hours_estimated = function() {};

    BeanView.prototype.update_hours_spent = function(hrs) {
      return $(this.el).find('.hrs_spent').text(hrs);
    };

    BeanView.prototype.update_hours_estimated = function(hrs) {
      return $(this.el).find('.hrs_total').text(hrs);
    };

    BeanView.prototype.add_user = function(user) {
      var img_path, name, template, wrap,
        _this = this;
      wrap = $(this.el).find('.people');
      name = user.get('name');
      img_path = user.get('img_path');
      template = "<div class='user_photo'><img class='user' src=/img/" + img_path + " alt=" + name + " /></div>";
      wrap.append(template);
      return setTimeout((function() {
        return $(_this.el).find('.user').addClass('show');
      }), 10);
    };

    BeanView.prototype.key_record = function(code, shiftKey) {
      var _this = this;
      if (code === 16) return false;
      if (code === 50 && shiftKey) {
        this.person_selector = new PersonSelector({
          collection: project.get('people'),
          parent: this
        });
        $(this.el).find('.textarea').append(this.person_selector.render().el);
        $(this.el).find('.person_selector').find('li:first-child').addClass('selected');
        $(this.el).find('.person_selector').find('input').focus();
        setTimeout((function() {
          return $(_this.el).find('.person_selector').addClass('show');
        }), 10);
      }
      this.last_four_keys.unshift(code);
      if (this.last_four_keys.length > 4) this.last_four_keys.pop();
      if (_.isEqual(this.last_four_keys, [83, 82, 72, 51])) {
        return this.change_hours_spent();
      } else if (_.isEqual(this.last_four_keys, [84, 83, 69, 51])) {
        return this.change_hours_estimated();
      }
    };

    BeanView.prototype.append_child_bean = function(bean) {
      var new_bean;
      if (!$(this.el).next().hasClass('wrap')) {
        $(this.el).after('<div class="wrap"></div>');
      }
      new_bean = bean.get('view').render().el;
      $(this.el).next().append(new_bean);
      return $(new_bean).find('.textarea').focus();
    };

    BeanView.prototype.tab_over = function() {
      var current_parent, new_parent, this_index;
      if (this.model !== this.model.collection.models[0]) {
        this.save_content();
        current_parent = this.model.get('parent').get('children');
        this_index = _.indexOf(current_parent.models, this.model);
        return new_parent = current_parent.models[this_index - 1].get('children').add(this.model);
      }
    };

    BeanView.prototype.tab_back = function() {
      if (this.model.get('parent')) {
        this.save_content();
        return this.model.get('parent').get('parent').get('children').add(this.model);
      }
    };

    BeanView.prototype.go_up = function() {
      if ($(this.el).prev().hasClass('bean')) {
        return this.focus_me($(this.el).prev());
      } else if ($(this.el).prev().hasClass('wrap')) {
        return this.focus_me($(this.el).prev().children('.bean:last'));
      } else if ($(this.el).parent().prev().hasClass('bean')) {
        return this.focus_me($(this.el).parent().prev());
      } else if ($(this.el).parent().prev().hasClass('wrap')) {
        return this.focus_me($(this.el).parent().prev().children('.bean:last'));
      } else {
        return false;
      }
    };

    BeanView.prototype.go_down = function() {
      var parent;
      if ($(this.el).next().hasClass('bean')) {
        return this.focus_me($(this.el).next());
      } else if ($(this.el).next().hasClass('wrap')) {
        return this.focus_me($(this.el).next().children('.bean:first'));
      } else {
        parent = $(this.el).parent();
        while (!(parent.next().hasClass('bean')) || !(parent.next().hasClass('wrap'))) {
          if (parent.attr('id') === 'cortado') break;
          parent = parent.parent();
        }
        if (parent.attr('id') !== 'cortado') {
          return this.focus_me(parent.next().children('.bean:first'));
        }
      }
    };

    BeanView.prototype.save_content = function() {
      return this.model.set({
        content: $(this.el).find('.textarea').text()
      });
    };

    BeanView.prototype.focus_me = function(el) {
      if (el == null) el = $(this.el);
      $('.bean').removeClass('focus');
      el.addClass('focus');
      return el.find('.textarea').focus();
    };

    BeanView.prototype.render = function() {
      this.template = _.template($('#bean').html(), this.model.toJSON());
      $(this.el).html(this.template);
      return this;
    };

    return BeanView;

  })(Backbone.View);

  window.Bean = Backbone.RelationalModel.extend({
    relations: [
      {
        type: Backbone.HasMany,
        key: 'children',
        relatedModel: 'Bean',
        collectionType: 'Beans',
        reverseRelation: {
          key: 'parent',
          type: Backbone.HasOne
        }
      }
    ],
    defaults: {
      content: '',
      people: [],
      keywords: [],
      my_hours_est: 0,
      my_hours_spent: 0,
      hours_est: 0,
      hours_spent: 0
    },
    initialize: function() {
      var _this = this;
      this.set({
        view: new BeanView({
          model: this
        })
      });
      _.bindAll(this, 'remove_bean', 'add_user', 'update_hours_spent', 'update_hours_estimated');
      this.on('change:my_hours_spent', function() {
        var parent;
        if (!_this.get('children').models.length) {
          _this.set({
            'hours_spent': _this.get('my_hours_spent')
          });
        }
        parent = _this.get('parent');
        if (parent !== null) {
          return parent.update_hours_spent();
        } else {
          return _this.update_hours_spent();
        }
      });
      return this.on('change:hours_spent', function() {
        var parent;
        _this.get('view').update_hours_spent(_this.get('hours_spent'));
        parent = _this.get('parent');
        if (parent !== null) return parent.update_hours_spent();
      });
    },
    update_hours_spent: function() {
      var new_hours;
      new_hours = this.get('my_hours_spent');
      _.each(this.get('children').models, function(child) {
        if (child.get('children').models.length) {
          return new_hours += child.get('hours_spent');
        } else {
          return new_hours += child.get('my_hours_spent');
        }
      });
      return this.set({
        'hours_spent': new_hours
      });
    },
    update_hours_estimated: function() {},
    remove_bean: function() {
      var view, wrap,
        _this = this;
      view = $(this.get('view').el);
      wrap = view.next();
      wrap.empty();
      return _.each(this.get('beans').models, function(bean) {
        return wrap.append(bean.get('view').render().el);
      });
    },
    add_user: function(uid) {
      var _this = this;
      uid = parseInt(uid);
      return _.each(project.get('people').models, function(person) {
        if (person.get('uid') === uid) return _this.get('view').add_user(person);
      });
    }
  });

  window.Beans = Backbone.Collection.extend({
    initialize: function() {
      var _this = this;
      return this.on('add', function(bean) {
        var bean_view;
        bean_view = bean.get('view');
        if (_this.is_master === true) {
          $('#cortado').find('.wrap').append(bean_view.render().el);
        } else {
          setTimeout((function() {
            return bean.get('parent').get('view').append_child_bean(bean);
          }), 10);
        }
        return bean_view.focus_me();
      });
    }
  });

}).call(this);
