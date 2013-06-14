var emptyAttrsError = new Error("a serializer requires some attributes to be useful");

Backbone.Serializer = Class.extend({
  attributes: [],
  relations: [],
  serializers: [],

  constructor: function(){
    Class.prototype.constructor.apply(this, arguments);

    if( emptyAttrsOn(this) ) throw emptyAttrsError;
  },

  serialize: function(model){
    var data = this.extractData(model);

    this.applyRelations(data);

    return data;
  },

  extractData: function(model){
    var data = {};

    _.each(this.attributes, function(attr){
      data[attr] = model.get(attr);
    });

    return data;
  },

  applyRelations: function(data){
    _.each(this.relations, function(attr){
      if(data[attr]) data[attr] = data[attr].toJSON();
    });
  },

  applyHandlers: function(data){
    _.forOwn(data, function(value, attr){
      data[attr] = this[attr] ? this[attr](value) : value;
    }, this);
  }
});

function emptyAttrsOn(deserializer){
  var possible = [
    deserializer.attributes,
    deserializer.relations,
    deserializer.serializers
  ];

  return _.all(possible, _.isEmpty);
}