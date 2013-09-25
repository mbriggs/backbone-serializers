;(function(Backbone, _){
  "use strict";

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
  ;(function(){
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

  }());

  ;(function(){
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
  }());
}(Backbone, _));