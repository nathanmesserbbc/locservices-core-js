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
    global.locservices.core.Filter = factory();
  }
}(this, function() {

  /**
   * @constructor
   */
  function Filter() {}

  return Filter;

}));
