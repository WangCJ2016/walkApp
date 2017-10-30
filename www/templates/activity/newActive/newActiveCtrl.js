angular.module('newActiveController', [])
    .controller('newActiveCtrl',function($scope,ApiService,ionicDatePicker,$filter,$cordovaImagePicker, $ionicPopup,$ionicBackdrop,$state, $ionicLoading, $timeout,$cordovaFileTransfer){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.goback = function(){
        sessionStorage.setItem('order',2);
        history.go(-1);
      }
      //类型
      $scope.typeList = [];
      var typeid = '';
      ApiService.typeList({type:2}).success(function(res){
        console.log(res);
        if(res.success){
          $scope.typeList = res.dataObject;
        }
      })
      //选择类型
      $scope.chooseType = function(index,id){
        $scope.i = index;
        typeid = id;
      }
      //http://xiaofang-oss.oss-cn-hangzhou.aliyuncs.com/00e66289-09c7-4ae2-8b87-6ca749a32f6c.JPG
      //表单数据
      $scope.fromdata = {
        activename:'',
        activecontent:''
      }
      //验证圈子名称
      var checkactname = function(){
        if($scope.fromdata.activename == ''){
          $ionicLoading.show({
              template: "请输入圈子名称",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
              return false;
        }else{
          if($scope.fromdata.activename.length < 2 || $scope.fromdata.activename.length >12){
            $ionicLoading.show({
                template: "名称在2-12个字之间",
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
      //验证圈子类型
      var checkacttype = function(){
        if(typeid == ''){
          $ionicLoading.show({
              template: "请选择圈子类别",
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
      //验证圈子内容简介
      var checkactcontent = function(){
        if($scope.fromdata.activecontent == ''){
          $ionicLoading.show({
              template: "请输入圈子内容简介",
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
      //验证圈子头像图片
      var checkactpic = function(){
        if($scope.sendpic == ''){
          $ionicLoading.show({
              template: "请选择圈子头像",
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
      $scope.sendpic = '';
      //$scope.addPic = true;
      $scope.filepic = function(){
        var options = {
        maximumImagesCount: 1,
        width: 400,
        height: 400,
        quality: 50
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
               upImages(results[0]);
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
      //图片上传
      function upImages(imgsrc){
        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
        var options = {};
        $cordovaFileTransfer.upload(url,imgsrc, options)
         .then(function(result) {
           console.log(JSON.parse(result.response).fileUrl);
           $scope.sendpic = JSON.parse(result.response).fileUrl[0];
            console.log($scope.sendpic);
         }, function(err) {
           // Error
         }, function (progress) {
           // constant progress updates
         });
      }
      //提交
      $scope.submitbtn = function(){
        //console.log($scope.fromdata);
        if(checkactname()&&checkacttype()&&checkactpic()&&checkactcontent()){
          ApiService.addEcologyCircle({
            userId:userdata.userId,
            token:userdata.token,
            photo:$scope.sendpic,
            name:encodeURI($scope.fromdata.activename,'UTF-8'),
            remark:encodeURI($scope.fromdata.activecontent,'UTF-8'),
            appTypeId:typeid
          }).success(function(res){
              if(res.success){
                $ionicLoading.show({
                    template: "添加成功",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                    $state.go('tab.activity');
                    sessionStorage.setItem('order',2);
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
});
