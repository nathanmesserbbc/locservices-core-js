var cookies;

function clearCookie(key, path, domain) {
  document.cookie = encodeURIComponent(key) +
    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
    ( domain ? "; domain=" + domain : "") +
    ( path ? "; path=" + path : "");
}

module("Cookies", {

  setup: function() {
    cookies = new locservices.core.Cookies();
  },

  tearDown: function() {
    clearCookie("foo");
  }

});

test("hasItem() returns false if key does not exits", function() {
  var result = cookies.hasItem("key_only_used_in_this_has_item_false_test");
  equal(result, false);
});

test("hasItem() returns false if key does not exits", function() {
  var key = "key_only_used_in_this_has_item_true_test";
  document.cookie = key + "=foo_bar";
  var result = cookies.hasItem(key);
  equal(result, true);
  clearCookie(key);
});

test("get() returns null if key does not exits", function() {
  var result = cookies.get("key_only_used_in_this_test");
  equal(result, null);
});

test("get() returns expected value if key exists", function() {
  document.cookie = "foo=bar_value_for_this_test_only";
  var result = cookies.get("foo");
  equal(result, "bar_value_for_this_test_only");
});

test("set() returns false if no key is provided", function() {
  equal(cookies.set(undefined, "bar"), false);
});

test("set() returns a string if cookie is set", function() {
  var result = cookies.set("foo", "bar");
  equal(typeof result, "string");
});

test("set() sets the document cookie key/value", function() {
  cookies.set("foo", "bar");
  equal(document.cookie, "foo=bar");
});

test("set() sets adds an expires string", function() {
  var result = cookies.set("foo", "bar", "Tue, 14 Jul 2015 14:09:00 GMT");
  equal(result, "foo=bar; expires=Tue, 14 Jul 2015 14:09:00 GMT");
});

test("set() does not add an expires Date object", function() {
  var result = cookies.set("foo", "bar", new Date());
  equal(result, "foo=bar");
});

test("set() adds a path", function() {
  var result = cookies.set("foo", "bar", undefined, "path");
  equal(result, "foo=bar; path=path");
});

test("set() sets adds a domain", function() {
  var result = cookies.set("foo", "bar", undefined, undefined, "domain");
  equal(result, "foo=bar; domain=domain");
});

test("unset() returns false if no name is provided", function() {
  equal(cookies.unset(undefined), false);
});

test("unset() returns false if key does not exist", function() {
  sinon.stub(cookies, "hasItem").returns(false);
  equal(cookies.unset("key_only_used_in_unset_unknown_key_test"), false);
});

test("unset() returns a string if cookie is set", function() {
  var result = cookies.unset("foo", "bar");
  equal(typeof result, "string");
});

test("unset() sets expires to 01 Jan 1970", function() {
  sinon.stub(cookies, "hasItem").returns(true);
  document.cookies = "foo=bar";
  var result = cookies.unset("foo");
  var index = result.indexOf("expires=Thu, 01 Jan 1970 00:00:00 GMT");
  equal(index, 6);
});
