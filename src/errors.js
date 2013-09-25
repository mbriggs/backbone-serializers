var EmptyAttrsError = Backbone.Error.extend({
  name: 'EmptyAttrsError',

  initialize: function(type){
    this.message = "A "+ type +" requires some attributes to be useful"
  }
});

var NoModelError = Backbone.Error.extend({
  name: 'NoModelError',
  message: "A deserializer must have a model or a collection to instanciate"
});