'use strict';

describe('Service: feedService', function () {

  // load the service's module
  beforeEach(module('weatherbotApp'));

  // instantiate service
  var feedService;
  beforeEach(inject(function (_feedService_) {
    feedService = _feedService_;
  }));

  it('should do something', function () {
    expect(!!feedService).toBe(true);
  });

});
