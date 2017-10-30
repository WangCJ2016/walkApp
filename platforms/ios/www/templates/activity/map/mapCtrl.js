angular.module('mapController', [])
    .controller('mapCtrl',function($scope,$ionicActionSheet,$cordovaAppAvailability,$stateParams, $ionicPopup){
      var button = document.getElementById('bt');
      $scope.lngLat = [$stateParams.addrLng,$stateParams.addrLat];
      //加载地图，调用浏览器定位服务
      $scope.map = new AMap.Map('container', {
        resizeEnable: true,
        center:  $scope.lngLat,
        zoom:16
      });
      marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: $scope.lngLat
      });
      marker.setMap($scope.map);
      $scope.map.setFitView();
      $scope.mapCont = {
        addr:$stateParams.addr,
        name:$stateParams.name
      }
      //判断是否安装高德地图
      $cordovaAppAvailability.check('com.autonavi.minimap')
      .then(function() {
        //构造路线导航类
          //  AMap.plugin(["AMap.Driving"], function() {
          //     var drivingOption = {
          //         policy:AMap.DrivingPolicy.LEAST_TIME,
          //         map:$scope.map
          //     };
          //     var driving = new AMap.Driving(drivingOption); //构造驾车导航类
          //     //根据起终点坐标规划驾车路线
          //     driving.search(new AMap.LngLat(sessionStorage.getItem('lng'), sessionStorage.getItem('lat')), new AMap.LngLat($stateParams.addrLng, $stateParams.addrLat));
          // });
          $scope.navigation = function(){
            $ionicActionSheet.show({
                 buttons: [
                   { text: '高德地图'}
                 ],
                   cancelText: '取消',
                   cancel: function() {
                   },
                   buttonClicked: function(index) {
                      console.log(index);
                      if(index==0){
                          location.href="androidamap://navi?sourceApplication=appname&poiname=fangheng&lat="+$stateParams.addrLat+"&lon="+$stateParams.addrLng+"&dev=1&style=2"
                      }
                     return true;
                   }
           });
          }
        }, function () {
          AMap.plugin(["AMap.Driving"], function() {
             var drivingOption = {
                 policy:AMap.DrivingPolicy.LEAST_TIME,
                 //map:$scope.map
             };
             var driving = new AMap.Driving(drivingOption); //构造驾车导航类
             //根据起终点坐标规划驾车路线
             driving.search(new AMap.LngLat(sessionStorage.getItem('lng'), sessionStorage.getItem('lat')), new AMap.LngLat($stateParams.addrLng, $stateParams.addrLat),function(status,result){
               button.onclick = function(){
                 var myPopup = $ionicPopup.show({
                    title: '是否打开高德地图网页版',
                    buttons: [
                      { text: '取消' },
                      {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                          driving.searchOnAMAP({
                              origin:result.origin,
                              destination:result.destination
                          });
                        }
                      },
                    ]
                  });
                }
             });
         });
        });

});
