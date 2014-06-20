module("Geolocation", {
  setup: function() {
    navigator.geolocation = {
      getCurrentPosition: sinon.spy()
    };
  }
});

test("false is returned when the browser does not support Geolocation", function() {

  var spy = sinon.spy();

  delete window.navigator.geolocation;
  ok(!locator.core.geolocation.getCurrentPosition(function() {}, spy));
});

test("true is returned when successful api call is made", function() {
  ok(locator.core.geolocation.getCurrentPosition());
});

test("getCurrentPosition() proxies to Geolocation API call", function() {

  var callback = function() {};

  locator.core.geolocation.getCurrentPosition(callback, callback);

  ok(navigator.geolocation.getCurrentPosition.calledOnce);
});

test("getCurrentPosition() uses default options", function() {

  var callback = function() {};
  var expectedOptions = { timeout: 1000, maximumAge: 60, enableHighAccuracy: true };

  locator.core.geolocation.getCurrentPosition(callback, callback);

  ok(navigator.geolocation.getCurrentPosition.calledWith(callback, callback, expectedOptions));
});
