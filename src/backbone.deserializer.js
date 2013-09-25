/* global EmptyAttrsError NoModelError */

Backbone.Deserializer = Backbone.Class.extend({
  __name__: 'Deserializer',
  attributes: [],
  relations: {},
  deserializers: {},

  constructor: function(){
    this.initialize.apply(this, arguments);

    if( emptyAttrsOn(this) ) throw new EmptyAttrsError('deserializer');
    if( missingRequiredAttrsOn(this) ) throw new NoModelError();

    this.__whitelist = buildWhitelist(this);
    instanciateAll(this.deserializers)
  },

  deserialize: function(data){
    var attrs = this.onceOrMany('whitelistData', data);

    this.onceOrMany('applyHandlers', attrs);
    this.onceOrMany('applyRelations', attrs);
    this.onceOrMany('applyDeserializers', attrs);

    return this.instanciate(attrs);
  },

  onceOrMany: function(method, val){
    if(_.isArray(val)){
      return _.map(val, this[method], this);
    } else {
      return this[method](val);
    }
  },

  whitelistData: function(data){
    return _.pick(data, this.__whitelist);
  },

  applyRelations: function(attrs){
    _.forOwn(attrs, function(value, attr){
      var relation = this.relations[attr];
      if(relation) attrs[attr] = new relation(value);
    }, this);
  },

  applyDeserializers: function(attrs){
    _.forOwn(attrs, function(value, attr){
      var deserializer = this.deserializers[attr];

      if(deserializer) attrs[attr] = deserializer.deserialize(value);
    }, this);
  },

  applyHandlers: function(attrs){
    _.forOwn(attrs, function(value, attr){
      attrs[attr] = this[attr] ? this[attr](value) : value;
    }, this);
  },

  instanciate: function(attrs){
    if(_.isArray(attrs) && this.collection){
      return new this.collection(attrs);
    } else {
      return new this.model(attrs);
    }
  }
});

function emptyAttrsOn(deserializer){
  var possible = [
    deserializer.attributes,
    deserializer.relations,
    deserializer.deserializers
  ];

  return _.all(possible, _.isEmpty);
}

function missingRequiredAttrsOn(deserializer){
  return !deserializer.model && !deserializer.collection;
}

function buildWhitelist(deserializer){
  return [].concat(
    deserializer.attributes,
    _.keys(deserializer.relations),
    _.keys(deserializer.deserializers)
  );
}

function instanciateAll(deserializers){
  _.forOwn(deserializers, function(deserializer, attr){
    deserializers[attr] = new deserializer();
  })
}