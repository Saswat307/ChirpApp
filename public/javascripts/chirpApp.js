var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($http, $rootScope) {
    $rootScope.authenticated = false;
    $rootScope.current_user = '';

    $rootScope.signout = function () {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
    };
});


app.config(function ($routeProvider) {
    $routeProvider
        //the timeline display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //the login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/signup', {
            templateUrl: 'register.html',
            controller: 'signupController'
        });
});


/*
 app.factory('postService', function($http){
 var baseUrl = "/api/posts";
 var factory = {};
 factory.getAll = function(){
 return $http.get(baseUrl);
 };
 return factory;
 });
 */

app.factory('postService', function ($resource) {
    return $resource('/api/posts/:id');
});


app.controller('mainController', function ($scope, $rootScope,$interval, postService) {
    /*$scope.posts = [];*/
    console.log("1st posts called ")

        $scope.posts = postService.query();

    $scope.posts = postService.query();
    $scope.newPost = {created_by: '', text: '', created_at: ''};

    /*  postService.getAll().success(function(data){
     $scope.posts = data;
     });*/

    /*$scope.post = function () {
     $scope.newPost.created_at = Date.now();
     $scope.posts.push($scope.newPost);
     $scope.newPost = {created_by: '', text: '', created_at: ''};
     };*/

    $scope.post = function () {

        $scope.newPost.created_by = $rootScope.current_user;

        $scope.newPost.created_at = Date.now();

        console.log("before save " + $rootScope.current_user);
        postService.save($scope.newPost, function () {

            $scope.posts = postService.query();
            $scope.newPost = {created_by: '', text: '', created_at: ''};
        });
    };

});


app.controller('authController', function ($scope, $http, $rootScope, $location) {
    $scope.user = {username: '', password: ''};
    $scope.error_message = '';


    $scope.login = function () {
        $http.post('/auth/login', $scope.user).success(function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            }
            else {
                $scope.error_message = data.message;
            }
        });

    };
});

app.controller('signupController', function ($scope, $http, $rootScope, $location) {
    console.log("singup controller ")
    $scope.user = {name:'',email:'',username: '', password: ''};
    $scope.error_message = '';


    $scope.register = function () {

        $http.post('/auth/signup', $scope.user).success(function (data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $location.path('/');
            }
            else {
                $scope.error_message = data.message;
            }
        });
    };
});