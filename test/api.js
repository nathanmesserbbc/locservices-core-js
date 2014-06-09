var api;

module("API", {
  setup: function() {
    api = new locator.core.API("int", "http://localhost:9999/test/fixtures");
  },
  teardown: function() {
  }
});

asyncTest("#getLocation should call success on successful request", function() {
  expect(1);
  api.getLocation(2643743, {
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#getLocation should call error on request", function() {
  expect(1);
  api.getLocation(2643743, {
    params: {
      error: "true"
    },
    error: function(event) {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#getDetails should call success on successful request", function() {
  expect(1);
  api.getDetails(2643743, "news", {
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#getDetails should call error on request", function() {
  expect(1);
  api.getDetails(2643743, "news", {
    params: {
      error: "true"
    },
    error: function(event) {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#search should call success on successful request", function() {
  expect(1);
  api.search("Cardiff", {
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#search should call error on request", function() {
  expect(1);
  api.search("Cardiff", {
    params: {
      error: "true"
    },
    error: function(event) {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#autoComplete should call success on successful request", function() {
  expect(1);
  api.autoComplete("Card", {
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#autoComplete should call error on request", function() {
  expect(1);
  api.autoComplete("Card", {
    params: {
      error: "true"
    },
    error: function(event) {
      ok(true, "Test correctly called error handler");
      start();
    }
  });
});

asyncTest("#reverseGeocode should call success on successful request", function() {
  expect(1);
  api.reverseGeocode(3.5, -51.2, {
    success: function(data) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("#reverseGeocode should call error on request", function() {
  expect(1);
  api.reverseGeocode(5.1, -51.2, {
    params: {
      error: "true"
    },
    error: function(event) {
      ok(true, "Test correctly called success handler");
      start();
    }
  });
});

asyncTest("test parameters for #getLocation method", function() {
  expect(2);
  api.getLocation(123456, {
    params: {
      language: "en-GB"
    },
    success: function(data) {
      notEqual(data.url.indexOf("123456"), -1, "Test did not pass geoname parameter through.");
      notEqual(data.url.indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #getDetails method", function() {
  expect(4);
  api.getDetails(123456, ["news", "tv", "radio"], {
    params: {
      language: "en-GB",
      rows: 4
    },
    success: function(data) {
      notEqual(data.url.indexOf("123456"), -1, "Test did not pass geoname parameter through.");
      notEqual(data.url.indexOf("news,tv,radio"), -1, "Test did not pass details parameter through.");
      notEqual(data.url.indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      notEqual(data.url.indexOf("rows=4"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #search method", function() {
  expect(3);
  api.search("Cardiff", {
    params: {
      language: "en-GB",
      rows: "15"
    },
    success: function(data) {
      notEqual(data.url.indexOf("s=Cardiff"), -1, "Test did not pass search parameter through.");
      notEqual(data.url.indexOf("language=en-GB"), -1, "Test did not pass language parameter through.");
      notEqual(data.url.indexOf("rows=15"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #autoComplete method", function() {
  expect(4);
  api.autoComplete("Card", {
    params: {
      language: "cy-GB",
      rows: "35"
    },
    success: function(data) {
      notEqual(data.url.indexOf("s=Card"), -1, "Test did not pass search parameter through.");
      notEqual(data.url.indexOf("a=true"), -1, "Test did not pass autocomplete parameter through.");
      notEqual(data.url.indexOf("language=cy-GB"), -1, "Test did not pass language parameter through.");
      notEqual(data.url.indexOf("rows=35"), -1, "Test did not pass rows parameter through.");
      start();
    }
  });
});

asyncTest("test parameters for #reverseGeocode method", function() {
  expect(4);
  api.reverseGeocode(5.1, -51.2, {
    params: {
      rows: 100,
      language: "cy-GB"
    },
    success: function(data) {
      notEqual(data.url.indexOf("la=5.1"), -1, "Test did not pass lo parameter through.");
      notEqual(data.url.indexOf("lo=-51.2"), -1, "Test did not pass la parameter through.");
      notEqual(data.url.indexOf("rows=100"), -1, "Test did not pass rows parameter through.");
      notEqual(data.url.indexOf("language=cy-GB"), -1, "Test did not pass language parameter through.");
      start();
    }
  });
});
