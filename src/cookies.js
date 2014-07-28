(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof global.locservices === "undefined") {
      global.locservices = {};
    }
    if (typeof global.locservices.core === "undefined") {
      global.locservices.core = {};
    }
    global.locservices.core.Cookies = factory();
  }
}(this, function() {

  /**
   * @constructor
   */
  function Cookies() {

  }

  /**
   * Does the client allow cookies to be set
   *
   * @return {Boolean}
   */
  Cookies.prototype.isSupported = function() {
    var key = "locservices_ui_test_cookie";
    var value = "test";
    var isSet = false;
    this.set(key, value);
    if (this.get(key) === value) {
      isSet = true;
    }
    this.unset(key);
    return isSet;
  };

  /**
   * Does a value exist
   *
   * @param  {String} key the name of the cookie value
   */
  Cookies.prototype.hasItem = function(key) {
    return (
      new RegExp(
        "(?:^|;\\s*)" +
        encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") +
        "\\s*\\="
      )
    ).test(document.cookie);
  };

   /**
    * Get a cookie value by key
    *
    * @param {String} key
    * @return {*}
    */
  Cookies.prototype.get = function(key) {
    return decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          "(?:(?:^|.*;)\\s*" +
          encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") +
          "\\s*\\=\\s*([^;]*).*$)|^.*$"
        ),
        "$1"
      )
    ) || null;
  };

  /**
   * Set a cookie
   *
   * @param  {String} key
   * @param  {*}      value
   * @param  {String} expiresGMTString
   * @param  {String} path
   * @param  {String} domain
   * @return {Boolean|String}
   */
  Cookies.prototype.set = function(key, value, expiresGMTString, path, domain) {
    var cookieString;
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) { 
      return false; 
    }
    if (expiresGMTString && "string" !== typeof expiresGMTString) {
      expiresGMTString = undefined;
    }
    cookieString = encodeURIComponent(key) + 
      "=" + encodeURIComponent(value) + 
      (expiresGMTString ? "; expires=" + expiresGMTString : "") +
      (domain ? "; domain=" + domain : "") + 
      (path ? "; path=" + path : "");
    document.cookie = cookieString;
    return cookieString;
  };

  /**
   * Unset a cookie
   *
   * @param  {String} key
   * @param  {String} path
   * @param  {String} domain
   * @return  {Boolean|String} 
   */
  Cookies.prototype.unset = function(key, path, domain) {
    var cookieString;
    if (!key || !this.hasItem(key)) {
      return false;
    }
    cookieString = encodeURIComponent(key) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      ( domain ? "; domain=" + domain : "") +
      ( path ? "; path=" + path : "");
    document.cookie = cookieString;
    return cookieString;
  };

  return Cookies;

}));
