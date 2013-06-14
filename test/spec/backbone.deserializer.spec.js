describe("backbone.deserializer", function(){
  var Deserializer = Backbone.Deserializer;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  describe("a minimal configuration", function(){
    var Minimal = Deserializer.extend({
    });

    beforeEach(function(){
      Minimal.prototype.attributes = ['something'];
      Minimal.prototype.model = Model;
    });

    it("throws an exception when attributes are empty", function(){
      Minimal.prototype.attributes = [];

      expect(function(){new Minimal()}).to.throw(Error);
    });

    it("throws an exception when no model is defined", function(){
      delete Minimal.prototype.model;

      expect(function(){new Minimal()}).to.throw(Error);
    });

    it("lets you instanciate when you have the minimal configuration", function(){
      expect(function(){new Minimal()}).not.to.throw(Error);
    })
  });

  describe("a simple configuration", function(){
    var SimpleDeserializer = Deserializer.extend({
      model: Model,
      collection: Collection,
      attributes: ['foo', 'bar']
    });

    var deserializer;

    beforeEach(function(){
      deserializer = new SimpleDeserializer();
    });

    it("creates instances of model", function(){
      var model = deserializer.deserialize({});
      expect(model instanceof Model).to.be.true;
    });

    it("creates an instance of collection", function(){
      var model = deserializer.deserialize([{}]);
      expect(model instanceof Collection).to.be.true;
    });

    it("includes whitelisted attrs", function() {
      var model = deserializer.deserialize({foo: 'blah'});
      expect(model.get('foo')).to.eq('blah');
    });

    it("does not include non whitelisted attrs", function(){
      var model = deserializer.deserialize({blocked: 'blocked'});
      expect(model.get('blocked')).to.be.undefined;
    });
  });

  describe("with custom handlers", function(){
    var HandlerDeserializer = Deserializer.extend({
      model: Model,
      attributes: ['foo'],

      foo: function(value){
        return value + 1;
      }
    });

    var deserializer;

    beforeEach(function(){
      deserializer = new HandlerDeserializer();
    });

    it("runs the value through the handler function before setting on model", function(){
      var model = deserializer.deserialize({foo: 1});
      expect(model.get('foo')).to.eq(2);
    });
  });

  describe('with related classes', function(){
    var RelatedDeserializer = Deserializer.extend({
      model: Model,
      relations: {
        modelAttr: Model,
        collectionAttr: Collection
      }
    });

    var deserializer;

    beforeEach(function(){
      deserializer = new RelatedDeserializer();
    });

    it("will deserialize associated model", function(){
      var model = deserializer.deserialize({ modelAttr: {} });

      expect(model.get('modelAttr') instanceof Model).to.be.true;
    });

    it("will pass the model attrs into the model", function() {
      var model = deserializer.deserialize({ modelAttr: {modelProp: 'value'} });

      expect(model.get('modelAttr').get('modelProp')).to.eq('value');
    });

    it("will deserialize associated collection", function(){
      var model = deserializer.deserialize({ collectionAttr: [] });

      expect(model.get('collectionAttr') instanceof Collection).to.be.true;
    });

    it("will pass create the right amount of models", function() {
      var model = deserializer.deserialize({ collectionAttr: [{},{}] });

      expect(model.get('collectionAttr').length).to.eq(2);
    });
  });

  describe('with a related deserializer', function(){
    var RelationDeserializer = Deserializer.extend({
      model: Model,

      attributes: ['foo'],

      foo: function(value){
        return value + 'foo';
      }
    });

    var RelatedDeserializer = Deserializer.extend({
      model: Model,
      deserializers: {
        related: RelationDeserializer
      }
    });

    var deserializer;

    beforeEach(function(){
      deserializer = new RelatedDeserializer();
    });

    it("will use the associated deserializer", function(){
      var model = deserializer.deserialize({ related: { foo: 'attr-' } });

      expect(model.get('related').get('foo')).to.eq('attr-foo');
    });
  });
});