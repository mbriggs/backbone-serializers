describe("backbone.serializer", function() {
  var Serializer = Backbone.Serializer;
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  describe('minimal configuration', function(){
    var Minimal = Serializer.extend({});

    beforeEach(function(){
      Minimal.prototype.attributes = ['something']
    });

    it("requires non-empty attributes", function(){
      Minimal.prototype.attributes = [];

      expect(function(){new Minimal()}).to.throw(Error);
    });
  });

  describe('basic configuration', function(){
    var BasicSerializer = Serializer.extend({
      attributes: ['foo']
    });

    var serializer;

    beforeEach(function(){
      serializer = new BasicSerializer();
    });

    it('serializes whitelisted attrs', function(){
      var model = new Model({foo: 'hi'});
      var data = serializer.serialize(model);

      expect(data.foo).to.eq('hi');
    });

    it('ignores non whitelisted attrs', function(){
      var model = new Model({foo: 'hi', ignored: 'blah'});
      var data = serializer.serialize(model);

      expect(data.ignored).to.be.undefined;
    });
  });

//  describe("with relations", function() {
//    var RelatedSerializer = Serializer.extend({
//      relations: ["foo"]
//    });
//
//    var serializer;
//
//    beforeEach(function(){
//      serializer = new RelatedSerializer();
//    });
//
//    it('calls toJSON on related models', function(){
//      var model = new Model({foo: new Model({modelProp: 'value'})});
//      var data = serializer.serialize(model);
//
//      expect(data.foo.modelProp).to.eq('value');
//    });
//  });

  describe("with related serializers", function(){

  });
});