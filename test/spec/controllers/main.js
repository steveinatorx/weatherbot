describe('Controller: MainCtrl', function () { 

var $controller, geolocation, createController, scope;
 
beforeEach(function() {

    module('weatherbotApp'); 

    var data = { "coords.latitude": -55, "coords.longitude":127.12342314 };

    geoMockSvc = {
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
 inject(function($controller, $rootScope, _geolocation_) {
      scope = $rootScope.$new();
      geolocation = _geolocation_;
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
