angular.module('issue_postController', [])
    .controller('issue_postCtrl',function($scope,ApiService,$cordovaImagePicker, $state, $ionicLoading, $timeout,$ionicModal,$stateParams,$cordovaCamera,$cordovaFileTransfer,$ionicPopup){
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
         console.log("lontitude:" + data.longitude);
         console.log("latitude:" + data.latitude);
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
         }
       };
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      var marker = [];
      //判断修改还是添加
      if($stateParams.postid){
        $scope.choosesitelist = [];
        ApiService.detailEcologyCirclePost({id:$stateParams.postid}).success(function(res){
          //console.log(res);
          if(res.success){
            $scope.sendDate = {
              title:res.dataObject.title,
              content:res.dataObject.contents
            }
            $scope.id = res.dataObject.siteIds;
            $scope.sendpic = res.dataObject.pictures;
            var cityid = res.dataObject.cityId;
            var nowPic = res.dataObject.pictures.split(',');
            nowPic[nowPic.length-1] == '' ? $scope.sendpicArr = nowPic.splice(nowPic.length-1,1):$scope.sendpicArr = nowPic;
            if(nowPic[nowPic.length-1] == ''){
              nowPic.splice(nowPic.length-1,1);
              $scope.sendpicArr = nowPic;
            }else{
              $scope.sendpicArr = nowPic;
            }
            //一关联地点
            for(var i = 0;i<res.dataObject.siteList.length;i++){
              $scope.choosesitelist.push(res.dataObject.siteList[i]);
              var typeNames = res.dataObject.siteList[i].appTypeNames.split(' ');
              if(typeNames[typeNames.length-1] == ''){
                typeNames.splice(typeNames.length - 1,1);
                $scope.choosesitelist[i].typeNames = typeNames;
              }else{
                $scope.choosesitelist[i].typeNames = typeNames
              }
            }
            $scope.submitBtn = function(){
              if(checktitle()&&checkcont()&&checkpic()){
                ApiService.updateEcologyCirclePost({
                  userId:userdata.userId,
                  token:userdata.token,
                  cityId:cityid,
                  id:$stateParams.postid,
                  title:encodeURI($scope.sendDate.title,'UTF-8'),
                  contents:encodeURI($scope.sendDate.content,'UTF-8'),
                  siteId:$scope.id,
                  pictures:$scope.sendpic,
                  lng:res.dataObject.lng,
                  lat:res.dataObject.lat
                }).success(function(res){
                  console.log(res);
                  if(res.success){
                    $ionicLoading.show({
                        template: "修改成功",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();
                        history.go(-1);
                      }, 2000);
                  }else{
                    if(res.msgCode){
                      var myPopup = $ionicPopup.show({
                         title: '您的账号在另一设备登录,请重新登录并修改密码',
                         //scope: $scope,
                         buttons: [
                           {
                             text: '<b>确定</b>',
                             type: 'button-positive',
                             onTap: function(e) {
                               localStorage.removeItem('userdata');
                               $state.go('login');
                             }
                           },
                         ]
                       });
                    }else{
                      $ionicLoading.show({
                        template: "系统异常，请稍后重试",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();
                        history.go(-1);
                      }, 2000);
                    }
                  }
                })
              }
            }
          }
        })
      }else{
        $scope.sendDate = {
          title:'',
          content:''
        }
        $scope.id = ',';
        $scope.sendpic = '';
        $scope.sendpicArr = [];
        $scope.choosesitelist = [];
        $scope.submitBtn = function(){
          console.log(sessionStorage.getItem('lng'),sessionStorage.getItem('lat'));
          if(checktitle()&&checkcont()&&checkpic()){
            ApiService.addEcologyCirclePost({
              userId:userdata.userId,
              token:userdata.token,
              cityId:localStorage.getItem('cityId'),
              parentId:$stateParams.id,
              title:encodeURI($scope.sendDate.title,'UTF-8'),
              contents:encodeURI($scope.sendDate.content,'UTF-8'),
              siteId:$scope.id,
              pictures:$scope.sendpic,
              lng:sessionStorage.getItem('lng'),
              lat:sessionStorage.getItem('lat')
            }).success(function(res){
              if(res.success){
                $ionicLoading.show({
                    template: "添加成功",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                    history.go(-1);
                  }, 2000);
              }else{
                if(res.msgCode){
                  var myPopup = $ionicPopup.show({
                     title: '您的账号在另一设备登录,请重新登录并修改密码',
                     //scope: $scope,
                     buttons: [
                       {
                         text: '<b>确定</b>',
                         type: 'button-positive',
                         onTap: function(e) {
                           localStorage.removeItem('userdata');
                           $state.go('login');
                         }
                       },
                     ]
                   });
                }else{
                  $ionicLoading.show({
                    template: "系统异常，请稍后重试",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                    history.go(-1);
                  }, 2000);
                }
              }
            })
          }
        }
      }

      //验证名称
      function checktitle(){
        if($scope.sendDate.title == ''){
          $ionicLoading.show({
                template: "请输入标题",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
            return false;
        }else{
          if($scope.sendDate.title.length > 20){
            $ionicLoading.show({
                  template: "标题不能超过20个字",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
              return false;
          }else{
              return true;
          }
        }
      }
      //验证内容
      function checkcont(){
        if($scope.sendDate.content == ''){
          $ionicLoading.show({
                template: "请输入内容",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
            return false;
        }else{
            return true;
        }
      }
      //验证图片
      function checkpic(){
        if($scope.sendpic == ''){
          $ionicLoading.show({
              template: "请选择图片",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
          return false;
        }else{
            return true;
        }
      }
      //本地选择图片
      $scope.usecamera = function(){
        if($scope.sendpicArr.length >= 9){
          $ionicLoading.show({
              template: "最多选择9张图片",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
        }else{
          var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
          };
          $cordovaCamera.getPicture(options).then(function(imageURI) {
              //  upImages(imageURI);
               var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
               var options = {};
               $cordovaFileTransfer.upload(url,imageURI, options)
                .then(function(result) {
                  console.log(JSON.parse(result.response).fileUrl[0]);
                  $scope.sendpicArr.push(JSON.parse(result.response).fileUrl[0]);
                  $scope.sendpic += JSON.parse(result.response).fileUrl[0] + ',';
                }, function(err) {
                  // Error
                }, function (progress) {
                  // constant progress updates
                });
           }, function(err) {
               // error
           });
        }
      }
      $scope.filepic = function(){
        if($scope.sendpicArr.length >= 9){
          $ionicLoading.show({
              template: "最多选择9张图片",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
        }else{
          $scope.picsArr = [];
          var options = {
          maximumImagesCount: 9,
          width: 400,
          height: 400,
          quality: 80
         };
         $cordovaImagePicker.getPictures(options)
             .then(function(results) {
               console.log(results);
               if(results.length == 0){
                   $ionicLoading.show({
                       template: "已取消",
                       noBackdrop: 'true',
                     });
                     $timeout(function() {
                       $ionicLoading.hide();
                     }, 2000);
               }else{
                 for (var i = 0; i < results.length; i++) {
                     upImages(results[i],results.length);
                 }
                 $ionicLoading.show({
                   template: '<ion-spinner icon="ios"></ion-spinner>'
                 });
               }
             }, function(error) {
               $ionicLoading.show({
                   template: "已取消",
                   noBackdrop: 'true',
                 });
                 $timeout(function() {
                   $ionicLoading.hide();
                 }, 2000);
             });
        }
      }
      //图片上传
      function upImages(imgsrc,len){
        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
        var options = {};
        $cordovaFileTransfer.upload(url,imgsrc, options)
         .then(function(result) {
           console.log(JSON.parse(result.response).fileUrl[0]);
           $scope.picsArr.push(JSON.parse(result.response).fileUrl[0]);
           $scope.sendpicArr.push(JSON.parse(result.response).fileUrl[0]);
           $scope.sendpic += JSON.parse(result.response).fileUrl[0] + ',';
          if($scope.picsArr.length == len){
            console.log($scope.picsArr);
            $ionicLoading.hide();
          }
         }, function(err) {
           // Error
         }, function (progress) {
           // constant progress updates
         });
      }
      //删除图片
      $scope.delpic = function(index){
        $scope.sendpic = '';
        console.log(index);
        $scope.sendpicArr.splice(index,1);
        for(var i=0;i<$scope.sendpicArr.length;i++){
          $scope.sendpic += $scope.sendpicArr[i] + ',';
        }
        console.log($scope.sendpicArr);
        console.log($scope.sendpic);
      }

      //跳地点转详情页
      $scope.todetail = function(id,star){
        $state.go('detail',{
          index:id,
          star:star
        })
      }
      //关联地点modal层
      $ionicModal.fromTemplateUrl('mymodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
        $scope.map = new AMap.Map("mapList", {
          resizeEnable: true,
          center:[sessionStorage.getItem('lng'),sessionStorage.getItem('lat')],
          zoom:16
        });
        $scope.searchName = {
          name:''
        }
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.reportsitelist = [];
        $scope.loadMore = function () {
          $scope.pageNo ++;
          siteList($scope.pageNo);
        }
        siteList($scope.pageNo,'');
        function siteList(pageNo,name){
          ApiService.ecologySiteList({
            //userId:userdata.userId,
            pageNo:pageNo,
            pageSize:5,
            //cityId:sessionStorage.getItem('nowcityId'),
            name:name
          }).success(function(res){
            console.log(res);
            if(res.dataObject.result.length == 0){
              $scope.hasmore = false;
              return;
            }else{
              for(var i=0;i<res.dataObject.result.length;i++){
                $scope.reportsitelist.push(res.dataObject.result[i]);
                if(marker.length<10){
                  marker.push({position: [res.dataObject.result[i].lng, res.dataObject.result[i].lat]});
                }
                if($scope.choosesitelist.length > 0){
                  for(var j=0;j < $scope.choosesitelist.length;j++){
                    if(res.dataObject.result[i].id == $scope.choosesitelist[j].id){
                      $scope.reportsitelist[$scope.reportsitelist.length-1].checked = true;
                      break;
                    }else{
                      $scope.reportsitelist[$scope.reportsitelist.length-1].checked = false;
                    }
                  }
                }else{
                  $scope.reportsitelist[$scope.reportsitelist.length-1].checked = false;
                }
                var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
                if(typeNames[typeNames.length-1] == ''){
                  typeNames.splice(typeNames.length - 1,1);
                  $scope.reportsitelist[$scope.reportsitelist.length - 1].typeNames = typeNames;
                }else{
                  $scope.reportsitelist[$scope.reportsitelist.length - 1].typeNames = typeNames
                }
                $scope.reportsitelist[$scope.reportsitelist.length - 1].pic = res.dataObject.result[i].pictures.split(',')[0];
              }
            }
            console.log(marker);
            marker.forEach(function(marker) {
                var _marker = new AMap.Marker({
                    map: $scope.map,
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    position: [marker.position[0], marker.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    clickable : true ,
                });
                $scope.map.setFitView();
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
          //点击选择
          $scope.checkClick = function(index,ischecked,id){
            if(ischecked == false){
              if($scope.choosesitelist.length >= 5){
                $ionicLoading.show({
                      template: "最多关联5个地点",
                      noBackdrop: 'true',
                    });
                    $timeout(function() {
                      $ionicLoading.hide();
                    }, 2000);
              }else{
                $scope.reportsitelist[index].checked = true;
                $scope.choosesitelist.push($scope.reportsitelist[index]);
              }
            }else{
              $scope.reportsitelist[index].checked = false;
              for(var i = 0;i < $scope.choosesitelist.length;i++){
                if($scope.choosesitelist[i].id == id){
                  $scope.choosesitelist.splice(i,1);
                }
              }
            }
          }
        }
        $scope.searchSite = function(){
          console.log($scope.searchName.name);
          $scope.hasmore = true;
          $scope.pageNo = 1;
          $scope.reportsitelist = [];
          siteList($scope.pageNo,encodeURI($scope.searchName.name,'UTF-8'));
        }
      };
      $scope.closeModal = function() {
        $scope.id = ',';
        if($scope.choosesitelist != ''){
          for(var i = 0;i < $scope.choosesitelist.length;i++){
            $scope.id += $scope.choosesitelist[i].id + ',';
          }
        }
        console.log($scope.id);
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
});
