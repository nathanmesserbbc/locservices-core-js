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
    global.locservices.core.filter = factory();
  }
}(this, function() {

  var domestic = {
    placeType: "settlement, airport",
    country: "GB, GG, IM, JE"
  };

  var international = {
    placeType: "settlement, airport, country"
  };

  /**
   * Filters an array of locations by options
   *
   * @param {Array} locations
   * @param {Object} options
   * @return {Array}
   */
  var filter = function(locations, options) {

    if ("undefined" === typeof options || "undefined" === typeof locations) {
      return locations;
    }

    if ("string" === typeof options.filter) {
      return applyFilter(locations, options);
    }
    locations = applyProperty(locations, "placeType", options.placeType);
    return applyProperty(locations, "country", options.country);
  };

  /**
   * Applies a filter to filter options
   *
   * @param {Array} locations
   * @param {Object} options
   * @return {Array}
   */
  var applyFilter = function(locations, options) {

    if (!("domestic" === options.filter ||
          "international" === options.filter)) {
      options.filter = undefined;
      return filter(locations, options);
    }
    var filters = options.filter === "domestic" ? domestic : international;

    if ("undefined" !== typeof options.placeType) {
      filters.placeType = options.placeType;
    }

    if ("undefined" !== typeof options.country) {
      filters.country = options.country;
    }
    return filter(locations, filters);
  };

  /**
   * Filters an array of locations by a particular property
   *
   * @param {Array} locations
   * @param {String} property
   * @param {String} filterValue
   * @return {Array}
   */
  var applyProperty = function(locations, property, filterValue) {

    if ("undefined" === typeof filterValue) {
      return locations;
    }
    var filtered = [];
    var count    = locations.length;

    for (var i = 0; i < count; i++) {
      var location = locations[i];

      if (location.hasOwnProperty(property) &&
          filterValue.indexOf(location[property]) !== -1) {
        filtered.push(location);
      }
    }
    return filtered;
  };

  return filter;

}));
