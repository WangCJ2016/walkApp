angular.module('mydataController', [])
    .controller('mydataCtrl',function($scope,ApiService,$state,$ionicViewSwitcher,$timeout,$ionicActionSheet,$cordovaFileTransfer,$cordovaImagePicker,$cordovaCamera,$ionicLoading){
      var data = JSON.parse(localStorage.getItem('userdata'));
      //console.log(data);
      $scope.userpic = data.photo;
      $scope.nickname = data.nickname;
      $scope.username = data.userName;
      $scope.sex = data.sex;
      $scope.city = data.city;
      $scope.goCity = function(res){
        $state.go('getcity',{ischange:1});
      }
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
                   var options = {
                         maximumImagesCount:1,
                         width: 100,
                         height: 100,
                         quality: 50
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
                 }else if(index == 1){
                   var options = {
                       destinationType: Camera.DestinationType.FILE_URI,
                       sourceType: Camera.PictureSourceType.CAMERA,
                   };
                   $cordovaCamera.getPicture(options).then(function(imageURI) {
                        upImages(imageURI);
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
      function upImages(imgsrc){
        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
        var options = {};
        $cordovaFileTransfer.upload(url,imgsrc, options)
         .then(function(result) {
           console.log(JSON.parse(result.response).fileUrl[0]);
           data.photo = JSON.parse(result.response).fileUrl[0];
           $scope.userpic = JSON.parse(result.response).fileUrl[0];
           ApiService.changedata({
               userId:data.userId,
               token:data.token,
               photo: data.photo
           }).success(function(res) {
             if(res.success){
               $ionicLoading.show({
                  template: "头像更换成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  localStorage.setItem('userdata',JSON.stringify(data));
                  $ionicLoading.hide();
                }, 2000);
             }
           })
         }, function(err) {
           // Error
         }, function (progress) {
           // constant progress updates
         });

      }
});
