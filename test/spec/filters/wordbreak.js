'use strict';

describe('Filter: wordBreak', function () {

  // load the filter's module
  beforeEach(module('weatherbotApp'));

  // initialize a new instance of the filter before each test
  var wordBreak;
  beforeEach(inject(function ($filter) {
    wordBreak = $filter('wordBreak');
  }));

  it('should return a one word input with a <br> tag appended:"', function () {
    var text = 'angular js';
    expect(wordBreak(text)).toBe('angular<br>js');
  });

});
