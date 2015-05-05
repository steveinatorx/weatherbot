'use strict';

describe('Service: socketFactory', function () {

  // load the service's module
  beforeEach(module('weatherbotApp'));

  // instantiate service
  var socketFactory;
  beforeEach(inject(function (_socketFactory_) {
    socketFactory = _socketFactory_;
  }));

  it('should do something', function () {
    expect(!!socketFactory).toBe(true);
  });

});
