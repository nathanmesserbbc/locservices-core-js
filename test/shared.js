var shared;

module("Shared", {
  setup: function() {
    shared = new locator.core.Shared();
  }, teardown: function() {
    shared.unset();
  }
});

test("should return the location cookie if set", function() {
  shared.set("Cardiff");
  equal(shared.get(), "Cardiff", "Cookie has not been set");
});

test("should return undefined if cookie not set", function() {
  shared.unset();
  equal(shared.get(), undefined, "Cookie was not previously set");
});

test("should correctly set cookie", function() {
  shared.set(1234);
  equal(shared.get(), "1234", "Cookie value not retrieved successfully");
});

test("should unset a cookie", function() {
  shared.set(5678);
  equal(shared.get(), "5678", "Cookie value not retrieved successfully");

  shared.unset();
  equal(shared.get(), undefined, "Cookie was not previously set");
});
