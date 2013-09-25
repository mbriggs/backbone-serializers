/*global EmptyAttrsError */

Backbone.Serializer = Backbone.Class.extend({
  attributes: [],
  relations: [],
  serializers: [],

  constructor: function(){
    this.initialize.apply(this, arguments);

    if( this.hasEmptyWhitelist() ) throw new EmptyAttrsError('serializer');
    this.instanciateSerializers();
    this.__whitelist = this.buildWhitelist();
  },

  serialize: function(model){
    var data = this.extractData(model);

    this.applyRelations(data);
    this.applyHandlers(data);
    this.applySerializers(data);

    return data;
  },

  extractData: function(model){
    var data = {};
    _.each(this.__whitelist, function(attr){
      data[attr] = model.get(attr);
    });

    return data;
  },

  applyRelations: function(data){
    _.each(this.relations, function(attr){
      if(data[attr]) data[attr] = data[attr].toJSON();
    });
  },

  applySerializers: function(data){
    _.each(this.serializers, function(serializer, attr){
      if(data[attr]) data[attr] = serializer.serialize(data[attr]);
    });
  },

  applyHandlers: function(data){
    _.forOwn(data, function(value, attr){
      data[attr] = this[attr] ? this[attr](value) : value;
    }, this);
  },

  instanciateSerializers: function(){
    var serializers = this.serializers;
    _.forOwn(serializers, function(Serializer, attr){
      serializers[attr] = new Serializer();
    });
  },

  buildWhitelist: function(){
    return [].concat(
      this.attributes,
      this.relations,
      _.keys(this.serializers)
    );
  },

  hasEmptyWhitelist: function(){
    var possible = [
      this.attributes,
      this.relations,
      this.serializers
    ];

    return _.all(possible, _.isEmpty);

  }
});
