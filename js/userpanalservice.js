app.service('AuthService', function($q, $location, $http) {
  // var email;
  // var password;
    this.login = function(email, password) {
      
      return $http({
        method:'POST',
        url:'http://localhost:8080/user/login',
        headers: {
            "Accept":"*/*",
            "Content-Type":"application/json"
          },
        data: {
            "email": email,
            "password": password
        }})
        
      }

});

app.service('TokenService', function() {
  var authTokenKey = 'authToken';

  return {
    setAuthToken: function(token) {
      localStorage.setItem(authTokenKey, token);
    },
    getAuthToken: function() {
      return localStorage.getItem(authTokenKey);
    },
    clearAuthToken: function() {
      localStorage.removeItem(authTokenKey);
    }
  }
});

app.service('CategoryCateloueService', ['$http', function($http) {
  console.log('inside CategoryCateloueService');
  var apiUrl = 'http://localhost:8080/category/';
  //var token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJnZ2dAZ2dnLmNvbSIsImlhdCI6MTcwMjcxMDU5NSwiZXhwIjoxNzAyNzQ2NTk1fQ.IUwoVwijI8vm21cutisRjiL0UgJdIQ-66w7ThcWmAeQ';

  this.getCategories = function(token) {
    return $http.get(apiUrl + 'get', { headers: { "authorization": token } });
  };

  this.deleteCategory = function(id, token) {
    return $http.post(apiUrl + 'delete/' + id, null, { headers: { "authorization": token } });
  };

  this.updateCategory = function(category, token) {
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
  console.log('inside ProductService');
  var apiUrl = 'http://localhost:8080/product/';

  this.getProducts = function(token) {
    return $http.get(apiUrl + 'get', { headers: { "authorization": token} });
  };

  this.deleteProduct = function(id, token) {
    return $http.post(apiUrl + 'delete/' + id, null, { headers: { "authorization": token } });
  };

  this.updateProduct = function(product, token) {
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

  this.getProductById = function(id, token) {
    console.log('inside ProductService'+token+'--------'+id);
    
      return $http.get(apiUrl + 'getbyid/'+id, { headers: { "authorization": token} });
    
  };
}]);

app.service('BillingService', ['$http', function($http) {
  console.log('inside BillingService');
  var apiUrl = 'http://localhost:8080/bill/';
  var ppm = 0;

  this.addCustomers = function(token, $scope) {
    return $http({
              method:'POST',
              url:'http://localhost:8080/customers/add',
              headers: {
                  "authorization": token,
                  "Accept":"*/*",
                  "Content-Type":"application/json"
                },
                data: {
                  "customerName": $scope.customerName,
                  "customerMobileNo": $scope.customerMobile
                }
    });
  };

  this.addBills = function(token, $scope) {
  
    var reqData = {
      "customerName": $scope.customerName,
      "categoryId": $scope.selectedCategory,
      "productId": $scope.selectedproduct,
      "finalPrice": $scope.finalPrice,
      "paymentMode": $scope.paymentMode,
      "customerMobileNo": $scope.customerMobile
  }
  if (angular.isDefined($scope.productPPM)) {
    reqData.timePlayedInMins = $scope.productPPM;
  }
  if (angular.isDefined($scope.quantity)) {
    reqData.quantity = $scope.quantity;
  }
    return $http({
              method:'POST',
              url:apiUrl+'add',
              headers: {
                  "authorization": token,
                  "Accept":"*/*",
                  "Content-Type":"application/json"
                },
                data: reqData
    });
  };
  
  this.getBillList = function(token){
    return $http.get(apiUrl + 'get', { headers: { "authorization": token} });
  }

  this.deleteBills = function(id, token) {
    return $http.post(apiUrl + 'delete/' + id, null, { headers: { "authorization": token } });
  };
}]);