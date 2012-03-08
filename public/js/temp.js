Beaner = Backbone.RelationalModel.extend({
    relations: [
        {
            type: Backbone.HasMany, // Use the type, or the string 'HasOne' or 'HasMany'.
            key: 'children',
            relatedModel: 'Beaner',
            collectionType: 'Beaners',
            reverseRelation: {
                key: 'parent'
            }
        }
    ]
});

Beaners = Backbone.Collection.extend({
    model : Beaner
});

window.house = new Beaner();
house.get('children').add(new Beaner)
console.log(house)