 window.listKids = function() {
  	var parent = project.get('beans').models;
  	_.each(parent, function(offspring) {
  		getChildren(offspring.get('children'));
  	}); 	
  }

  window.getChildren = function(parent){
  		console.log(parent);
  			_.each(parent.models, function(child) {
				getChildren(child.get('children'));
  				
 			}); 			
  }