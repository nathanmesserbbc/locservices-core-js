Locator CoreJS - API
====================

Locator CoreJS API module is a library for making requests to the locator API.

Installation
------------

The API component is available to install via Bower:

    bower install --save-dev BBC-Location-Services/locator-core-api#0.1.0


Usage
-----

To load up a new instance of the API you'll need to pass an environment to the constructor. The API uses the open endpoints for it's requests:

| Env   | URL                                  |
| ----- | ------------------------------------ |
| int   | https://open.int.bbc.co.uk/locator   |
| test  | https://open.test.bbc.co.uk/locator  |
| stage | https://open.stage.bbc.co.uk/locator |
| live  | https://open.live.bbc.co.uk/locator  |

For example if we wanted to route all requests through: `https://open.stage.bbc.co.uk/locator`

````
var api = new locator.core.API("stage");
````

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

### Details

Returns a single location objects details via it's GeonameID or Postcode.

````
api.getDetails(2643743, ["news", "tv", "radio"], {
  success: function(data) {
    console.log(data);
  }
});
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
