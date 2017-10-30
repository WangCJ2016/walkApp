angular.module('issue_newController', [])
    .controller('issue_newCtrl',function($scope,ApiService,$stateParams,$ionicLoading,$state,$ionicPopup,$timeout,$ionicModal,$cordovaGeolocation){
      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>'
      });
      //加载地图，调用浏览器定位服务
      $scope.map = new AMap.Map("maps", {
        resizeEnable: true,
        zoom:16
      });
      baidu_location.getCurrentPosition(successCallback,failedCallback);
      function successCallback(data){
         ApiService.lngLat({
           locations: data.longitude +','+data.latitude,
           coordsys:'baidu',
           output:'JSON',
           key:'1cb1df08a28b941bc40050f6a9262bb1'
         }).success(function(res){
           var lnglat = res.locations.split(',');
           sessionStorage.setItem('lng',lnglat[0]);
           sessionStorage.setItem('lat',lnglat[1]);
           $scope.lngLat = [lnglat[0],lnglat[1]];
           $scope.map.setCenter($scope.lngLat);
           regeocoder($scope.lngLat);
           getcity();
           $ionicLoading.hide();
         })
       }
       function failedCallback(data){
         $scope.map.plugin('AMap.Geolocation', function() {
         geolocation = new AMap.Geolocation({
             enableHighAccuracy: true,//是否使用高精度定位，默认:true
             timeout: 10000,          //超过10秒后停止定位，默认：无穷大
             convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
             showButton: false,        //显示定位按钮，默认：true
             showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
             showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
             panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
             useNative:true
         });
           geolocation.getCurrentPosition();
           //console.log(geolocation.getCurrentPosition());
           AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
           AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
         });
         //解析定位结果
         function onComplete(data) {
           console.log(data.position.getLng(),data.position.getLat());
           sessionStorage.setItem('lng',data.position.getLng());
           sessionStorage.setItem('lat',data.position.getLat());
           $scope.lngLat = [data.position.getLng(),data.position.getLat()];
           $scope.map.setCenter($scope.lngLat);
           regeocoder($scope.lngLat);
           getcity();
           $ionicLoading.hide();
         }
        //解析定位错误信息
         function onError(data) {
           $ionicLoading.hide();
           $ionicLoading.show({
             template: "无法获取当前准确位置",
             noBackdrop: 'true',
           });
           $timeout(function() {
             $ionicLoading.hide();
           }, 2000);
           var centerLng = map.getCenter();
           sessionStorage.setItem('lng',centerLng.lng);
           sessionStorage.setItem('lat',centerLng.lat);
           $scope.lngLat = [centerLng.lng,centerLng.lat];
           $scope.map.setCenter($scope.lngLat);
           regeocoder($scope.lngLat);
           getcity();
         }
       };
      $scope.address = {
        data:''
      }
       $scope.map.on('moveend', getdata);
       function getdata(){
        $scope.lngLatObj = $scope.map.getCenter();
        $scope.lngLat = [$scope.lngLatObj.lng,$scope.lngLatObj.lat];
        regeocoder($scope.lngLatObj);
        getcity();
       }
       //获取地图中心点城市和区域
       function getcity(){
         $scope.map.getCity(function(data) {
            if(data.province == '北京市' || data.province == '天津市' || data.province == '重庆市' || data.province == '上海市'){
              $scope.district = data.district;
              $scope.city = data.province;
            }else{
              $scope.district = data.district;
              $scope.city = data.city;
            }
        });
       }
       //逆地理编码
       function regeocoder(lnglatXY) {  //逆地理编码
           var geocoder = new AMap.Geocoder({
               radius: 1000,
               extensions: "all"
           });
           geocoder.getAddress(lnglatXY, function(status, result) {
               if (status === 'complete' && result.info === 'OK') {
                   geocoder_CallBack(result);
               }
           });
       }
       function geocoder_CallBack(data) {
          $scope.address.data = data.regeocode.formattedAddress; //返回地址描述
          $scope.$apply(function() {
            $scope.address.data;
          })
       }
       //搜索地点
       $scope.search = {
         cont:''
       }
       $ionicModal.fromTemplateUrl('mymodal.html', {
         scope: $scope,
         animation: 'slide-in-up'
       }).then(function(modal) {
         $scope.modal = modal;
       });
       $scope.openModal = function() {
         $scope.modal.show();
         $scope.searchList = [];
         var autocomplete = new AMap.Autocomplete({
              //input: "tipinput"
          });
          $scope.searchsite = function(){
            if($scope.search.cont !=''){
              autocomplete.search($scope.search.cont, function(status, result){
                  //TODO:开发者使用result自己进行下拉列表的显示与交互功能
                  console.log(result);
                  if(result.info=='OK'){
                    $scope.searchList = result.tips;
                    for(var i = 0;i<$scope.searchList.length;i++){
                      if(!$scope.searchList[i].location){
                        $scope.searchList.splice(i,1);
                      }
                    }
                    console.log($scope.searchList);
                    $scope.$apply(function() {
                      $scope.address.data;
                    })
                  }else{
                    $ionicLoading.show({
                        template: "没找到你的地点哦",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();
                      }, 2000);
                  }
              });
            }else{
              $scope.searchList = [];
            }
          }
       };
       $scope.closeModal = function() {
         $scope.modal.hide();
       };
       $scope.choosesite = function(lng,lat,addr) {
         $scope.lngLat = [lng,lat];
         $scope.address.data = addr;
         $scope.map.setCenter($scope.lngLat);
         getcity();
         $scope.modal.hide();
       };
       //当我们用到模型时，清除它！
       $scope.$on('$destroy', function() {
         $scope.modal.remove();
       });
       // 当隐藏的模型时执行动作
       $scope.$on('modal.hide', function() {
         // 执行动作
       });
       // 当移动模型时执行动作
       $scope.$on('modal.removed', function() {
         // 执行动作
       });
       //点击下一步
       $scope.nextclick = function(){
          $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner>'
          });
         ApiService.getSysCity({name:encodeURI($scope.city,'UTF-8')}).success(function(res){
           console.log(res);
           if(res.success){
              ApiService.getSysCity({parentId:res.dataObject.id,name:encodeURI($scope.district,'UTF-8')}).success(function(data){
                console.log(data);
                if(data.success){
                  $ionicLoading.hide();
                   sessionStorage.setItem('addr',$scope.address.data);
                   sessionStorage.setItem('issueLng', $scope.lngLat[0]);
                   sessionStorage.setItem('issueLat', $scope.lngLat[1]);
                   sessionStorage.setItem('issuecityId',res.dataObject.id);
                   sessionStorage.setItem('issuedistrictId',data.dataObject.id);
                   $state.go('say_some');
                }else{
                  $ionicLoading.show({
                      template: "请稍后重试",
                      noBackdrop: 'true',
                    });
                    $timeout(function() {
                      $ionicLoading.hide();
                    }, 2000);
                }
              })
           }else{
             $ionicLoading.show({
                 template: "请稍后重试",
                 noBackdrop: 'true',
               });
               $timeout(function() {
                 $ionicLoading.hide();
               }, 2000);
           }
         })
       }

});
