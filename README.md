Locator CoreJS Modules
====================

[![Build Status](https://travis-ci.org/BBC-Location-Services/locator-core-js.svg)](https://travis-ci.org/BBC-Location-Services/locator-core-js)

* [API module](#api-module)
* [Shared module](#shared-module)

Installation
------------

The API component is available to install via Bower:

    bower install --save-dev BBC-Location-Services/locator-core-js#0.1.0


## API module

Locator CoreJS API module is a library for making requests to the locator API.

Usage
-----

To load up a new instance of the API you only need to invoke it's constructor. By default this will route all requests through the `//open.live.bbc.co.uk/locator` endpoint.

````
var api = new locator.core.API();
````

The API uses the open endpoints for it's requests if you pass an optional `{env: "test"}` to the constructor:

| Env            | URL                            |
| -----          | ------------------------------ |
| int            | //open.int.bbc.co.uk/locator   |
| test           | //open.test.bbc.co.uk/locator  |
| stage          | //open.stage.bbc.co.uk/locator |
| live (default) | //open.live.bbc.co.uk/locator  |

For example if we wanted to route all requests through the stage environment: `https://open.stage.bbc.co.uk/locator`

````
var api = new locator.core.API({ env: "stage" });
````

If you want to pass all requests to a separate domain, then you can optionally pass a `{ domain: "https://api.test.bbc.co.uk/locator" }` option to the constructor.

### Options / parameters

All 4 endpoint requests, `getLocation`, `search`, `autoComplete` and `reverseGeocode` should at the very least have a `success` callback passed to them to get access to the data returned by the endpoint. You can also pass an optional `error` method to handle any errors returned by the locator endpoint.

You may also pass some optional parameters to the endpoints such as:

| Name        | Type    | Default | Description                                                                     |
| ----------- | ------- | ------- | ------------------------------------------------------------------------------- |
| language    | text    | EN      | The language to search in and return.                                           |
| start       | number  | 0       | The start index.                                                                |
| rows        | number  | 10      | The maximum number of rows to return.                                           |
| filter      | text    |         | The filter to apply to the search. Valid values are domestic and international. |
| countries   | text    |         | The countries to filter by.                                                     |
| place-types | text    |         | The place types to filter by.                                                   |
| vv          | number  | 1       | The version of the XML/JSON to return. vv should be set to 2 for new clients.   |


### Location

Retrieve a single location object via it's GeonameID or Postcode.

````
api.getLocation(2643743, {
  success: function(data) {
    console.log(data);
  },
  error: function(event) {
    console.log("Error handler: ", event);
  }
});
````

This returns the following location object:

````
{
  location: {
    admin1: {
      id: 2634895,
      link: "locations/2634895"
    },
    name: "Wales",
    country: "GB",
    id: "CF5",
    language: "en",
    latitude: 51.47975161228911,
    longitude: -3.2643369828970714,
    name: "CF5",
    placeType: "district",
    timezone: "Europe/London"
  }
}
````

### Details

Returns a single location object and it's associates details via it's GeonameID or Postcode.

````
api.getLocation(2643743, {
  details: ["news", "tv", "radio"],
  success: function(data) {
    console.log(data);
  }
});
````

This returns the following location object with it's details:

````
{
  details: [{
    data: {
      name: "South East Wales",
      tld: "southeastwales"
    },
    detailType: "news",
    distance: 15219,
    externalId: "53",
    latitude: 51.61326398374286,
    longitude: -3.234201117489571
  }, ...],
  location: {
    admin1: {
      id: 2634895,
      link: "locations/2634895"
    },
    name: "Wales",
    country: "GB",
    id: "CF5",
    language: "en",
    latitude: 51.47975161228911,
    longitude: -3.2643369828970714,
    name: "CF5",
    placeType: "district",
    timezone: "Europe/London"
  }
}
````

### Search

Returns a series of location objects searching on their name and container.

````
var api = new API('int');

api.search('Cardiff', {
  params: {
    rows: 100
  },
  success: function (data) {
    console.log( data );
  }
});
````

This returns the following location results:

````
{
  metadata: {
    totalResults: 84
  },
  results: [{
    container: "Cardiff",
    country: "GB",
    id: "2653822",
    language: "en",
    latitude: 51.48,
    longitude: -3.18,
    name: "Cardiff",
    placeType: "settlement"
  }, ...]
}
````

### AutoComplete

Returns a series of location objects searching partially on their name.

````
api.autoComplete("Card", {
  params: {
    language: "CY"
  },
  success: function(data) {
    console.log(data);
  }
});
````

This returns the following location results:

````
{
  metadata: {
    totalResults: 30
  },
  results: [{
    container: "Cheshire",
    id: "7298877",
    language: "en",
    name: "Carden"
  }, ...]
}
````

### ReverseGeocode

Returns a series of location objects based on their proximity to the searched longitude / latitude.

````
api.reverseGeocode(51.481581, -3.17909, {
  success: function(data) {
    console.log(data);
  },
  error: function(event) {
    console.log("Error handler: ", event);
  }
});
````

This returns the following location results:

````
{
  results: [{
    container: "French Guiana",
    distance: 126898.53,
    id: "3382160",
    isWithinContext: true,
    language: "en",
    name: "Cayenne"
  }, ...]
}
````

### Cookie

Returns a compressed cookie based on the location (geonameID or Postcode) passed in: 

````
api.getCoolie("CF5", {
  success: function(data) {
    console.log(data);
  }
});
````

This returns the following cookie details for use in the locserv cookie:

````
{
  type: "location",
  id: "CF5",
  name: "CF5",
  cookie: "1#l1#i=CF5:n=CF5:h=w@w1#i=2071:p=Barry@d1#1=wa:2=w:3=w:4=44.9@n1#r=53",
  expires: "1434184279"
}
````

### RequireJS

If RequireJS is available in the page then the component can be safely included via require:

````
require(['path/to/module/api'], function(API) {

  var api = new API('live');

});
````


Developing
----------

To start development make sure node is installed and run:

    npm install


### QUnit Tests

To run the unit tests use:

    grunt test

This start a local test server on localhost:9999 to run the tests against. The tests are relient on the Node connect server as the fixtures are dynamically created due to their random callback.


### Javascript Linting

To lint the javascipt files use:

    grunt jshint

This will run jshint with rules defined in the .jshintrc files.

### Javascript CodeSniffer

To code sniff the javascript files use:

    grunt jscs
