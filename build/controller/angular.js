
import Transaction from "./transaction.js";
import Auth from "./auth.js";
import Wallet from "./wallet.js";
import Tag from "./tag.js";
var angular_app = false;
// var app = false;
// var db = false;

var angular_app = angular.module("personal", ["ngRoute","angularjs-dropdown-multiselect"]);
angular_app.controller("main", Auth.loginPage);
angular_app.controller("form_transaction", ["$scope", "$sce", '$routeParams', Transaction.formTransaction]);
angular_app.controller("dashboard", Transaction.dashboard);
angular_app.controller("walletDashboard", ["$scope", Wallet.dashboard]);
angular_app.controller("tagDashboard", ["$scope", Tag.dashboard]);
angular_app.controller("logout", Auth.logout);
angular_app.controller("head_tag", Auth.logout);

angular_app.run(function ($rootScope, $location) {
    console.log({ $rootScope, $location });
    console.log($location.path());
    // one line if else
    $rootScope.isLocal = ($location.host() == "localhost" || $location.host() == "127.0.0.1") ? true : false;

    $rootScope.logout = function () {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.clear();
        window.location.href = "/";
    }
    let user_id = sessionStorage.getItem('user_id');
    if (!user_id && ($location.path() != "/" && $location.path() != "")) {
        $rootScope.logout()
    }

    $rootScope.fixTransactions = function () {
        Transaction.fixTransaction();
    }
    //$.exposed = {
    //    $rootScope,
    //    $location
    //}
});

// angular_app.service("logout", function () {
//     this.logout = function () {
//         sessionStorage.removeItem("token");
//         window.location.href = "/";
//     }
// });

angular_app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            controller: "main",
            templateUrl: "views/main_.html"
        })
        .when("/form_transaction", {
            controller: "form_transaction",
            templateUrl: "views/transaction/form.html"
        })
        .when("/form_transaction/:id", {
            controller: "form_transaction",
            templateUrl: "views/transaction/form.html"
        })
        .when("/dashboard", {
            controller: "dashboard",
            templateUrl: "views/dashboard_.html"
        })
        .when("/wallets", {
            controller: "walletDashboard",
            templateUrl: "views/wallet/dashboard.html"
        })
        .when("/tags", {
            controller: "tagDashboard",
            templateUrl: "views/tag/dashboard.html"
        })
});