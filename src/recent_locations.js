(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof locator === "undefined") {
      global.locator = { core: {}};
    }
    locator.core.RecentLocations = factory();
  }
}(this, function() {

  /**
   * Check an object to see that it meets the minimum criteria for a location
   *
   * @param {Object} location
   * @return Boolean
   */
  function isValidLocation(location) {
    location = location || {};
    return location.id && location.name;
  }

  /**
   *
   * @constructor
   */
  function LocalStorageAdapter() {

    // prefix localStorage entries to avoid name clashes
    this._prefix = "locator-recent-locations";
  }

  /**
   * Get the list of items
   *
   * @return {Array}
   */
  LocalStorageAdapter.prototype.get = function() {
    return JSON.parse(localStorage[this._prefix]);
  };

  /**
   * Save some items
   *
   * @param {Array} locations
   */
  LocalStorageAdapter.prototype.set = function(locations) {
    localStorage[this._prefix] = JSON.stringify(locations);
  };

  /**
   * Recent locations module.
   *
   * @constructor
   */
  function RecentLocations() {

    // storage adapter. this can be BBC iD later on
    this._adapter = new LocalStorageAdapter();

    // perform a check to see if the browser can support this modules functionality
    this.isSupported = (typeof window.JSON !== "object" || typeof window.localStorage !== "object");
  }

  /**
   * Return all the locations
   *
   * @return {Array}
   */
  RecentLocations.prototype.all = function() {

    return this._adapter.get();
  };

  /**
   * Add a location. This method will
   *
   * @param {Object} location
   */
  RecentLocations.prototype.add = function(location) {

    if (!isValidLocation(location)) {
      throw new Error("Locations passed to RecentStorage must look like a location entity");
    }

    if (this.contains(location.id)) {
      return;
    }

    var locations = this._adapter.get();
    locations.unshift(location);
    this._adapter.set(locations);
  };

  /**
   * Remove a location by ID
   *
   * @param {String} locationId
   */
  RecentLocations.prototype.remove = function(locationId) {

  };

  /**
   * Clear all the items in the array.
   *
   * @return void
   */
  RecentLocations.prototype.clear = function() {
    this._adapter.set([]);
  };

  /**
   * Check to see if a location has already been stored.
   *
   * @param {String} locationId
   * @returns {Boolean}
   */
  RecentLocations.prototype.contains = function(locationId) {

    var exists = false;
    var locations = this._adapter.get();
    var n;

    for (n in locations) {
      if (locations.hasOwnProperty(n) && locations[n].id === locationId) {
        exists = true;
      }
    }

    return exists;
  };

  return RecentLocations;
}));
