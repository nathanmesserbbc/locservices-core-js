var recentLocations;

module("RecentLocations", {
  setup: function() {
    recentLocations = new locservices.core.RecentLocations();
  },
  teardown: function() {
    recentLocations.clear();
  }
});

test("Adding an invalid location returns false", 1, function() {
  var result;
  result = recentLocations.add({});
  equal(result, false);
});

test("Adding a location with a numeric id returns false", 1, function() {
  var result;
  result = recentLocations.add({
    id: 1234,
    name: "Foo",
    container: "Bar",
    placeType: "settlement",
    country: "GB"
  });
  equal(result, false);
});

test("Adding a non postcode or district without a container throws an Error", 1, function() {
  var result;
  result = recentLocations.add({
    id: "1234",
    name: "Foo",
    placeType: "settlement",
    country: "GB"
  });
  equal(result, false);
});

test("Adding a district without a container returns true", 1, function() {

  var result = recentLocations.add({
    id: "CF5",
    name: "CF5",
    placeType: "district",
    country: "GB"
  });

  equal(result, true);
});

test("Adding a postcode without a container returns true", 1, function() {

  var result = recentLocations.add({
    id: "CF5 1AB",
    name: "CF5 1AB",
    placeType: "postcode",
    country: "GB"
  });

  equal(result, true);
});

test("Adding locations pushes pushes them to the top of the stack", function() {

  recentLocations.add({ id: "1", name: "Cardiff", placeType: "postcode" });
  recentLocations.add({ id: "2", name: "Pontypridd", placeType: "postcode" });

  equal(recentLocations.all()[0].id, "2", "Last location added is now at the top");
});

test("Location history is limited to 4 locations", function() {

  recentLocations.add({ id: "1", name: "CF1", placeType: "district" });
  recentLocations.add({ id: "2", name: "CF2", placeType: "district" });
  recentLocations.add({ id: "3", name: "CF3", placeType: "district" });
  recentLocations.add({ id: "4", name: "CF4", placeType: "district" });
  recentLocations.add({ id: "5", name: "CF5", placeType: "district" });
  recentLocations.add({ id: "6", name: "CF6", placeType: "district" });

  equal(recentLocations.all().length, "4", "Location history is limited to 4 locations");
  equal(recentLocations.all()[0].id, "6", "First location is as expected");
  equal(recentLocations.all()[1].id, "5", "Second location is as expected");
  equal(recentLocations.all()[2].id, "4", "Third location is as expected");
  equal(recentLocations.all()[3].id, "3", "Fourth location is as expected");
});

test("That duplicate entries get added to the top of the list", function() {

  var loc1 = { id: "1", name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: "2", name: "Pontypridd", placeType: "postcode" };

  recentLocations.add(loc1);
  recentLocations.add(loc2);
  recentLocations.add(loc1); // duplicate

  equal(recentLocations.all()[0].id, "1", "First location has moved to the top");
});

test("all() returns an Array by default", function() {

  var type = Object.prototype.toString.call(recentLocations.all());

  equal(type, "[object Array]", "locations is an array");
});

test("all() returns an empty Array by default", function() {

  equal(recentLocations.all().length, 0, "locations is an array");
});

test("removing a location", function() {

  var loc1 = { id: "1", name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: "2", name: "Pontypridd", placeType: "postcode" };

  recentLocations.add(loc1);
  recentLocations.add(loc2);

  recentLocations.remove("1");

  equal(recentLocations.all().length, 1, "Only one location exists in history");
});

test("clearing all locations from memory", function() {

  var loc1 = { id: "1", name: "Cardiff", placeType: "postcode" };
  var loc2 = { id: "2", name: "Pontypridd", placeType: "postcode" };

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
  var loc = { id: "1", name: "Cardiff", placeType: "postcode" };

  recentLocations.add(loc);

  ok(stub.calledWith("1"), "Checked for duplicate entry");
});

test("clear calls the storage adapters clear method", function() {

  var stub = sinon.stub(recentLocations._storageAdapter, "set");
  recentLocations.clear();
  ok(stub.calledWith([]), "set() called with empty array");
});

// handling method calls when _storageAdapter is undefined

test("all() returns an empty Array when there is no storageAdapter", function() {
  recentLocations._storageAdapter = undefined;
  equal(recentLocations.all().length, 0, "locations is an array");
});

test("add() returns false when there is no storageAdapter", function() {
  var location = {
    id: "1234",
    name: "Foo",
    container: "Bar",
    placeType: "settlement",
    country: "GB"
  };
  recentLocations._storageAdapter = undefined;
  equal(recentLocations.add(location), false, "add returns false when the _storageAdapter is undefined");
});

test("remove() returns false when there is no storageAdapter", function() {
  recentLocations._storageAdapter = undefined;
  equal(recentLocations.remove(), false, "remove returns false when the _storageAdapter is undefined");
});

test("clear() returns false when there is no storageAdapter", function() {
  recentLocations._storageAdapter = undefined;
  equal(recentLocations.clear(), false, "clear returns false when the _storageAdapter is undefined");
});

test("contains() returns false when there is no storageAdapter", function() {
  recentLocations._storageAdapter = undefined;
  equal(recentLocations.contains(), false, "contains returns false when the _storageAdapter is undefined");
});
