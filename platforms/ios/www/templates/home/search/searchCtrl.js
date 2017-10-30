angular.module('searchController', [])
    .controller('searchCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$state,$timeout,$stateParams){
      var data = JSON.parse(localStorage.getItem('userdata'));
    	$scope.pageNo = 0;
    	$scope.search_con = '';
    	$scope.loadMore = function () {
          $scope.pageNo ++;
      }
    //搜索类型
    $scope.type = $stateParams.type;
    // 搜索
    $scope.searchResult=[];
    $scope.noResult = false;
    $scope.search = function(con){
	    	if ( con.length>0 ) {
		    	ApiService.ecologySiteList({
		            pageNo:$scope.pageNo,
		            pageSize:30,
		            name:encodeURI(con,'UTF-8'),
		            typeIds:''
		        }).success(function(res){
              console.log(res);
		        	$scope.searchResult = res.dataObject.result;
		        	if ( $scope.searchResult.length < 1 )
		        		$scope.noResult = true;
		        	else
		        		$scope.noResult = false;
		        })
	    	}else{
	    		$scope.searchResult=[];
	    		$scope.noResult = false;
	    	}
        console.log($scope.searchResult);
    }
    $scope.todetail = function(id,star){
      $state.go('detail',{
        index:id,
        star:star
      })
    }
});
