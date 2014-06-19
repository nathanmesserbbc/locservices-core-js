var recentLocations;

module("RecentLocations", {
  setup: function() {
    recentLocations = new locator.core.RecentLocations();
  },
  teardown: function() {
    recentLocations.clear();
  }
});

test("Adding an invalid location throws and Error", 1, function() {

  var callback = function() {
    recentLocations.add({});
  };

  throws(callback, Error, "An error is thrown");
});

test("Adding locations pushes pushes them to the top of the stack", function() {

  recentLocations.add({ id: 1, name: "Cardiff", placeType: "postcode" });
  recentLocations.add({ id: 2, name: "Pontypridd", placeType: "postcode" });

  equal(recentLocations.all()[0].id, 2, "Last location added is now at the top");
});

test("That duplicate entries get added to the top of the list", function() {

  var loc1 = { id: 1, name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: 2, name: "Pontypridd", placeType: "postcode" };

  recentLocations.add(loc1);
  recentLocations.add(loc2);
  recentLocations.add(loc1); // duplicate

  equal(recentLocations.all()[0].id, 1, "First location has moved to the top");
});

test("all() returns an Array by default", function() {

  var type = Object.prototype.toString.call(recentLocations.all());

  equal(type, "[object Array]", "locations is an array");
});

test("all() returns an empty Array by default", function() {

  equal(recentLocations.all().length, 0, "locations is an array");
});

test("removing a location", function() {

  var loc1 = { id: 1, name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: 2, name: "Pontypridd", placeType: "postcode" };

  recentLocations.add(loc1);
  recentLocations.add(loc2);

  recentLocations.remove(1);

  equal(recentLocations.all().length, 1, "Only one location exists in history");
});

test("clearing all locations from memory", function() {

  var loc1 = { id: 1, name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: 2, name: "Pontypridd", placeType: "postcode" };

  recentLocations.add(loc1);
  recentLocations.add(loc2);

  recentLocations.clear();

  equal(recentLocations.all().length, 0, "Locations have been cleared");

});

test("LocalStorage adapter doesn't add non-array values", function() {

  recentLocations._storageAdapter.set(123);

  equal(recentLocations.all().length, 0, "Array type conversion");
});

test("Adding a location performs a check for duplicate entries", function() {

  var stub = sinon.stub(recentLocations, "contains");
  var loc = { id: 1, name: "Cardiff", placeType: "postcode" };

  recentLocations.add(loc);

  ok(stub.calledWith(1), "Checked for duplicate entry");
});

test("clear calls the storage adapters clear method", function() {

  var stub = sinon.stub(recentLocations._storageAdapter, "set");
  recentLocations.clear();
  ok(stub.calledWith([]), "set() called with empty array");
});
