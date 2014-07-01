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
    global.locservices.core.geolocation = factory();
  }
}(this, function() {

  // lazy evaluation to aid testing under phantomjs
  function isSupported() {
    return "geolocation" in navigator;
  }

  /**
   * Get the current position
   * @param {Function} onSuccess
   * @param {Function} onError
   * @param {Object} options
   * @return {Boolean} whether a call to the geolocation api was successfully made
   */
  function getCurrentPosition(onSuccess, onError, options) {

    options = options || {
      timeout: 1000,
      maximumAge: 60,
      enableHighAccuracy: true
    };

    // make it look like a PositionError
    if (!isSupported()) {
      return false;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    return true;
  }

  return {
    isSupported: isSupported(),
    getCurrentPosition: getCurrentPosition
  };

}));
