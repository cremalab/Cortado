
/*
TODO
* update hours on tab in and tab out
* populate users to parents
*/

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
      'keydown': 'handle_keys',
      'click': 'handle_focus'
    };

    BeanView.prototype.initialize = function() {
      this.last_four_keys = [];
      return _.bindAll(this, 'focus_me', 'append_user', 'append_child_bean', 'update_hours_spent');
    };

    BeanView.prototype.handle_focus = function() {
      return this.focus_me();
    };

    BeanView.prototype.handle_keys = function(e) {
      if (!this.person_selector) {
        if (e.keyCode === 13) {
          return this.test_to_add_bean(e);
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

    BeanView.prototype.test_to_add_bean = function(e) {
      e.preventDefault();
      if (this.textarea.text().length > 1) {
        this.save_content();
        if (this.model.get('parent') !== null) {
          return this.model.get('parent').get('children').add(new Bean);
        } else {
          return this.model.get('children').add(new Bean);
        }
      }
    };

    BeanView.prototype.change_hours_spent = function() {
      var current_char, delete_me, full_string, hours, index, string_num, template,
        _this = this;
      full_string = this.textarea.text();
      index = full_string.search('#hr') - 1;
      current_char = parseInt(full_string.charAt(index));
      string_num = '';
      while (isFinite(current_char)) {
        string_num = current_char + string_num;
        current_char = parseInt(full_string.charAt(index -= 1));
      }
      if (isFinite(parseInt(string_num))) {
        template = "<div class='hours'>" + string_num + "</div>";
        delete_me = string_num + '#hr';
        full_string = full_string.replace(delete_me, ' ');
        this.textarea.text(full_string);
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

    BeanView.prototype.test_for_deletion = function() {
      if ((this.model.get('parent') !== null) && (this.last_length === 0)) {
        this.go_up();
        this.model.get('parent').get('children').remove(this.model);
        if ($(this.el).parent().children().length === 1) {
          return $(this.el).parent().remove();
        } else {
          return $(this.el).remove();
        }
      }
    };

    BeanView.prototype.key_record = function(code, shiftKey) {
      var _this = this;
      if (code === 8 && this.last_length === 0) this.test_for_deletion();
      this.last_length = this.textarea.text().length;
      if (code === 16) return false;
      if (code === 50 && shiftKey) {
        this.person_selector = new PersonSelector({
          collection: project.get('people'),
          parent: this
        });
        this.textarea.append(this.person_selector.render().el);
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

    BeanView.prototype.remove_bean_from_dom = function(bean) {};

    BeanView.prototype.append_user = function(user) {
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

    BeanView.prototype.tab_over = function() {
      var current_parent, new_parent, this_index;
      if (this.model.collection) {
        if (this.model !== this.model.collection.models[0]) {
          this.save_content();
          current_parent = this.model.get('parent').get('children');
          this_index = _.indexOf(current_parent.models, this.model);
          return new_parent = current_parent.models[this_index - 1].get('children').add(this.model);
        }
      }
    };

    BeanView.prototype.tab_back = function() {
      var wrap,
        _this = this;
      if (this.model.get('parent').get('parent') !== null) {
        this.save_content();
        if ($(this.el).parent().children().length === 1) {
          wrap = $(this.el).parent();
          setTimeout((function() {
            return wrap.remove();
          }), 1000);
        }
        return this.model.get('parent').get('parent').get('children').add(this.model);
      }
    };

    BeanView.prototype.go_up = function() {
      if ($(this.el).prev('.bean').length) {
        return this.focus_me($(this.el).prev('.bean'));
      } else if ($(this.el).prev().prev('.bean').length) {
        return this.focus_me($(this.el).prev().prev('.bean'));
      } else if ($(this.el).parent().hasClass('wrap')) {
        return this.focus_me($(this.el).parent().prev('.bean'));
      } else {
        return false;
      }
    };

    BeanView.prototype.go_down = function() {
      var el, re_focus;
      if ($(this.el).next().hasClass('bean')) {
        return this.focus_me($(this.el).next());
      } else if ($(this.el).next().hasClass('wrap')) {
        return this.focus_me($(this.el).next().children('.bean:first'));
      } else {
        el = $(this.el).parent();
        re_focus = true;
        while (!(el.next('.bean')).length) {
          if (el.attr('id') === 'cortado') {
            re_focus = false;
            break;
          } else {
            el = el.parent();
            re_focus = true;
          }
        }
        if (re_focus) return this.focus_me(el.next());
      }
    };

    BeanView.prototype.save_content = function() {
      return this.model.set({
        content: this.textarea.text()
      });
    };

    BeanView.prototype.focus_me = function(el) {
      if (el == null) el = $(this.el);
      $('.bean').removeClass('focus');
      el.addClass('focus');
      return el.find('.textarea').focus();
    };

    BeanView.prototype.render = function() {
      var other_html;
      this.template = _.template($('#bean').html(), this.model.toJSON());
      other_html = '';
      _.each(this.model.get('people').models, function(person) {
        var img_path, name, template;
        img_path = person.get('img_path');
        name = person.get('name');
        template = "<div class='user_photo'><img class='user show' src=/img/" + img_path + " alt=" + name + " /></div>";
        return other_html += template;
      });
      $(this.el).html(this.template);
      $(this.el).find('.people').append(other_html);
      if (this.model.get('my_hours_spent') === 0) {
        $(this.el).find('.hour_wrap').find('.hours').remove();
      }
      this.textarea = $(this.el).find('.textarea');
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
      people: '',
      keywords: [],
      my_hours_est: 0,
      my_hours_spent: 0,
      hours_est: 0,
      hours_spent: 0
    },
    initialize: function() {
      var _this = this;
      this.set({
        people: new Backbone.Collection
      });
      this.set({
        view: new BeanView({
          model: this
        })
      });
      _.bindAll(this, 'update_hours_spent', 'update_hours_estimated');
      this.get('people').on('add', function(person) {
        return _this.get('view').append_user(person);
      });
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
    update_hours_estimated: function() {}
  });

  window.Beans = Backbone.Collection.extend({
    initialize: function() {
      var _this = this;
      return this.on('add', function(bean) {
        var bean_view;
        bean_view = bean.get('view');
        if (_this.is_master === true) {
          $('#cortado').append(bean_view.render().el);
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
