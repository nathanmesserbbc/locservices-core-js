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

    if (!location.hasOwnProperty("placeType")) {
      return false;
    }

    if (location.placeType !== "postcode" && location.placeType !== "district") {
      if (!location.hasOwnProperty("container")) {
        return false;
      }
    }

    return location.id && location.name;
  }

  // check if the browser has the capabilities to support this module
  var isSupported = (typeof window.JSON === "object" && typeof window.localStorage === "object");

  /**
   *
   * @constructor
   */
  function LocalStorageAdapter() {

    // prefix localStorage entries to avoid name clashes
    this._prefix = "locservices-recent-locations";
  }

  /**
   * Get the list of items
   *
   * @return {Array}
   */
  LocalStorageAdapter.prototype.get = function() {

    var list = [];

    try {
      list = JSON.parse(localStorage[this._prefix]);
    } catch (Error) {}

    return list;
  };

  /**
   * Save some items
   *
   * @param {Array} locations
   */
  LocalStorageAdapter.prototype.set = function(locations) {

    if (Object.prototype.toString.call(locations) !== "[object Array]") {
      locations = [locations];
    }

    localStorage[this._prefix] = JSON.stringify(locations);
  };

  /**
   * Recent locations module.
   *
   * @constructor
   */
  function RecentLocations() {

    // storage adapter. this can be BBC iD later on
    if (this.isSupported()) {
      this._storageAdapter = new LocalStorageAdapter();
    }
  }

  /**
   * Check to see if the browser has the capabilities to support this module.
   *
   * @returns {Boolean}
   */
  RecentLocations.prototype.isSupported = function() {
    return isSupported;
  };

  /**
   * Return all the locations
   *
   * @return {Array}
   */
  RecentLocations.prototype.all = function() {

    return this._storageAdapter.get();
  };

  /**
   * Add a location to the recent locations list. The location will be added to
   * the top of the stack.
   *
   * @param {Object} location
   */
  RecentLocations.prototype.add = function(location) {

    if (!isValidLocation(location)) {
      throw new Error("Locations passed to RecentStorage must look like a location entity");
    }

    // don't add duplicates
    if (this.contains(location.id)) {
      return;
    }

    var locations = this._storageAdapter.get();

    locations.unshift(location);
    this._storageAdapter.set(locations);
  };

  /**
   * Remove a location by ID
   *
   * @param {String} locationId
   */
  RecentLocations.prototype.remove = function(locationId) {

    var new_list = [];
    var old_list = this._storageAdapter.get();
    var k;

    for (k in old_list) {
      if (old_list.hasOwnProperty(k) && old_list[k].id.toString() !== locationId.toString()) {
        new_list.push(old_list[k]);
      }
    }

    this._storageAdapter.set(new_list);
  };

  /**
   * Clear all the items in the array.
   *
   * @return void
   */
  RecentLocations.prototype.clear = function() {
    this._storageAdapter.set([]);
  };

  /**
   * Check to see if a location has already been stored.
   *
   * @param {String} locationId
   * @returns {Boolean}
   */
  RecentLocations.prototype.contains = function(locationId) {

    var exists = false;
    var locations = this._storageAdapter.get();
    var k;

    for (k in locations) {
      if (locations.hasOwnProperty(k) && locations[k].id === locationId) {
        exists = true;
      }
    }

    return exists;
  };

  return RecentLocations;
}));
