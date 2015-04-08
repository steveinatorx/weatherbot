'use strict';

describe('Service: iconService', function () {

  // load the service's module
  beforeEach(module('weatherbotApp'));

  // instantiate service
  var iconService;
  beforeEach(inject(function (_iconService_) {
    iconService = _iconService_;
  }));

  it('should do something', function () {
    expect(!!iconService).toBe(true);
  });

});
