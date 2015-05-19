'use strict';
/*jshint camelcase: false */
/*jshint unused: false */
/*global d3: false */

/**
 * @ngdoc function
 * @name weatherbotApp.controller:WeathergraphCtrl
 * @description
 * # WeathergraphCtrl
 * Controller of the weatherbotApp
 */
angular.module('weatherbotApp')
  .controller('WeatherGraphCtrl', function ($scope, $log, $timeout, $filter, dispatchService, iconService) {
    var imageIconRe = new RegExp('\.*/([A-Z0-9_-]{1,})\.(?:png|jpg|gif|jpeg)','i');

    $log.info('IN WEATHERGRAPHCTRL');

 $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 220,
                margin : {
                    top: 10,
                    right: 0,
                    bottom: 30,
                    left: 20
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: false,
                forceY: [30,70],
                tooltips: true,
                showValues: false,
                valueFormat: function(d){
                  return d3.format(',f')(d);
                },
                transitionDuration: 500,
                useInteractiveGuideline: false,
                color: function (d,i){
                  return $filter('heatMap')(d[1]);
                },
                xAxis: {
                    showMaxMin: true,
                    tickFormat: function(d) {
                          //return d;
                        var tickDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        tickDate.setUTCSeconds(d);
                          return d3.time.format('%_I')(new Date(tickDate));
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        //return d3.format(',.2f')(d);
                        return d3.format(',f')(d);
                    }
                },
                callback: function(){
                  $log.info('in NV CB!!!!!!!!!');
                  d3.selectAll('.nvd3 text').style('fill','rgb(157,157,157)');

                  d3.select(window).on('resize', function(){
                    $log.warn('RESIZED');

                          /*    var barG=d3.selectAll('.nv-bar');
                              var cNodes=barG[0][0].childNodes;
                              var rWidth=parseFloat(cNodes[0].attributes.width.value);*/

                   $timeout(function(){
                      var barG=d3.selectAll('.nv-bar');
                      var cNodes=barG[0][0].childNodes;

                      var newWidth=cNodes[0].attributes.width.value;
                      $log.info('resixed DELAY',newWidth);
                      d3.selectAll('.fOLabel')
                       .attr('width',newWidth);

                  },750);

                  });

                  var barG=d3.selectAll('.nv-bar');

                  var cNodes=barG[0][0].childNodes;
                  //wait for transition to finish

                 //this works
                  var rWidth=parseFloat(cNodes[0].attributes.width.value);
                  $log.info('rwidth',rWidth);

                  /*barG.append('text')
                    .attr('x', rWidth/2)
                    .attr('y', -18)
                    .attr('class', 'chartLabel')
                    //.attribute('text-anchor','middle')
                    //.attr("y", function(d) { return (y(d.y1) + y(d.y0)) / 2; }) // Center text
                    .text('foo');
                  */
                  /*
                  var rect=barG.append('rect')
                     .attr('x', 0)
                     .attr('y', 0)
                     .attr('width', rWidth)
                     .attr('height', 40)
                  */
                  var fO=barG.append('foreignObject')
                     .attr('x', 0)
                     .attr('y', -42)
                     .attr('width', rWidth)
                     .attr('height', 40);

                 var htmlLabel=fO.append('xhtml:body')
                    .style('margin',0)
                    .style('padding',0);


                 d3.selectAll('foreignObject').data($scope.hData);

                 htmlLabel.append('p')
                   .style('text-align', 'center')
                   .style('margin','0px')
                   .style('font-size','14px')
                   .style('font-family','Raleway-Bold')
                   .html(function( d,i){
                      //todo: manually stagger on small media
                      return d[1]+'<br><i class="'+iconService.getIcon(d[2])+'"></i>';
                     //return '<i class="'+iconService.getIcon(d[2])+'"></i>';
                     //return 'O';

                   });
                }
            }
        };

    $scope.$on('tickHourlyWeather',function(){
      var hWeather=_.values(dispatchService.getHourlyWeather());
      //$log.info('retrieved hourly weather',_.values(hWeather));
      var hWeatherData=[];
      var count=1;

      $scope.hourlyWeather=_.map(hWeather, function(hr){
        var hArr=[];
        hr.local_icon=imageIconRe.exec(hr.icon_url)[1];
        //hArr.push(hr.local_icon);
        hr.local_time=hr.FCTTIME.civil.replace(' AM','a').replace(' PM','p');
        hr.epoch_time=hr.FCTTIME.epoch;
        //todo:change localtime to unix timestamps and use tick format func
        hArr.push(hr.epoch_time);
        count++;
        hr.temp=parseInt(hr.temp.english);
        hArr.push(hr.temp);
        hArr.push(hr.local_icon);
        hWeatherData.push(hArr);
        return hr;
      });

      $scope.hData=[{
        'key':'hourly forecast',
        'values': hWeatherData
      }];

    });
  });
