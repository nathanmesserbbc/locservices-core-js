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
    global.locservices.core.BBCCookies = factory();
  }
}(this, function() {

  function BBCCookies() {
    this._isSupported = "object" === typeof window.bbccookies;
    if (this._isSupported) {
      this._policy = window.bbccookies.readPolicy();
    }
  }

  /**
   * Is window.bbccookies available
   *
   * @return {Boolean}
   */
  BBCCookies.prototype.isSupported = function() {
    return this._isSupported;
  };

  /**
   * Wrapper for the bbccookies.readPolicy method
   *
   * @return {Object|Boolean}
   */
  BBCCookies.prototype.readPolicy = function() {
    if (this._isSupported) {
      return this._policy;
    }
    return false;
  };

  /**
   * Has personalisation via cookies been disabled.
   * This will only return true if window.bbccookies is available
   * and bbccookies.readPolicy().personalisation is false
   *
   * @return {Boolean}
   */
  BBCCookies.prototype.isPersonalisationDisabled = function() {
    if (this._isSupported) {
      return false === this._policy.personalisation;
    }
    return false;
  };

  return BBCCookies;

}));
