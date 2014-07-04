var preferredLocation, api;

var API = function() {
  this.getCookie = function() {};
};

module("Preferred Location", {
  setup: function() {
    api = new API();
    preferredLocation = new locservices.core.PreferredLocation(api);
  }, teardown: function() {
    preferredLocation.unset();
  }
});

// isValidLocation()

test("isValidLocation() returns false if placeType is invalid", function() {
  var location;
  var actualValue;
  location = {
    placeType: "foo",
    country: "GB"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(false, actualValue);
});

test("isValidLocation() returns false if country is invalid", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "foo"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(false, actualValue);
});

test("isValidLocation() returns true if placeType is 'settlement'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "GB"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

test("isValidLocation() returns true if placeType is 'airport'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "airport",
    country: "GB"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

test("isValidLocation() returns true if country is 'GB'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "GB"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

test("isValidLocation() returns true if country is 'GG'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "GG"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

test("isValidLocation() returns true if country is 'IM'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "IM"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

test("isValidLocation() returns true if country is 'JE'", function() {
  var location;
  var actualValue;
  location = {
    placeType: "settlement",
    country: "JE"
  };
  actualValue = preferredLocation.isValidLocation(location);
  equal(true, actualValue);
});

// unset()

test("unset() returns false if domain is invalid", function() {
  var actualValue;
  var stub;
  stub = sinon.stub(preferredLocation, "getCookieDomain");
  stub.returns(false);
  actualValue = preferredLocation.unset();
  equal(false, actualValue);
});

test("unset() returns true if domain is valid", function() {
  var actualValue;
  var stub;
  stub = sinon.stub(preferredLocation, "getCookieDomain");
  stub.returns(".bbc.co.uk");
  actualValue = preferredLocation.unset();
  equal(true, actualValue);
});

test("unset() should pass an expired string to setDocumentCookie()", function() {
  var actualValue;
  var stubSetDocumentCookie;
  var stubGetCookieDomain;
  stubGetCookieDomain = sinon.stub(preferredLocation, "getCookieDomain");
  stubGetCookieDomain.returns(".bbc.co.uk");
  stubSetDocumentCookie = sinon.stub(preferredLocation, "setDocumentCookie");
  preferredLocation.unset();
  equal(
    stubSetDocumentCookie.args[0][0], 
    "locserv=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/; domain=.bbc.co.uk;", 
    "Cookie was not unset"
  ); 
});

// getHostname()

test("getHostname() returns a string", function() {
  equal(typeof preferredLocation.getHostname(), "string");
});

// getDocumentCookie()

test("getDocumentString() returns a string", function() {
  equal(typeof preferredLocation.getDocumentCookie(), "string");
});

// getLocServCookie()

test("getLocServCookie() should return null if cookie does not exist", function() {
  var actualValue;
  var stub;
  stub = sinon.stub(preferredLocation, "getDocumentCookie");
  stub.returns("foo=123");
  actualValue = preferredLocation.getLocServCookie();
  equal(actualValue, null, 
    "getLocServCookie() does not return null when locserv cookie is not set"
  );
});

// getCookieDomain()

function testGetCookieDomainWithHostname(hostname, expectedDomain) {
  var actualDomain;
  var stub;
  stub = sinon.stub(preferredLocation, "getHostname");
  stub.returns(hostname);
  actualDomain = preferredLocation.getCookieDomain();
  equal(actualDomain, expectedDomain);
}

test("getCookieDomain() calls getHostname()", function() {
  var stub;
  stub = sinon.stub(preferredLocation, "getHostname");
  preferredLocation.getCookieDomain();
  ok(stub.calledOnce);
});

test("getCookieDomain() returns .bbc.co.uk for www.live.bbc.co.uk", function() {
  testGetCookieDomainWithHostname("www.live.bbc.co.uk", ".bbc.co.uk");
});

test("getCookieDomain() returns .bbc.co.uk for bbc.com.bbc.co.uk", function() {
  testGetCookieDomainWithHostname("bbc.com.bbc.co.uk", ".bbc.co.uk");
});

test("getCookieDomain() returns .bbc.com for www.bbc.com", function() {
  testGetCookieDomainWithHostname("www.bbc.com", ".bbc.com");
});

test("getCookieDomain() returns .bbc.com for www.live.bbc.com", function() {
  testGetCookieDomainWithHostname("www.live.bbc.com", ".bbc.com");
});

test("getCookieDomain() returns .bbc.com for bbc.co.uk.bbc.com", function() {
  testGetCookieDomainWithHostname("bbc.co.uk.bbc.com", ".bbc.com");
});

test("getCookieDomain() returns false for www.itv.com", function() {
  testGetCookieDomainWithHostname("www.itv.com", false);
});

test("getCookieDomain() returns false for www.bbc.co.uk.itv.com", function() {
  testGetCookieDomainWithHostname("www.bbc.co.uk.itv.com", false);
});

test("getCookieDomain() returns false for null", function() {
  testGetCookieDomainWithHostname(null, false);
});

// get()

test("get() should return null if cookie does not exist", function() {
  var actualValue;
  var stub;
  stub = sinon.stub(preferredLocation, "getLocServCookie");
  stub.returns(null);
  actualValue = preferredLocation.get();
  equal(actualValue, null, 
    "get() does not return null when cookie is not set"
  );
});

test("get() should return the expected location object", function() {
  var expectedLocation;
  var actualLocation;
  var stub;

  expectedLocation = {
    id      : "6690828",
    name    : "Pontypridd",
    nation  : "wales",
    news    : {
      id   : "66",      
      path : "england/surrey",
      tld  : "surrey",
      name : "Surrey"
    },
    weather : {
      id   : "4172",
      name : "Dorking"
    }
  };
  stub = sinon.stub(preferredLocation, "getLocServCookie");
  stub.returns("1#l1#i=6690828:n=Pontypridd:h=w@w1#i=4172:p=Dorking@d1#1=l:2=e:3=e:4=2.41@n1#r=66");
  
  actualLocation = preferredLocation.get();
  deepEqual(actualLocation, expectedLocation, 
    "get() does not return the expected location object"
  );
});

// set()

test("set() should set this.cookieLocation to undefined", function() {
  preferredLocation.cookieLocation = "foo";
  preferredLocation.set(1);
  equal(preferredLocation.cookieLocation, undefined, 
    "set() does not nullify this.cookieLocation"
  );
});

test("set() should pass locationId to api.getCookie", function() {
  var locationId;
  var stub;
  locationId = 12345;
  stub = sinon.stub(api, "getCookie");
  preferredLocation.set(locationId);
  equal(stub.args[0][0], locationId, 
    "set() does not pass locationId to api.getCookie"
  );
});

test("set() should pass expected cookie string to setDocumentCookie()", function() {
  var options;
  var expectedCookieString;
  var actualCookieString;
  var spy;
  expectedCookieString = "locserv=foo; expires=Thu, 25 Jun 2015 09:07:58 GMT; domain=false; path=/;";
  api.getCookie = function(locationId, options) {
    options.success({
      cookie: "foo",
      expires: "1435223278"
    });
  };
  spy = sinon.spy(preferredLocation, "setDocumentCookie");
  preferredLocation.set(1);
  actualCookieString = spy.args[0][0];
  equal(actualCookieString, expectedCookieString, "does not set the expected cookie string");
});

test("set() should pass location object to success callback on api success", function() {
  var options;
  var expectedLocation;
  var actualLocation;
  options = {
    success: function(location) {
      actualLocation = location;
    }
  };
  expectedLocation = "foo";
  api.getCookie = function(locationId, options) {
    options.success({
      cookie: "foo",
      expires: "1234"
    });
  };
  sinon.stub(preferredLocation, "get").returns(expectedLocation);
  preferredLocation.set(1, options);
  equal(actualLocation, expectedLocation, "success callback does not recieve the expected location");
});

test("set() should call error callback on api error", function() {
  var options;
  var expectedEvent;
  var actualEvent;
  options = {
    error: function(event) {
      actualEvent = event;
    }
  };
  expectedEvent = "foo";
  api.getCookie = function(locationId, options) {
    options.error(expectedEvent);
  };
  preferredLocation.set(1, options);
  equal(actualEvent, expectedEvent, "error callback does not recieve the expected event");
});
