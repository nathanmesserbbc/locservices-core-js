(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof locator === "undefined") {
      global.locator = { core: {}};
    }
    locator.core.geolocation = factory();
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
   */
  function getCurrentPosition(onSuccess, onError, options) {

    options = options || {
      timeout: 1000,
      maximumAge: 60,
      enableHighAccuracy: true
    };

    // make it look like a PositionError
    if (!isSupported()) {
      onError({ code: 2, message: "The current browser does not support Geolocation" });
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }

  return {
    isSupported: isSupported(),
    getCurrentPosition: getCurrentPosition
  };

}));
