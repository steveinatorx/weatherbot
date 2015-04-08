'use strict';

describe('Directive: hourlyWeather', function () {

  // load the directive's module
  beforeEach(module('weatherbotApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hourly-weather></hourly-weather>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the hourlyWeather directive');
  }));
});
