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

test("That you cannot add duplicate locations", function() {

  var loc = { id: 1, name: "Cardiff", placeType: "postcode" };
  recentLocations.add(loc);
  recentLocations.add(loc);

  equal(recentLocations.all().length, 1, "Only one location has been added");
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

test("LocalStorage adapter converts non array values to array", function() {

  recentLocations._storageAdapter.set(123);

  equal(recentLocations.all().length, 1, "Array type conversion");
  equal(recentLocations.all()[0], 123, "Array type conversion");
});
