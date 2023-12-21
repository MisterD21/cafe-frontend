/// <reference path="angular.min.js" />
var app = angular.module('myApp', ['ngRoute']);

app.controller('LoginController', function ($rootScope, $scope, $location, AuthService, TokenService) {
  console.log("inside LoginController");
  $rootScope.authenticated = false;
  $scope.login = function() {
    console.log($scope.email,$scope.password);
      AuthService.login($scope.email,$scope.password) 
          .then(function(responseData) {
            if (responseData.status===200) {
              $rootScope.sharedVariable = 'Bearer '+responseData.data.message;
              console.log($rootScope.sharedVariable);
              $rootScope.authenticated = !$rootScope.authenticated;
              TokenService.setAuthToken('Bearer '+responseData.data.message);
              console.log($scope.authenticated);
              $location.path('/home');
            } else {
              $scope.authenticated = !$scope.authenticated;
            }
          })
          .catch(function(error) {
            console.log(error);
              alert('Invalid credentials');
          });
  };

  $scope.logout = function(){
    TokenService.clearAuthToken();
    $rootScope.authenticated = !$rootScope.authenticated;
    $scope.location('/login');
  }
});

app.controller('ProductController', function ($rootScope, $scope, $http, $location, TokenService, CategoryCateloueService) {
    console.log("inside product controller");
    var token = TokenService.getAuthToken();
    
    if(token){
      CategoryCateloueService.getCategories(token)
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
        
        $http({
            method:'POST',
            url:'http://localhost:8080/product/add',
            headers: {
                "authorization": token,
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

  }else{

  }

    
});

app.controller('CategoryController', function ($scope, $http, TokenService) {
  var token = TokenService.getAuthToken();
    $scope.addCategory = function(){
        console.log($scope.categoryName);
        $http({
            method:'POST',
            url:'http://localhost:8080/category/add',
            headers: {
                "authorization": token,
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

app.controller('ProductCatelogueController', ['$rootScope', '$scope', '$location', '$window', 'ProductCateloueService', 'TokenService', 
function ($rootScope, $scope, $location, $window, ProductCateloueService, TokenService) {
  $scope.products = [];
  $scope.showProductList = true;
  $scope.showUpdateForm = false;
  var token = TokenService.getAuthToken();
  console.log('ljhkjk=>'+token);

  ProductCateloueService.getProducts(token)
  .then(function (response) {
    $scope.products = response.data;
    console.log($scope.products);
  })
  .catch(function (error) {
    $scope.message = 'Some error occurred!';
    console.error('Error fetching products', error);
  });

  $scope.deleteProduct = function(id) {
    ProductCateloueService.deleteProduct(id, token)
    
      .then(function (response) {
        if (response.status === 200) {
          $scope.message = response.data.message;
          $location.path('/productcatelogue');
        }
      })
      .catch(function (error) {
        $scope.message = 'Some error occurred!';
        console.error('Error deleting product', error);
      });
  };

  $scope.updateProduct = function (product) {
    $scope.showProductList = !$scope.showProductList;
    $scope.showUpdateForm = !$scope.showUpdateForm;
    $scope.product = product;
  };

  $scope.updateProductRest = function (product) {
    console.log(product.name);
    ProductCateloueService.updateProduct(product, token)
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

app.controller('CategoryCatelogueController', ['$scope', '$location', '$window', 'CategoryCateloueService', 'TokenService', 
function ($scope, $location, $window, CategoryCateloueService, TokenService) {
  console.log("inside CategoryCatelogueController");
  $scope.showCategoryList=true;
  $scope.showUpdateForm=false;
  var token = TokenService.getAuthToken();

  CategoryCateloueService.getCategories(token)
    .then(function (response) {
      $scope.categories = response.data;
      console.log($scope.categories);
    })
    .catch(function (error) {
      $scope.message = 'Some error occurred!';
      console.error('Error fetching Category', error);
    });

    $scope.deleteCategory = function(id) {
      CategoryCateloueService.deleteCategory(id, token)
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
      CategoryCateloueService.updateCategory(category, token)
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

app.controller('BillingController', function ($scope, $location, 
  CategoryCateloueService, TokenService, ProductCateloueService, BillingService) {
  console.log("inside BillingController");

  var token = TokenService.getAuthToken();

  // getting list of categories
  CategoryCateloueService.getCategories(token)
  .then(function (response) {
    console.log("inside success response categories controller");
    $scope.categories = response.data.categories;
  })
  .catch(function(error) {
    console.log('error is '+error);
  });

  // getting list of products
  ProductCateloueService.getProducts(token)
  .then(function (response) {
    console.log("inside success response product controller");
    console.log(response.data);
    $scope.allProducts = response.data;
  })
  .catch(function(error) {
    console.log('error is '+error);
  });

  $scope.updateProducts = function () {
    // Filter products based on the selected category
    $scope.products = $scope.allProducts.filter(function (product) {
      console.log('Selected Category:', product.category.name);
      return product.category.id === $scope.selectedCategory;
    });
  }

  $scope.calculateFinalPrice = function(selectedCategory) {
    var price;
    ProductCateloueService.getProductById(selectedCategory, token)
    .then(function (response) {
      price = response.data.price;
      console.log("------------");
      console.log(price);
      $scope.finalPrice = price * $scope.quantity;
    })
    .catch(function(error) {
      console.log('error is '+error);
    });
    
  };

  $scope.calculateFinalPriceGames = function(selectedCategory) {
    var price;
    ProductCateloueService.getProductById(selectedCategory, token)
    .then(function (response) {
      price = response.data.price;
      console.log("------------");
      console.log(price);
      $scope.finalPrice = price * $scope.productPPM;
    })
    .catch(function(error) {
      console.log('error is '+error);
    });
    
  };

  $scope.addBill = function(){
    console.log('inside addBill Method');

    BillingService.addCustomers(token, $scope)
      .then(function (response) {
           
      })
      .catch(function(error) {
        console.log('error is '+error);
      });

  BillingService.addBills(token, $scope)
  .then(function (response) {
    $scope.message = 'Bill successfully added!';
        $scope.customerName = '';
        $scope.customerMobile = '';
        $scope.selectedCategory = '';
        $scope.selectedproduct = '';
        if (angular.isDefined($scope.productPPM)) {
          $scope.productPPM='';
        }
        if (angular.isDefined($scope.quantity)) {
          $scope.quantity='';
        }
        $scope.finalPrice = '';
        $scope.paymentMode = '';
  })
  .catch(function(error) {
    console.log('error is '+error);
  });
};

});

app.controller('BillingListController', ['$rootScope', '$scope', '$location', '$window', 'BillingService', 'TokenService', 
function ($rootScope, $scope, $location, $window, BillingService, TokenService) {
  $scope.bills = [];
  $scope.showBillList = true;
  $scope.showBillForm = false;
  var token = TokenService.getAuthToken();

  BillingService.getBillList(token)
  .then(function (response) {
    $scope.bills = response.data;
    console.log($scope.products);
  })
  .catch(function (error) {
    $scope.message = 'Some error occurred!';
    console.error('Error fetching products', error);
  });

  $scope.deleteBills = function(id) {
    BillingService.deleteBills(id, token)
    
      .then(function (response) {
        if (response.status === 200) {
          $scope.message = response.data.message;
          $location.path('/billslist');
        }
      })
      .catch(function (error) {
        $scope.message = 'Some error occurred!';
        console.error('Error deleting product', error);
      });
  };
}]);