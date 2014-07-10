var bbcCookies;
var stubWindowBBCCookies;
var policy;

stubWindowBBCCookies = {
  readPolicy: function() {
    return policy;
  }
};

module("BBCCookies", {

  setup: function() {
    policy = {
      ads: true,
      personalisation: true,
      performance: true,
      necessary: true
    };
    window.bbccookies = stubWindowBBCCookies;
    bbcCookies = new locservices.core.BBCCookies();
  }

});

test("isSupported() returns false if window.bbccookies is unavailable", function() {
  window.bbccookies = undefined;
  bbcCookies = new locservices.core.BBCCookies();
  equal(bbcCookies.isSupported(), false);
});

test("isSupported() returns true if window.bbccookies is an object", function() {
  equal(bbcCookies.isSupported(), true);
});

test("readPolicy() returns false if window.bbccookies is unavailable", function() {
    window.bbccookies = undefined;
    bbcCookies = new locservices.core.BBCCookies();
    equal(bbcCookies.readPolicy(), false);
});

test("readPolicy() returns an object if window.bbccookies is available", function() {
    equal(typeof bbcCookies.readPolicy(), "object");
});

test("isPersonalisationDisabled() returns false if window.bbccookies is unavailable", function() {
    window.bbccookies = undefined;
    bbcCookies = new locservices.core.BBCCookies();
    equal(bbcCookies.isPersonalisationDisabled(), false);
});

test("isPersonalisationDisabled() returns false if personalisation is enabled", function() {
    equal(bbcCookies.isPersonalisationDisabled(), false);
});

test("isPersonalisationDisabled() returns true if disabled", function() {
    policy.personalisation = false;
    equal(bbcCookies.isPersonalisationDisabled(), true);
});
