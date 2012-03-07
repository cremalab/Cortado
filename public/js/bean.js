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
      return this.last_four_keys = [];
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

    BeanView.prototype.key_record = function(code, shiftKey) {
      var current_char, end, full_string, index, some_html, start, string_num,
        _this = this;
      if (code === 16) return false;
      if (code === 51 && shiftKey) code = '#';
      if (code === 50 && shiftKey) {
        some_html = $('#hidden').html();
        $(this.el).append(some_html);
        setTimeout((function() {
          return $(_this.el).find('.person_selector').addClass('show');
        }), 10);
        return false;
      }
      this.last_four_keys.unshift(code);
      if (this.last_four_keys.length > 4) this.last_four_keys.pop();
      if (_.isEqual(this.last_four_keys, [83, 82, 72, "#"])) {
        full_string = $(this.el).text();
        start = full_string.search('#hrs');
        end = start + 4;
        index = start - 1;
        current_char = parseInt(full_string.charAt(index));
        string_num = '';
        while (isFinite(current_char)) {
          string_num = current_char + string_num;
          current_char = parseInt(full_string.charAt(index -= 1));
        }
        if (isFinite(parseInt(string_num))) {
          while (index <= end) {
            full_string = full_string.replaceAt(index, ' ');
            if (index === end) {
              full_string = full_string.replaceAt(index, '<div contenteditable="false" class="hours">' + string_num + ' hours</div> ');
            }
            index++;
          }
          $(this.el).html(full_string);
          setTimeout((function() {
            return $(_this.el).find('.hours').addClass('show');
          }), 10);
          return add_to_hours(parseInt(string_num));
        }
      }
    };

    BeanView.prototype.add_bean = function() {
      var new_bean;
      this.save_content();
      new_bean = new Bean;
      new_bean.set({
        'parent': this.model.get('parent')
      });
      return this.model.collection.add(new_bean);
    };

    BeanView.prototype.tab_over = function() {
      var all_models, parent, this_index;
      if (this.model !== this.model.collection.models[0]) {
        this.save_content();
        all_models = this.model.collection.models;
        this_index = _.indexOf(all_models, this.model);
        parent = all_models[this_index - 1];
        this.model.collection.remove(this.model);
        this.model.set({
          'parent': parent
        });
        return parent.get('beans').add(this.model);
      }
    };

    BeanView.prototype.tab_back = function() {
      this.model.set({
        content: $(this.el).html()
      });
      return this.model.collection.remove(this.model);
    };

    BeanView.prototype.go_up = function() {
      if ($(this.el).prev().hasClass('bean')) {
        return $(this.el).prev().focus();
      } else if ($(this.el).prev().hasClass('wrap')) {
        return $(this.el).prev().children('.bean:last').focus();
      } else if ($(this.el).parent().prev().hasClass('bean')) {
        return $(this.el).parent().prev().focus();
      } else if ($(this.el).parent().prev().hasClass('wrap')) {
        return $(this.el).parent().prev().children('.bean:last').focus();
      } else {
        return false;
      }
    };

    BeanView.prototype.go_down = function() {
      var parent;
      if ($(this.el).next().hasClass('bean')) {
        return $(this.el).next().focus();
      } else if ($(this.el).next().hasClass('wrap')) {
        return $(this.el).next().children('.bean:first').focus();
      } else {
        parent = $(this.el).parent();
        while (!(parent.next().hasClass('bean')) || !(parent.next().hasClass('wrap'))) {
          if (parent.attr('id') === 'cortado') break;
          parent = parent.parent();
        }
        if (parent.attr('id') !== 'cortado') {
          return parent.next().children('.bean:first').focus();
        }
      }
    };

    BeanView.prototype.save_content = function() {
      return this.model.set({
        content: $(this.el).html()
      });
    };

    BeanView.prototype.render = function() {
      this.template = _.template($('#bean').html(), this.model.toJSON());
      $(this.el).html(this.template);
      $(this.el).attr('contenteditable', true);
      return this;
    };

    return BeanView;

  })(Backbone.View);

  window.Bean = (function(_super) {

    __extends(Bean, _super);

    function Bean() {
      Bean.__super__.constructor.apply(this, arguments);
    }

    Bean.prototype.defaults = {
      parent: '',
      content: ''
    };

    Bean.prototype.initialize = function() {
      this.set({
        beans: new Beans
      });
      this.set({
        view: new BeanView({
          model: this
        })
      });
      return _.bindAll(this, 'add_child', 'remove_child');
    };

    Bean.prototype.add_child = function(added_bean) {
      var view, wrap,
        _this = this;
      view = $(this.get('view').el);
      if (!view.next().hasClass('wrap')) view.after('<div class="wrap"></div>');
      wrap = view.next();
      return _.each(this.get('beans').models, function(bean) {
        wrap.append(bean.get('view').render().el);
        if (added_bean === bean) return $(bean.get('view').el).focus();
      });
    };

    Bean.prototype.remove_child = function() {
      var view, wrap,
        _this = this;
      view = $(this.get('view').el);
      wrap = view.next();
      wrap.empty();
      return _.each(this.get('beans').models, function(bean) {
        return wrap.append(bean.get('view').render().el);
      });
    };

    return Bean;

  })(Backbone.Model);

  window.Beans = (function(_super) {

    __extends(Beans, _super);

    function Beans() {
      Beans.__super__.constructor.apply(this, arguments);
    }

    Beans.prototype.initialize = function() {
      var _this = this;
      return this.on('add', function(bean) {
        var bean_view;
        bean_view = bean.get('view').render().el;
        if (_this.is_master === true) {
          $('#cortado').find('.wrap').append(bean_view);
        } else {
          bean.get('parent').add_child(bean);
        }
        return $(bean_view).focus();
      });
    };

    return Beans;

  })(Backbone.Collection);

}).call(this);
