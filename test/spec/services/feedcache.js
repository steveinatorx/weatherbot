'use strict';

describe('Service: feedCache', function () {

  // load the service's module
  beforeEach(module('weatherbotApp'));

  // instantiate service
  var feedCache;
  beforeEach(inject(function (_feedCache_) {
    feedCache = _feedCache_;
  }));

  it('should do something', function () {
    expect(!!feedCache).toBe(true);
  });

});
