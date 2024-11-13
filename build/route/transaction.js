function transactionRoute ($routeProvider) {
    $routeProvider
    .when("/form_transaction", {
        controller: "form_transaction",
        templateUrl: "views/form_transaction.html"
    })
}