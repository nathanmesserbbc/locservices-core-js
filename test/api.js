var api;

module("API", {
  setup: function() {
    api = new locator.core.API();
    api._base_uri = "http://localhost:9999/test/fixtures";
  },
  teardown: function() {
  }
});

test("Constructor defaults to live locator API", function() {
  api = new locator.core.API();
  equal(api._base_uri, "http://open.live.bbc.co.uk/locator");
});

test("Constructor sets env", function() {
  api = new locator.core.API({ env: "foo" });
  equal(api._base_uri, "http://open.foo.bbc.co.uk/locator");
});

test("Constructor sets base_uri using env", function() {
  var expectedEnv = "foo";
  api = new locator.core.API({ env: expectedEnv });
  equal(api._base_uri, "http://open." + expectedEnv + ".bbc.co.uk/locator");
});

test("Constructor uses http as the default protocol to construct the base uri", function() {
  equal(api._base_uri.substr(0, 7), "http://");
});

test("Constructor uses options protocol to construct the base uri", function() {
  api = new locator.core.API({ protocol: "https" });
  equal(api._base_uri.substr(0, 8), "https://");
});

test("default query parameters can be built from constructor options", function() {

  api = new locator.core.API({
    vv: 3,
    env: "test"
  });

  equal(Object.keys(api._defaultParams).length, 1, "One parameter applied by default");
  equal(api._defaultParams.vv, 3, "vv=3 default parameter applied");
});

test("Query parameters are built from constructor options", function() {

  api = new locator.core.API({
    vv: 2,
    language: "en-GB",
    rows: 10,
    env: "live",
    protocol: "https"
  });

  equal(Object.keys(api._defaultParams).length, 3, "Three query parameters found from options");
});

asyncTest("#getLocation uses global query parameters", function() {
  expect(3);

  api = new locator.core.API({
    vv: 2,
    language: "en-GB",
    rows: 10
  });
  api._base_uri = "http://localhost:9999/test/fixtures";

  api.getLocation(12345, {
    success: function(data) {
      var uri = data.location.locations;
      ok(uri.indexOf("rows=10") > -1, "rows=10 added to query");
      ok(uri.indexOf("language=en-GB") > -1, "language=en-GB added to query");
      ok(uri.indexOf("vv=2") > -1, "vv=2 added to query");
      start();
    }
  });
});

asyncTest("#getLocation overrides global parameters via its options", function() {

  api = new locator.core.API({ vv: 1 });
  api._base_uri = "http://localhost:9999/test/fixtures";

  api.getLocation(123, {
    vv: 2, // <=== Override view version
    success: function(data) {
      var uri = data.location.locations;
      ok(uri.indexOf("vv=2") > -1, "vv=2 override");
      start();
    }
  });
});

asyncTest("#getLocation should call success on successful request", function() {
  expect(1);
  api.getLocation(2643743, {
    success: function() {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#getLocation should call error on request", function() {
  expect(1);
  api.getLocation(2643743, {
    throwError: "true",
    error: function() {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#getLocation with detailTypes array should call success on successful request", function() {
  expect(1);
  api.getLocation(2643743, {
    detailTypes: ["tv", "radio"],
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#getLocation with detailTypes should call error on request", function() {
  expect(1);
  api.getLocation(2643743, {
    detailTypes: ["tv", "radio"],
    throwError: "true",
    error: function() {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#search overrides global parameters via its options", function() {

  expect(2);

  api = new locator.core.API({ placetypes: ["settlement", "airport"] });
  api._base_uri = "http://localhost:9999/test/fixtures";

  api.search("Cardiff", {
    placetypes: ["road"],
    success: function(data) {
      var uri = data.results;
      ok(uri.indexOf("placetypes=road") > -1, "placetypes=road override");
      ok(uri.indexOf("settlement,airport") === -1, "original placeytpes non existent in uri");
      start();
    }
  });
});

asyncTest("#search should call success on successful request", function() {
  expect(1);
  api.search("Cardiff", {
    success: function() {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#search should call error on request", function() {
  expect(1);
  api.search("Cardiff", {
    throwError: "true",
    error: function() {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#autoComplete overrides global parameters via its options", function() {

  expect(1);

  api = new locator.core.API({ language: "en-GB" });
  api._base_uri = "http://localhost:9999/test/fixtures";

  api.autoComplete("Card", {
    language: "cy-GB",
    success: function(data) {
      var uri = data.results;
      ok(uri.indexOf("language=cy-GB") > -1, "language override");
      start();
    }
  });
});

asyncTest("#autoComplete should call success on successful request", function() {
  expect(1);
  api.autoComplete("Card", {
    success: function() {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#autoComplete should call error on request", function() {
  expect(1);
  api.autoComplete("Card", {
    throwError: "true",
    error: function() {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#reverseGeocode overrides global parameters via its options", function() {

  expect(1);

  api = new locator.core.API({ language: "en-GB" });
  api._base_uri = "http://localhost:9999/test/fixtures";

  api.reverseGeocode(0, 0, {
    language: "cy-GB",
    success: function(data) {
      var uri = data.results;
      ok(uri.indexOf("language=cy-GB") > -1, "language override");
      start();
    }
  });
});

asyncTest("#reverseGeocode should call success on successful request", function() {
  expect(1);
  api.reverseGeocode(3.5, -51.2, {
    success: function() {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#reverseGeocode should call error on request", function() {
  expect(1);
  api.reverseGeocode(5.1, -51.2, {
    throwError: "true",
    error: function() {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("test parameters for #getLocation method", function() {
  expect(2);
  api.getLocation(123456, {
    language: "en-GB",
    success: function(data) {
      notEqual(JSON.stringify(data).indexOf("123456"), -1, "Test did not pass geoname parameter through.");
      notEqual(JSON.stringify(data).indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      start();
    }
  });
});

asyncTest("test details parameters for #getLocation method", function() {
  expect(4);
  api.getLocation(123456, {
    detailTypes: ["news", "tv", "radio"],
    language: "en-GB",
    rows: 4,
    success: function(data) {
      var uri = data.location;
      notEqual(uri.indexOf("123456"), -1, "Test did not pass geoname parameter through.");
      notEqual(uri.indexOf("details/news,tv,radio"), -1, "Test did not pass details parameter through.");
      notEqual(uri.indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      notEqual(uri.indexOf("rows=4"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #search method", function() {
  expect(3);
  api.search("Cardiff", {
    language: "en-GB",
    rows: "15",
    success: function(data) {
      var uri = data.results;
      notEqual(uri.indexOf("s=Cardiff"), -1, "Test did not pass search parameter through.");
      notEqual(uri.indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      notEqual(uri.indexOf("rows=15"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #autoComplete method", function() {
  expect(4);
  api.autoComplete("Card", {
    language: "cy-GB",
    rows: "35",
    success: function(data) {
      var uri = data.results;
      notEqual(uri.indexOf("s=Card"), -1, "Test did not pass search parameter through.");
      notEqual(uri.indexOf("a=true"), -1, "Test did not pass autocomplete parameter through.");
      notEqual(uri.indexOf("language=cy-GB"), -1, "Test did not pass language parameter through.");
      notEqual(uri.indexOf("rows=35"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #reverseGeocode method", function() {
  expect(4);
  api.reverseGeocode(5.1, -51.2, {
    rows: 100,
    language: "cy-GB",
    success: function(data) {
      var uri = data.results;
      notEqual(uri.indexOf("la=5.1"), -1, "Test did not pass lo parameter through.");
      notEqual(uri.indexOf("lo=-51.2"), -1, "Test did not pass la parameter through.");
      notEqual(uri.indexOf("rows=100"), -1, "Test did not pass rows parameter through.");
      notEqual(uri.indexOf("language=cy-GB"), -1, "Test did not pass language parameter through.");
      start();
    }
  });
});

asyncTest("test location id is URI encoded", function() {
  expect(1);
  api.getLocation("<a>a link</a>", {
    success: function(data) {
      var uri = data.location.metadata.location;
      notEqual(uri.indexOf("%3Ca%3Ea%20link%3C%2Fa%3E"), -1, "Test did not URI encode the location id.");
      start();
    }
  });
});

asyncTest("test parameters are URI encoded", function() {
  expect(1);
  api.getLocation(123456, {
    rows: "\\A",
    success: function(data) {
      var uri = data.location.metadata.location;
      notEqual(uri.indexOf("rows=%5CA"), -1, "Test did not URI encode the location id.");
      start();
    }
  });
});
