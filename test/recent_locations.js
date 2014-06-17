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

  recentLocations.add({id: 1, name: "Cardiff"});
  recentLocations.add({id: 2, name: "Pontypridd"});

  equal(recentLocations.all()[0].id, 2, "Last location added is now at the top");
});

test("That you cannot add duplicate locations", function() {

  recentLocations.add({id: 1, name: "Cardiff"});
  recentLocations.add({id: 1, name: "Cardiff"});

  equal(recentLocations.all().length, 1, "Only one location has been added");
});
