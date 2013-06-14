Backbone Serializers
====================

Note: THIS IS NOT DONE YET

Backbone Serializers are a declarative way to model your
serialization/deserialization logic. The API is mostly based on the excellent
ActiveModel::Serializers

Installation
------------

requires lo-dash (which you should be using anyways), backbone, and jquery.

    git clone github.com/mbriggs/backbone-serializers
    npm install
    grunt build
    cp dist/backbone-serializers.js <path to your app>

Hacking
-------

    grunt test # run all the tests
    karma start # if you have the karma runner started, will run tests on file change

Philosophy
----------

Backbone not supporting relationships between models is something which
has caused me issues in every project I have used it for. With some trial and
error, I know believe that this logic really belongs in the data layer, not
in the models at all.

Deserialization
---------------

Deserialization happens when data comes back from the server, and becomes a
model instance.

```js
var MyDeserializer = Backbone.Deserializer.extend({
  model: MyModel, // the model which will be instanciated
  collection: MyCollection, // if the data is an array, deserialization will
                            // result in a collection instance
  attributes: ["attr1", "attr2"], // whitelist of attributes to be passed to the model
  relations: {
    related: SomeOtherModel // related models are instanciated directly
  },
  deserializers: {
    someOther: SomeDeserializer // will pass the attributes to another deserializer
  },

  // any function with the same name as an attribute will provide a way
  // to modify the values in a custom way
  attr1: function(value){
    return value + 1;
  }
});

var deserializer = new MyDeserializer();

deserializer.deserialize(data); // => model instance
```

Serialization
-------------

Serialization is for when a model needs to be translated into data
to be sent to the server.

```js
var MySerializer = Backbone.Serializer.extend({
  attributes: ["attr1", "attr2"], // whitelist of attributes to be extracted from the model
  relations: ["attr3", "attr4"], // relations will have toJSON called on them
  serializers: {
    someOther: SomeSerializer // will pass the attribute to another serializer
  },

  // any function with the same name as an attribute will provide a way
  // to modify the values in a custom way
  attr1: function(value){
    return value + 1;
  }
});

var serializer = new MySerializer();

serializer.serialize(data); // => model instance
```
