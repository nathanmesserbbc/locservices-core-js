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
    global.locservices.core.API = factory();
  }
}(this, function() {

  "use strict";

  /**
   * Apply default options to an object. If objA defines a property that objB
   * does not have, then objB will be assign it.
   *
   * @param {Object} objA - the default options object
   * @param {Object} objB - the object that contains options to override the defaults
   * @returns {Object}
   */
  function applyDefaults(objA, objB) {

    var k;

    for (k in objA) {
      if (objA.hasOwnProperty(k) && !objB.hasOwnProperty(k)) {
        objB[k] = objA[k];
      }
    }

    return objB;
  }

  /**
   * Represents an API.
   * @constructor
   * @param {object} options - Options to configure instance
   */
  function API(options) {

    var k;
    var palEnv = "";

    this._defaultParams = {};

    // apply default options
    this._options = applyDefaults({
      env: "live",
      protocol: "http"
    }, options || {});

    // any option that is a string|number and is not a module option will
    // be treated as a default query parameter to use against an endpoint.
    var defaultParams = createQueryParametersFromObject(this._options);
    for (k in defaultParams) {
      if (defaultParams.hasOwnProperty(k) && k !== "env" && k !== "protocol") {
        this._defaultParams[k] = this._options[k];
      }
    }

    if (this._options.env !== "live") {
      palEnv = "." + this._options.env;
    }

    this._baseUri = this._options.protocol + "://open." + this._options.env + ".bbc.co.uk/locator";
    this._palBaseUri = this._options.protocol + "://www" + palEnv + ".bbc.co.uk";
  }

  /**
   * Return a map of query parameter name => values from an options object
   *
   * @param {Object} options
   * @return {Object}
   */
  function createQueryParametersFromObject(options) {

    var params = {};
    var k;

    for (k in options) {
      if (options.hasOwnProperty(k)) {
        if ((typeof options[k]).match(/string|number/)) {
          params[k] = options[k];
        } else if (Object.prototype.toString.call(options[k]) === "[object Array]") {
          params[k] = options[k].join(",");
        }
      }
    }

    return params;
  }

  /**
   * Returns a single location object via it's GeonameID or Postcode.
   *
   * @param {String|Number} id - A Geoname ID or valid postcode.
   * @param {Object} [options] -
   */
  API.prototype.getLocation = function(id, options) {

    var detailPath = "";
    var type = "location";

    options.params = applyDefaults(
      this._defaultParams,
      createQueryParametersFromObject(options || {})
    );

    if (options.detailTypes && Object.prototype.toString.call(options.detailTypes) === "[object Array]") {
      type = "details";
      detailPath = "/details/" + options.detailTypes.join(",");
      options.params.vv = 2;
    }

    var queryUri = this._baseUri + "/locations/" + encodeURIComponent(id) + detailPath;

    request(queryUri, options, type);
  };

  /**
   * Returns a series of location objects searching on their name and container.
   *
   * @param {string} term - A search term for example: Cardiff.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.search = function(term, options) {

    options.params = applyDefaults(
      this._defaultParams,
      createQueryParametersFromObject(options || {})
    );

    options.params.s = term;

    function makeSuccessCallback() {
      var successCallback = options.success,
        search = term,
        startOffset = options.params.start;
      return function(result) {
        result.metadata.search = search;
        if (startOffset) {
          result.metadata.start = startOffset;
        }
        successCallback(result);
      };
    }
    options.success = makeSuccessCallback();

    request(this._baseUri + "/locations", options, "search");
  };

  /**
   * Returns a series of location objects searching partially on their name.
   *
   * @param {string} term - A partial search term for example: Card.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.autoComplete = function(term, options) {

    options.params = applyDefaults(
      this._defaultParams,
      createQueryParametersFromObject(options || {})
    );

    options.params.s = term;
    options.params.a = "true";

    request(this._baseUri + "/locations", options, "autoComplete");
  };

  /**
   * Returns a series of location objects based on their proximity to the searched longitude / latitude.
   *
   * @param {number} lat - A valid latitude number
   * @param {number} lon - A valid longitude number.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.reverseGeocode = function(lat, lon, options) {

    options.params = applyDefaults(
      this._defaultParams,
      createQueryParametersFromObject(options || {})
    );

    options.params.lo = lon;
    options.params.la = lat;

    request(this._baseUri + "/locations", options, "reverseGeocode");
  };

  /**
   * Returns a series of location objects based on their proximity to the searched longitude / latitude.
   *
   * @param {(string|number)} id - A Geoname ID or valid postcode.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error'
   */
  API.prototype.getCookie = function(id, options) {

    options.params = options.params || {};
    options.params.id = id;

    request(this._palBaseUri + "/locator/default/shared/location.json", options, "cookie");
  };

  /**
   * Perform a request to a location endpoint.
   *
   * @param {String} path
   * @param {Object} options
   * @param {String} type
   */
  var request = function(path, options, type) {
    var script, callbackName;
    callbackName = "_locservices_core_api_cb_" + new Date().getTime() + Math.round(100000 * Math.random());

    options.params.format = "jsonp";
    options.params.jsonp = callbackName;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      if (options.success) {
        options.success(formatResponse(data, type));
      }
    };

    script = document.createElement("script");
    script.src = path + queryParams(options.params);
    if (typeof options.error === "function") {
      script.onerror = options.error;
    }
    document.body.appendChild(script);
  };

  var formatResponse = function(data, type) {
    var response = {};

    switch (type) {
      case "cookie":
        response = data;
        break;
      case "location":
        response.location = data.response;
        break;
      case "details":
        response.location = data.response.metadata.location;
        response.details = data.response.content.details.details;
        break;
      case "search":
        response.results = data.response.locations;
        response.metadata = { totalResults: data.response.totalResults };
        break;
      case "autoComplete":
        response.results = data.response.results.results;
        response.metadata = { totalResults: data.response.results.totalResults };
        break;
      case "reverseGeocode":
        response.results = data.response.results.results;
        break;
    }
    return response;
  };

  var queryParams = function(params) {
    var queries = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        queries.push(key + "=" + encodeURIComponent(params[key]));
      }
    }
    return "?" + queries.join("&");
  };

  return API;

}));
