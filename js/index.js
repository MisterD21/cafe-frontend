/// <reference path="angular.min.js" />
var app = angular.module('myApp', ['ngRoute']);

app.controller('HomeController', function ($scope, $location) {
    console.log("inside homeController");
    // Your controller logic
});

app.controller('ProductController', function ($scope, $http, $location) {
    console.log("inside product controller");

    $http({
        method:'GET',
        url:'http://localhost:8080/category/get',
        headers: {
            "Accept":"*/*",
            "Content-Type":"application/json"
          }
        })
  .then(function (response) {
    console.log("inside success response product controller");
    $scope.categories = response.data.categories;
  })
  .catch(function(error) {
    console.log('error is '+error);
  });

    $scope.validateForm = function () {
        // Custom validation for numeric fields
        if (!isNumeric($scope.productPrice)) {
            console.log($scope.productPrice);
            alert("Price must be numeric.");
            return false;
        }

        // Your additional validation logic here

        return true;
    };

    function isNumeric(value) {
        return /^\d+$/.test(value);
    }

    $scope.add = function(){
        console.log($scope.productName);
        console.log($scope.selectedCategory);
        console.log($scope.productDescription);
        console.log($scope.productPrice);
        $http({
            method:'POST',
            url:'http://localhost:8080/product/add',
            headers: {
                "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjU4MjIwOSwiZXhwIjoxNzAyNjE4MjA5fQ.bQn7VdWP2mtwPzUVRsCdqBTQM9aAMT_zQaffFx0-P5I",
                "Accept":"*/*",
                "Content-Type":"application/json"
              },
            data: {
                    "name": $scope.productName,
                    "categoryId": $scope.selectedCategory,
                    "description": $scope.productDescription,
                    "price": $scope.productPrice
                }
        })
      .then(function (response) {
        $scope.message = 'Product successfully added!';
        $scope.productName = '';
        $scope.selectedCategory = '';
        $scope.productDescription = '';
        $scope.productPrice = '';
      })
      .catch(function(error) {
        $scope.message = 'Some error occured!';
        console.log('error is '+error);
        console.log('error is '+error.data);
      });
    }

    // $scope.goBack = function(){
    //     $location.path('/product');
    // }
});

app.controller('CategoryController', function ($scope, $http) {
    $scope.addCategory = function(){
        console.log($scope.categoryName);
        $http({
            method:'POST',
            url:'http://localhost:8080/category/add',
            headers: {
                "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjU4MjIwOSwiZXhwIjoxNzAyNjE4MjA5fQ.bQn7VdWP2mtwPzUVRsCdqBTQM9aAMT_zQaffFx0-P5I",
                "Accept":"*/*",
                "Content-Type":"application/json"
              },
            data: {
                    "name": $scope.categoryName
                }
        })
      .then(function (response) {
        $scope.message = 'Category successfully added!';
        $scope.categoryName = '';
      })
      .catch(function(error) {
        $scope.message = 'Some error occured!';
        console.log('error is '+error);
        console.log('error is '+error.data);
      });
    }

   
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/index', {
        templateUrl: 'index.html',
        controller: 'HomeController',
    });
    $routeProvider.when('/about', {
        templateUrl: 'about.html',
    });
    $routeProvider.when('/home', {
        templateUrl: 'home.html',
    });
    $routeProvider.when('/services', {
        templateUrl: 'services.html',
    });
    $routeProvider.when('/product', {
        templateUrl: '/serviceTemplates/addproduct.html',
        controller: 'ProductController',
    });
    $routeProvider.when('/category', {
        templateUrl: '/serviceTemplates/addcategory.html',
        controller: 'CategoryController',
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);