(function() {
  var iterate_over_items;

  $(function() {
    var bean, shortcuts;
    shortcuts = new ShortcutKeys;
    if (!window.project) {
      window.project = new Project;
      bean = new Bean;
      bean.url = '/add/project';
      bean.set({
        'content': 'Brand New Project'
      });
      return project.get('beans').add(bean);
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

}).call(this);
