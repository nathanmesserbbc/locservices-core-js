(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof locator === "undefined") {
      global.locator = { core: {}};
    }
    locator.core.API = factory();
  }
}(this, function() {

  "use strict";

  /**
   * Represents an API.
   * @constructor
   * @param {string} env - The Forge environment to run against.
   * @param {string} [domain] - The optional domain to make requests to.
   */
  function API(env, domain) {
    if (typeof domain === "undefined") {
      domain = "//open." + env + ".bbc.co.uk";
    }
    this.env = env;
    this.domain = domain;
  }

  /**
   * Returns a single location object via it's GeonameID or Postcode.
   *
   * @param {(string|number)} id - A Geoname ID or valid postcode.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.getLocation = function(id, options) {
    if (typeof options.params === "undefined") {
      options.params = {};
    }

    request(this.domain + "/locator/locations/" + id, options);
  };

  /**
   * Returns a single location objects details via it's GeonameID or Postcode.
   *
   * @param {(string|number)} id - A Geoname ID or valid postcode.
   * @param {(string|array)} details - A location objects details, for example: 'news', 'tv', 'radio', 'weather'
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.getDetails = function(id, details, options) {
    if (typeof options.params === "undefined") {
      options.params = {};
    }
    if (typeof details === "string") {
      details = [details];
    }
    details = details.join(",");
    request(this.domain + "/locator/locations/" + id + "/details/" + details, options);
  };

  /**
   * Returns a series of location objects searching on their name and container.
   *
   * @param {string} term - A search term for example: Cardiff.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.search = function(term, options) {
    if (typeof options.params === "undefined") {
      options.params = {};
    }
    options.params.s = term;

    request(this.domain + "/locator/locations", options);
  };

  /**
   * Returns a series of location objects searching partially on their name.
   *
   * @param {string} term - A partial search term for example: Card.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.autoComplete = function(term, options) {
    if (typeof options.params === "undefined") {
      options.params = {};
    }
    options.params.s = term;
    options.params.a = "true";

    request(this.domain + "/locator/locations", options);
  };

  /**
   * Returns a series of location objects based on their proximity to the searched longitude / latitude.
   *
   * @param {number} lat - A valid latitude number
   * @param {number} lon - A valid longitude number.
   * @param {object} [options] - An object eith the following valid properties, 'success', 'error', 'params'.
   */
  API.prototype.reverseGeocode = function(lat, lon, options) {
    if (typeof options.params === "undefined") {
      options.params = {};
    }
    options.params.lo = lon;
    options.params.la = lat;

    request(this.domain + "/locator/locations", options);
  };

  var request = function(path, options) {
    var script, callbackName;

    callbackName = "_callback" + Math.round(10000 * Math.random());

    options.params.format = "jsonp";
    options.params.jsonp = callbackName;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      if (options.success) {
        options.success(data);
      }
    };

    script = document.createElement("script");
    script.src = path + queryParams(options.params);
    script.onerror = options.error;
    document.body.appendChild(script);
  };

  var queryParams = function(params) {
    var queries = [];
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        queries.push(key + "=" + params[key]);
      }
    }
    return "?" + queries.join("&");
  };

  return API;

}));
