'use strict';


describe('Controller: MainCtrl', function () {

  var socket, mockIoSocket, $controller, geolocation, createController, scope;

beforeEach(function() {



    module('weatherbotApp');

    module('btford.socket-io');
    var data = { 'coords.latitude': -55, 'coords.longitude':127.12342314 };

    var geoMockSvc = {
      getLocation: function() {
        return {
          then: function(data) {}
          };
      }
    };

    module(function($provide){
     $provide.value('geolocation',geoMockSvc);
    });


});

beforeEach(function() {
 inject(function(socketFactory, $controller, $rootScope, _geolocation_) {
       scope = $rootScope.$new();
       geolocation = _geolocation_;

       mockIoSocket = io.connect();
      //console.log(socketFactory);

       socket = socketFactory({
        ioSocket:mockIoSocket,
        scope:scope
      });

      createController = function(params) {
        return $controller("MainCtrl", {
          $scope: scope,
          $stateParams: params || {}
        });
      };
    });
});

// Initialize the controller and a mock scope
  it('should try to call geolocation.getLocation', function () {
    //console.log(scope);
    expect(scope).toBeDefined();
    expect(geolocation).toBeDefined();
    spyOn(geolocation, 'getLocation').and.callThrough();
    createController();

    expect(geolocation.getLocation).toHaveBeenCalled();

  });
});
