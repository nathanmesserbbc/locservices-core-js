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
    global.locservices.core.RecentLocations = factory();
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
    var storageList = localStorage[this._prefix];

    if (!storageList) {
      return list;
    }

    try {
      list = JSON.parse(localStorage[this._prefix]);
    } catch (Error) { /* No need to do anything as we'll return an empty array*/ }

    return list;
  };

  /**
   * Save some items
   *
   * @param {Array} locations
   * @return {Boolean|void} this will return false when the locations parameter
   * is not an array
   */
  LocalStorageAdapter.prototype.set = function(locations) {

    if (Object.prototype.toString.call(locations) !== "[object Array]") {
      return false;
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
      throw new Error("Locations passed to RecentLocations must be a valid location");
    }

    // if a duplicate is added then it will get moved to the top of the stack
    if (this.contains(location.id)) {
      this.remove(location.id);
      this.add(location);
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
