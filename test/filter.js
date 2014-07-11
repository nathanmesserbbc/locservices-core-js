var filter, locations;

module("Filter", {
  setup: function() {
    locations = [
      { name: "Cardiff", placeType: "settlement", country: "GB" },
      { name: "Swansea Airport", placeType: "airport", country: "GB" },
      { name: "Crosby", placeType: "settlement", country: "IM" },
      { name: "Caracas", placeType: "settlement", country: "VE" },
      { name: "JFK Airport", placeType: "airport", country: "US" }
    ];
    filter = locservices.core.filter;
  }
});

test("should filter locations by placeType", function() {
  var actual = filter(locations, { placeType: "settlement" });

  equal(actual.length, 3);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Crosby");
  equal(actual[2].name, "Caracas");
});

test("should filter locations by multiple placeTypes", function() {
  var actual = filter(locations, { placeType: "settlement,airport" });

  equal(actual.length, 5);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Swansea Airport");
  equal(actual[2].name, "Crosby");
  equal(actual[3].name, "Caracas");
  equal(actual[4].name, "JFK Airport");
});

test("should filter locations by country", function() {
  var actual = filter(locations, { country: "VE" });

  equal(actual.length, 1);
  equal(actual[0].name, "Caracas");
});

test("should filter locations by placeType and country", function() {
  var actual = filter(locations, { placeType: "settlement", country: "GB" });

  equal(actual.length, 1);
  equal(actual[0].name, "Cardiff");
});

test("should ignore invalid filters", function() {
  var actual = filter(locations, { filter: "global", placeType: "settlement" });

  equal(actual.length, 3);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Crosby");
  equal(actual[2].name, "Caracas");
});

test("should ignore empty filters", function() {
  var actual = filter(locations, { filter: "", placeType: "settlement" });

  equal(actual.length, 3);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Crosby");
  equal(actual[2].name, "Caracas");
});

test("should filter locations by domestic filter", function() {
  var actual = filter(locations, { filter: "domestic" });

  equal(actual.length, 3);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Swansea Airport");
  equal(actual[2].name, "Crosby");
});

test("should filter locations by domestic filter, placeType", function() {
  var actual = filter(locations, { filter: "domestic", placeType: "settlement" });

  equal(actual.length, 2);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Crosby");
});

test("should filter locations by domestic filter, countries", function() {
  var actual = filter(locations, { filter: "domestic", country: "IM" });

  equal(actual.length, 1);
  equal(actual[0].name, "Crosby");
});

test("should filter locations by domestic filter, placeType and countries", function() {
  var actual = filter(locations, { filter: "domestic", placeType: "airport", country: "GB" });

  equal(actual.length, 1);
  equal(actual[0].name, "Swansea Airport");
});

test("should filter locations by international filter", function() {
  var actual = filter(locations, { filter: "international" });

  equal(actual.length, 5);
  equal(actual[0].name, "Cardiff");
  equal(actual[1].name, "Swansea Airport");
  equal(actual[2].name, "Crosby");
  equal(actual[3].name, "Caracas");
  equal(actual[4].name, "JFK Airport");
});

test("should filter locations by international filter, placeType", function() {
  var actual = filter(locations, { filter: "international", placeType: "airport" });

  equal(actual.length, 2);
  equal(actual[0].name, "Swansea Airport");
  equal(actual[1].name, "JFK Airport");
});

test("should filter locations by international filter, countries", function() {
  var actual = filter(locations, { filter: "international", country: "US", placeType: "airport" });

  equal(actual.length, 1);
  equal(actual[0].name, "JFK Airport");
});

test("should filter locations by international filter, placeType and countries", function() {
  var actual = filter(locations, { filter: "international", placeType: "settlement", country: "VE" });

  equal(actual.length, 1);
  equal(actual[0].name, "Caracas");
});
