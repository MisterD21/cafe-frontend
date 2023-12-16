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
            "authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ",
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
                "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ",
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
                "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ",
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

app.controller('ProductCatelogueController', ['$scope', '$location', '$window', 'ProductCateloueService', function ($scope, $location, $window, ProductCateloueService) {
  $scope.products = [];
  $scope.showProductList = true;
  $scope.showUpdateForm = false;

  $scope.deleteProduct = function(id) {
    ProductCateloueService.deleteProduct(id)
      .then(function (response) {
        if (response.status === 200) {
          $scope.message = response.data.message;
          $window.location.reload();
        }
      })
      .catch(function (error) {
        $scope.message = 'Some error occurred!';
        console.error('Error deleting product', error);
      });
  };

  ProductCateloueService.getProducts()
    .then(function (response) {
      $scope.products = response.data;
      console.log($scope.products);
    })
    .catch(function (error) {
      $scope.message = 'Some error occurred!';
      console.error('Error fetching products', error);
    });

  $scope.updateProduct = function (product) {
    $scope.showProductList = !$scope.showProductList;
    $scope.showUpdateForm = !$scope.showUpdateForm;
    $scope.product = product;
  };

  $scope.updateProductRest = function (product) {
    console.log(product.name);
    ProductCateloueService.updateProduct(product)
      .then(function (response) {
        if (response.status === 200) {
          $scope.message = response.data.message + ' ' + product.name;
          $scope.showProductList = !$scope.showProductList;
          $scope.showUpdateForm = !$scope.showUpdateForm;
        }
      })
      .catch(function (error) {
        $scope.message = 'Some error occurred!';
        console.error('Error updating product', error);
      });
  };
}]);

app.controller('CategoryCatelogueController', ['$scope', '$location', '$window', 'CategoryCateloueService', function ($scope, $location, $window, CategoryCateloueService) {
  console.log("inside CategoryCatelogueController");
  $scope.showCategoryList=true;
  $scope.showUpdateForm=false;
  
  CategoryCateloueService.getCategories()
    .then(function (response) {
      $scope.categories = response.data;
      console.log($scope.categories);
    })
    .catch(function (error) {
      $scope.message = 'Some error occurred!';
      console.error('Error fetching Category', error);
    });

    $scope.deleteCategory = function(id) {
      CategoryCateloueService.deleteCategory(id)
        .then(function (response) {
          if (response.status === 200) {
            $scope.message = response.data.message;
            $window.location.reload();
          }
        })
        .catch(function (error) {
          $scope.message = 'Some error occurred!';
          console.error('Error deleting Category', error);
        });
    };

    $scope.updateCategory = function (category) {
      $scope.showCategoryList = !$scope.showCategoryList;
      $scope.showUpdateForm = !$scope.showUpdateForm;
      $scope.category = category;
    };

    $scope.updateCategoryRest = function (category) {
      console.log(category.name);
      CategoryCateloueService.updateCategory(category)
        .then(function (response) {
          if (response.status === 200) {
            $scope.message = response.data.message + ' ' + category.name;
            $scope.showCategoryList = !$scope.showCategoryList;
            $scope.showUpdateForm = !$scope.showUpdateForm;
          }
        })
        .catch(function (error) {
          $scope.message = 'Some error occurred!';
          console.error('Error updating product', error);
        });
    };

}]);

app.service('CategoryCateloueService', ['$http', function($http) {
  console.error('inside CategoryCateloueService');
  var apiUrl = 'http://localhost:8080/category/';
  var token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ';

  this.getCategories = function() {
    return $http.get(apiUrl + 'get', { headers: { "authorization": token } });
  };

  this.deleteCategory = function(id) {
    return $http.post(apiUrl + 'delete/' + id, null, { headers: { "authorization": token } });
  };

  this.updateCategory = function(category) {
    return $http({
              method:'POST',
              url:apiUrl+'update',
              headers: {
                  "authorization": token,
                  "Accept":"*/*",
                  "Content-Type":"application/json"
                },
              data : {
                "name": category.name,
                "id": category.id
              }
    });
  };

}]);

app.service('ProductCateloueService', ['$http', function($http) {
  console.error('inside ProductService');
  var apiUrl = 'http://localhost:8080/product/';
  var token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ';

  this.getProducts = function() {
    return $http.get(apiUrl + 'get', { headers: { "authorization": token } });
  };

  this.deleteProduct = function(id) {
    return $http.post(apiUrl + 'delete/' + id, null, { headers: { "authorization": token } });
  };

  this.updateProduct = function(product) {
    return $http({
              method:'POST',
              url:apiUrl+'update',
              headers: {
                  "authorization": token,
                  "Accept":"*/*",
                  "Content-Type":"application/json"
                },
              data : {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "status": product.status,
                "categoryId": product.category.id
              }
    });
  };
}]);


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
    $routeProvider.when('/productcatelogue', {
      templateUrl: '/serviceTemplates/productcatelogue.html',
      controller: 'ProductCatelogueController',
  });
  $routeProvider.when('/categorycatelogue', {
    templateUrl: '/serviceTemplates/categorycatelogue.html',
    controller: 'CategoryCatelogueController',
});

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);


