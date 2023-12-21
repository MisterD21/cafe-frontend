

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginController',
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
$routeProvider.when('/billing', {
    templateUrl: '/serviceTemplates/billing.html',
    controller: 'BillingController',
  });
  $routeProvider.when('/customerlist', {
    templateUrl: '/serviceTemplates/customerlist.html',
    controller: 'CustomerListController',
  });
  $routeProvider.when('/billslist', {
    templateUrl: '/serviceTemplates/billslist.html',
    controller: 'BillingListController',
  });

  $routeProvider.otherwise({
      redirectTo: '/login.html'
  });

}]);





// app
//   .config(['$locationProvider', function($locationProvider) {
//     $locationProvider.html5Mode(true);
//   }]);

//   app.run(['$rootScope', function($rootScope) {
//     $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
//       console.error('$routeChangeError', rejection);
//     });
//     }]);