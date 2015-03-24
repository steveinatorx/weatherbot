'use strict';

describe('Directive: loadAnimation', function () {

  // load the directive's module
  beforeEach(module('weatherbotApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<load-animation></load-animation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loadAnimation directive');
  }));
});
