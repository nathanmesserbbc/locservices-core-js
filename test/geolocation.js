module("Geolocation", {
  setup: function() {
    navigator.geolocation = {
      getCurrentPosition: sinon.spy()
    };
  }
});

test("Error callback called when browser does not support Geolocation", function() {

  var spy = sinon.spy();

  delete window.navigator.geolocation;
  locator.core.geolocation.getCurrentPosition(function() {}, spy);

  ok(spy.calledOnce);
});

test("Error callback passes the correct error message when browser not supported", function() {

  var spy = sinon.spy();
  var expectedError = { code: 2, message: "The current browser does not support Geolocation" };

  delete window.navigator.geolocation;
  locator.core.geolocation.getCurrentPosition(function() {}, spy);

  ok(spy.calledWith(expectedError));
});

test("getCurrentPosition() proxies to Geolocation API call", function() {

  var callback = function() {};

  locator.core.geolocation.getCurrentPosition(callback, callback);

  ok(navigator.geolocation.getCurrentPosition.calledOnce);
});

test("getCurrentPosition() uses default options", function() {

  var callback = function() {};
  var expectedOptions = { timeout: 2000, maximumAge: 200 };

  locator.core.geolocation.getCurrentPosition(callback, callback);

  ok(navigator.geolocation.getCurrentPosition.calledWith(callback, callback, expectedOptions));
});
