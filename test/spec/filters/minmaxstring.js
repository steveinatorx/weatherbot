'use strict';

describe('Filter: minMaxString', function () {

  // load the filter's module
  beforeEach(module('weatherbotApp'));

  // initialize a new instance of the filter before each test
  var minMaxString;
  beforeEach(inject(function ($filter) {
    minMaxString = $filter('minMaxString');
  }));

  it('should return the input prefixed with "minMaxString filter:"', function () {
    var text = 'angularjs';
    expect(minMaxString(text)).toBe('minMaxString filter: ' + text);
  });

});
