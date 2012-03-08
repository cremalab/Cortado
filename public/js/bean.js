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
      return _.bindAll(this, 'focus_me');
    };

    BeanView.prototype.handle_keys = function(e) {
      if (e.keyCode === 13) {
        if ($(this.el).text() !== '') return this.add_bean();
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
    };

    BeanView.prototype.add_hours_spent = function() {
      var current_char, delete_me, full_string, index, string_num, template,
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
        this.model.add_hours_spent(string_num);
        return setTimeout((function() {
          return $(_this.el).find('.hours').addClass('show');
        }), 10);
      }
    };

    BeanView.prototype.add_hours_estimated = function() {
      return console.log('est');
    };

    BeanView.prototype.key_record = function(code, shiftKey) {
      var person_selector,
        _this = this;
      if (code === 16) return false;
      if (code === 50 && shiftKey) {
        person_selector = new PersonSelector({
          collection: project.people
        });
        $(this.el).append(person_selector.render().el);
        setTimeout((function() {
          return $(_this.el).find('.person_selector').addClass('show');
        }), 10);
        return false;
      }
      this.last_four_keys.unshift(code);
      if (this.last_four_keys.length > 4) this.last_four_keys.pop();
      if (_.isEqual(this.last_four_keys, [83, 82, 72, 51])) {
        return this.add_hours_spent();
      } else if (_.isEqual(this.last_four_keys, [84, 83, 69, 51])) {
        return this.add_hours_estimated();
      }
    };

    BeanView.prototype.add_bean = function() {
      this.save_content();
      return this.model.get('parent').get('children').add(new Bean);
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
      _.bindAll(this, 'add_child', 'remove_child', 'add_hours_spent');
      this.on('change:my_hours_spent', function() {
        var parent, parents_hours, total_hours;
        total_hours = _this.get('my_hours_spent');
        _.each(_this.get('children').models, function(child) {
          return total_hours += child.get('hours_spent');
        });
        $(_this.get('view').el).find('.hrs_spent').text(total_hours);
        parent = _this.get('parent');
        if (parent !== null) {
          parents_hours = 0;
          _.each(parent.get('children').models, function(child) {
            return parents_hours += child.get('my_hours_spent');
          });
          parents_hours += parent.get('my_hours_spent');
          parent.set({
            'hours_spent': parents_hours
          });
          return $(parent.get('view').el).find('.hrs_spent').text(parents_hours);
        }
      });
      return this.on('change:hours_spent', function() {
        var parent, parents_hours;
        parent = _this.get('parent');
        if (parent !== null) {
          parents_hours = 0;
          _.each(parent.get('children').models, function(child) {
            return parents_hours += child.get('hours_spent');
          });
          parents_hours += parent.get('my_hours_spent');
          parent.set({
            'hours_spent': parents_hours
          });
          $(parent.get('view').el).find('.hrs_spent').text(parents_hours);
        }
        return $(_this.get('view').el).find('.hrs_spent').text(_this.get('hours_spent'));
      });
    },
    add_child: function(added_bean) {
      var view, wrap,
        _this = this;
      view = $(this.get('view').el);
      view.after('<div class="wrap"></div>');
      wrap = view.next();
      return _.each(this.get('children').models, function(bean) {
        wrap.append(bean.get('view').render().el);
        if (added_bean === bean) return bean.get('view').focus_me();
      });
    },
    remove_child: function() {
      var view, wrap,
        _this = this;
      view = $(this.get('view').el);
      wrap = view.next();
      wrap.empty();
      return _.each(this.get('beans').models, function(bean) {
        return wrap.append(bean.get('view').render().el);
      });
    },
    add_hours_spent: function(to_add) {
      var hours;
      hours = this.get('my_hours_spent') + parseInt(to_add);
      return this.set({
        'my_hours_spent': hours
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
            return bean.get('parent').add_child(bean);
          }), 10);
        }
        return bean_view.focus_me();
      });
    }
  });

}).call(this);
