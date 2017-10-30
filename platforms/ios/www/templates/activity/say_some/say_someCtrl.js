angular.module('say_someController', [])
    .controller('say_someCtrl',function($scope,ApiService,$state,$ionicLoading,$timeout,$cordovaImagePicker,$cordovaFileTransfer,$stateParams,$ionicModal,$ionicActionSheet,$cordovaCamera,$ionicPopup){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.site_type = [];
      //判断修改还是添加
      if($stateParams.id){
        $scope.checkedList = [];
        ApiService.etailEcologySite({id:$stateParams.id}).success(function(res){
          console.log(res);
          var typeId = res.dataObject.appTypeId;
          $scope.addr = res.dataObject.address;
          sessionStorage.setItem('addr',res.dataObject.address);
          sessionStorage.setItem('issueLng',res.dataObject.lng);
          sessionStorage.setItem('issueLat', res.dataObject.lat);
          sessionStorage.setItem('issuecityId',res.dataObject.cityId);
          sessionStorage.setItem('issuedistrictId', res.dataObject.regionId);
          $scope.discuss = {
            name:res.dataObject.name,
            tel:Number(res.dataObject.merchantPhone),
            content:res.dataObject.remark
          }
          $scope.sendpic = res.dataObject.pictures;
          var picArrs = res.dataObject.pictures.split(',');
          //picArrs[picArrs.length-1] == '' ? $scope.pics = picArrs.splice(picArrs.length-1,1):$scope.pics = picArrs;
          if(picArrs[picArrs.length-1] == ''){
            picArrs.splice(picArrs.length-1,1);
            $scope.pics = picArrs;
          }else{
            $scope.pics = picArrs;
          }
          // $scope.checkedList.push({name:}) res.dataObject.appTypeNames.split(' ');
          var typename = res.dataObject.appTypeNames.split(' ');
          var typeids = res.dataObject.appTypeIds.split(',');
          for(var i = 0;i < typename.length - 1;i++){
            $scope.checkedList.push({name:typename[i],id:typeids[i+1]});
          }
          //选择列表
          ApiService.typeList({
            type:1
          }).success(function(res){
            console.log(res);
            if(res.success){
              $scope.site_type = res.dataObject;
              for(var i = 0;i < $scope.site_type.length;i++){
                for(var j=0;j < typename.length;j++){
                  if($scope.site_type[i].name == typename[j]){
                    $scope.site_type[i].checked = true;
                    break;
                  }else{
                    $scope.site_type[i].checked = false;
                  }
                }
              }
            }
          });
          //提交修改
           $scope.submitbtn = function(){
             if(checkname()&&checkcont()&&checktype()&&checkspic()&& $scope.checkTel()){
               ApiService.updateEcologySite({
                 userId:userdata.userId,
                 token:userdata.token,
                 id:$stateParams.id,
                 name:encodeURI($scope.discuss.name,'UTF-8'),
                 remark:encodeURI($scope.discuss.content,'UTF-8'),
                 merchantPhone:$scope.discuss.tel,
                 address:encodeURI(sessionStorage.getItem('addr'),'UTF-8'),
                 lng:sessionStorage.getItem('issueLng'),
                 lat:sessionStorage.getItem('issueLat'),
                 appTypeIds:typeId,
                 cityId:sessionStorage.getItem('issuecityId'),
                 regionId:sessionStorage.getItem('issuedistrictId'),
                 pictures:$scope.sendpic
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
                       }, 2000);
                     }
                   }
               })
             }
           }
        })
      }else{
        //选择列表
        ApiService.typeList({
          type:1
        }).success(function(res){
          console.log(res);
          if(res.success){
            for(var i = 0; i<res.dataObject.length;i++){
              $scope.site_type.push(res.dataObject[i]);
              $scope.site_type[i].checked = false;
            }
          }
        });
        var typeId = ',';
        $scope.sendpic = '';
        $scope.addr = sessionStorage.getItem('addr');
        $scope.discuss = {
          name:'',
          tel:'',
          content:''
        }
        $scope.pics = [];
        $scope.checkedList = [];
        //提交添加
         $scope.submitbtn = function(){
           if(checkname()&&checkcont()&&checktype()&&checkspic()&&checkaddr()&& $scope.checkTel()){
             ApiService.addEcologySite({
               userId:userdata.userId,
               token:userdata.token,
               name:encodeURI($scope.discuss.name,'UTF-8'),
               remark:encodeURI($scope.discuss.content,'UTF-8'),
               merchantPhone:$scope.discuss.tel,
               address:sessionStorage.getItem('addr'),
               lng:sessionStorage.getItem('issueLng'),
               lat:sessionStorage.getItem('issueLat'),
               appTypeIds:typeId,
               cityId:sessionStorage.getItem('issuecityId'),
               regionId:sessionStorage.getItem('issuedistrictId'),
               pictures:$scope.sendpic
             }).success(function(res){
                 console.log(res);
                 if(res.success){
                   $ionicLoading.show({
                       template: "发布成功",
                       noBackdrop: 'true',
                     });
                     $timeout(function() {
                       $ionicLoading.hide();
                       $state.go('detail',{
                         index:res.dataObject,
                         star:0
                       });
                       sessionStorage.setItem('go',1);
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
                     }, 2000);
                   }
                 }
             })
           }
         }
      }
      //本地选择图片
      $scope.addPic = true;
      $scope.changepic = function(){
        $ionicActionSheet.show({
             buttons: [
              { text: '从相册选择图片' },
              { text: '拍照' }
             ],
               cancelText: '取消',
               cancel: function() {
               },
               buttonClicked: function(index) {
                 if(index==0){
                   if($scope.pics.length >= 9){
                     $ionicLoading.show({
                       template: "最多只能选择九张图片",
                       noBackdrop: 'true',
                     });
                     $timeout(function() {
                       $ionicLoading.hide();
                     }, 2000);
                   }else{
                     var picCounts = 9 - $scope.pics.length;
                     $scope.picsArr = [];
                     var options = {
                     maximumImagesCount: picCounts,
                     width: 400,
                     height: 400,
                     quality: 80
                    };
                     $cordovaImagePicker.getPictures(options)
                         .then(function(results) {
                           //console.log(results);
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
                 }else if(index == 1){
                   var options = {
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.CAMERA,
                   };
                   $cordovaCamera.getPicture(options).then(function(imageURI) {
                        // upImages(imageURI);
                        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
                        var options = {};
                        $cordovaFileTransfer.upload(url,imageURI, options)
                         .then(function(result) {
                           //console.log(JSON.parse(result.response).fileUrl);
                           $scope.pics.push (JSON.parse(result.response).fileUrl[0]);
                           $scope.sendpic += JSON.parse(result.response).fileUrl[0] + ',';
                            if($scope.pics.length >=9){
                              $scope.addPic = false;
                            }
                         }, function(err) {
                           // Error
                           console.log(err);
                         }, function (progress) {
                           // constant progress updates
                         });
                    }, function(err) {
                        // error
                    });
                 }
                  return true;
                // console.log(index);
                 //return true;
               }
       });
      }
      //图片上传
      function upImages(imgsrc,len){
        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
        var options = {};
        $cordovaFileTransfer.upload(url,imgsrc, options)
         .then(function(result) {
           console.log(JSON.parse(result.response).fileUrl);
           $scope.picsArr.push(JSON.parse(result.response).fileUrl[0]);
           $scope.pics.push (JSON.parse(result.response).fileUrl[0]);
           $scope.sendpic += JSON.parse(result.response).fileUrl[0] + ',';
           if($scope.picsArr.length == len){
            console.log($scope.picsArr);
            console.log($scope.pics);
            console.log($scope.sendpic);
            $ionicLoading.hide();
            if($scope.pics.length >=9){
              $scope.addPic = false;
            }
          }
         }, function(err) {
           // Error
           console.log(err);
         }, function (progress) {
           // constant progress updates
         });
      }

      //删除图片
      $scope.delpic = function(index){
        $scope.sendpic = '';
        console.log(index);
        $scope.pics.splice(index,1);
        for(var i=0;i<$scope.pics.length;i++){
          $scope.sendpic += $scope.pics[i] + ',';
        }
        console.log($scope.pics);
        console.log($scope.sendpic);
        if($scope.pics.length < 9){
          $scope.addPic = true;
        }
      }
      //判断输入框是否为空
      function checkname(){
        if($scope.discuss.name==''){
          $ionicLoading.show({
                template: "请输入地点名称",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
            return false;
        }else{
          if($scope.discuss.name.length > 12){
            $ionicLoading.show({
                  template: "名称不能超过12个字哦",
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
      function checkcont(){
        if($scope.discuss.content==''){
          $ionicLoading.show({
                template: "请输入评价",
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
      function checktype(){
        if(typeId==','){
          $ionicLoading.show({
              template: "请选择特色",
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
      function checkspic(){
        if($scope.sendpic == ''){
          $ionicLoading.show({
                template: "请输入选择图片",
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
      function checkaddr(){
        if(!sessionStorage.getItem('addr')||!sessionStorage.getItem('issueLng')||!sessionStorage.getItem('issueLat')||!sessionStorage.getItem('issuecityId')){
          $ionicLoading.show({
                template: "请选择地点",
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
      $scope.checkTel = function(){
        var telReg = /^[0-9]*$/;
        if($scope.discuss.tel == ''){
          return true;
        }else{
          if(telReg.test($scope.discuss.tel)){
            return true;
          }else{
            $ionicLoading.show({
              template: "请输入正确的手机号",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
            return false;
          }
        }
      }
      //选择类型
      $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
        $scope.checkClick = function(index,ischecked,id){
          if(ischecked == false){
            if($scope.checkedList.length >= 4){
              $ionicLoading.show({
                    template: "最多选择4个标签哦",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 2000);
            }else{
              $scope.site_type[index].checked = true;
              $scope.checkedList.push($scope.site_type[index]);
            }
          }else{
            $scope.site_type[index].checked = false;
            for(var i = 0;i < $scope.checkedList.length;i++){
              if($scope.checkedList[i].id == id){
                $scope.checkedList.splice(i,1);
              }
            }
          }
        }
      };
      $scope.closeModal = function() {
        typeId = ',';
        if($scope.checkedList != ''){
          for(var i = 0;i < $scope.checkedList.length;i++){
            typeId += $scope.checkedList[i].id + ',';
          }
        }
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

      //地图修改地点
      $ionicModal.fromTemplateUrl('mapmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal1 = modal;
      });
      $scope.openModal1 = function() {
        $scope.modal1.show();
        $scope.lngLat = [sessionStorage.getItem('issueLng'),sessionStorage.getItem('issueLat')];
        $scope.address = {
          data:''
        }
        regeocoder($scope.lngLat);
        //加载地图，调用浏览器定位服务
        $scope.map = new AMap.Map("map", {
          resizeEnable: true,
          center:  $scope.lngLat,
          zoom:16
        });
        getcity();
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
              $scope.district = data.district;
              $scope.city = data.city;
              console.log($scope.district,$scope.city);
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
      };
      $scope.closeModal1 = function() {
        $scope.modal1.hide();
        $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner>'
        });
       ApiService.getSysCity({name:encodeURI($scope.city,'UTF-8')}).success(function(res){
         console.log(res);
         if(res.success){
            ApiService.getSysCity({parentId:res.dataObject.id,name:encodeURI($scope.district,'UTF-8')}).success(function(data){
              // console.log(res.dataObject.id);
              if(data.success){
                $ionicLoading.hide();
                $scope.addr = $scope.address.data;
                 sessionStorage.setItem('addr',$scope.address.data);
                 sessionStorage.setItem('issueLng', $scope.lngLat[0]);
                 sessionStorage.setItem('issueLat', $scope.lngLat[1]);
                 sessionStorage.setItem('issuecityId',res.dataObject.id);
                 sessionStorage.setItem('issuedistrictId',data.dataObject.id);
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
      };
      //当我们用到模型时，清除它！
      $scope.$on('$destroy', function() {
        $scope.modal1.remove();
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
