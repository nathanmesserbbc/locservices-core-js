(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    return define(factory);
  } else {
    if (typeof locator === "undefined") {
      global.locator = { core: {}};
    }
    locator.core.PreferredLocation = factory();
  }
}(this, function() {

  "use strict";

  function PreferredLocation() {
    this.name = "locserv";
  }

  PreferredLocation.prototype.isSet = function() {
    if (typeof this.get() !== "undefined") {
      return true;
    }
    return false;
  };

  PreferredLocation.prototype.get = function() {
    var _name, ca, i, c;

    _name = this.name + "=";
    ca = document.cookie.split(";");

    for (i = 0; i < ca.length; i++) {
      c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(_name) === 0) {
        return c.substring(_name.length, c.length);
      }
    }
  };

  PreferredLocation.prototype.set = function(value, exdays, domain, path) {
    var date, cookieString;

    cookieString = this.name + "=" + value;

    if (typeof exdays !== "undefined") {
      date = new Date();
      date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
      cookieString += "; expires=" + date.toGMTString();
    }

    if (typeof domain !== "undefined") {
      cookieString += "; domain=" + domain;
    }

    if (typeof path !== "string") {
      path = ".bbc.co.uk";
    }

    cookieString += "; path=" + path;
    document.cookie = cookieString;
  };

  PreferredLocation.prototype.unset = function() {
    this.set("0", -1);
  };

  return PreferredLocation;

}));
