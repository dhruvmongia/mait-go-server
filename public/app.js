function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function creatDate(){
  let date = new Date();
    return date.getDate() + "/"
                + (date.getMonth()+1)  + "/" 
                + date.getFullYear() + " @ "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
}
angular.module('formExample', [])
	.config(function ($httpProvider) {
	  $httpProvider.defaults.headers.common = {};
	  $httpProvider.defaults.headers.post = {};
	  $httpProvider.defaults.headers.put = {};
	  $httpProvider.defaults.headers.patch = {};
	})
      .controller('formController', ['$scope', '$http', function($scope, $http) {
      	$scope.timetable = {};
      var time= angular.toJson($scope.timetable);
	    $scope.sendTimeTable = function () {
            $scope.timetable.group=jsUcfirst($scope.timetable.group);
            var time= angular.toJson($scope.timetable);
		        $http.post('http://ec2-52-66-87-230.ap-south-1.compute.amazonaws.com/timetable',time,{
        headers: { 'Content-Type': 'application/json'}
    }).success(function(data, status, headers, config) {
	              alert("Success!")
	             }).error(function(data, status, headers, config) {
	               alert("Error");
	            });
	        };
      }])
  .controller('announcementController', ['$scope', '$http', function($scope, $http) {
    $scope.announcement={};
    $scope.sendAnnouncement = function () {
            $scope.announcement.group=jsUcfirst($scope.announcement.group);
            $scope.announcement.date=creatDate();
            var announcementObj= angular.toJson($scope.announcement);
            $http.post('http://ec2-52-66-87-230.ap-south-1.compute.amazonaws.com/announcement',announcementObj,{
            headers: { 'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
                    alert("Success!")
                   }).error(function(data, status, headers, config) {
                     alert("Error");
                  });
              };
  }])
  .controller('MyCtrl',['$scope','$timeout','$http','$window',function($scope,$timeout,$http,$window){
    $scope.assignment={
        files:[]
    };
    $scope.check=true;
    $scope.show=false;
    $scope.done=false;
    $scope.sendAssignment = function () {
            console.log($scope.assignment);
            $scope.assignment.group=jsUcfirst($scope.assignment.group);
            $scope.assignment.date=creatDate();
            var assignmentObj= angular.toJson($scope.assignment);
            $http.post('http://ec2-52-66-87-230.ap-south-1.compute.amazonaws.com/assignment',assignmentObj,{
            headers: { 'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
                    alert("Success!");
                    $window.location.reload();
                   }).error(function(data, status, headers, config) {
                     alert("Error");
                  });
              };
    
    function uploadFile(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            $scope.assignment.files.push(url);
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }

    /*
      Function to get the temporary signed request from the app.
      If request successful, continue to upload the file using this signed
      request.
    */
    function getSignedRequest(file){
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `assignment/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText);
            uploadFile(file, response.signedRequest, response.url);
          }
          else{
            alert('Could not get signed URL.');
          }
        }
      };
      xhr.send();
    }
    

    /*
     Function called when file input updated. If there is a file selected, then
     start upload procedure by asking for a signed request from the app.
    */
    function initUpload(){
      $timeout(function() {
        $scope.show=true;
      }, 0);
      const files = document.getElementById('file-input').files;
      if(files.length == 0){
        return alert('No file selected.');
      }
      var i;
      for(i=0; i<files.length; i++)
        getSignedRequest(files[i]);
      if(i==files.length){
          alert('Image Uploading is now complete');
            $timeout(function() {
            $scope.check=false;
            $scope.show=false;
            $scope.done=true;
          }, 0);

        }
    }
    (() => {
        document.getElementById('file-input').onchange = initUpload;
    })();
    
    
}])
.controller('MyCtrl2',['$scope','$timeout','$http','$window',function($scope,$timeout,$http,$window){
    $scope.upcoming={};
    $scope.check=true;
    $scope.show=false;
    $scope.done=false;
    $scope.sendUpcoming = function () {
            console.log($scope.upcoming);
            var upcomingObj= angular.toJson($scope.upcoming);
            $http.post('http://ec2-52-66-87-230.ap-south-1.compute.amazonaws.com/upcoming',upcomingObj,{
            headers: { 'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
                    alert("Success!");
                    $window.location.reload();
                   }).error(function(data, status, headers, config) {
                     alert("Error");
                  });
              };
    
    function uploadFile(file, signedRequest, url){
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            alert('Image Uploading is now complete');
            $timeout(function() {
            $scope.check=false;
            $scope.show=false;
            $scope.done=true;
          }, 0);
            
            console.log($scope.check);
            $scope.upcoming.imageUrl=url;
          }
          else{
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }

    /*
      Function to get the temporary signed request from the app.
      If request successful, continue to upload the file using this signed
      request.
    */
    function getSignedRequest(file){
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `upcoming/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
          if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText);
            uploadFile(file, response.signedRequest, response.url);
          }
          else{
            alert('Could not get signed URL.');
          }
        }
      };
      xhr.send();
    }
    

    /*
     Function called when file input updated. If there is a file selected, then
     start upload procedure by asking for a signed request from the app.
    */
    function initUpload(){
      $timeout(function() {
        $scope.show=true;
      }, 0);
      
      const files = document.getElementById('file-input').files;
      if(files.length == 0){
        return alert('No file selected.');
      }
      getSignedRequest(files[0]);
    }
    (() => {
        document.getElementById('file-input').onchange = initUpload;
    })();
    
    
}])
;