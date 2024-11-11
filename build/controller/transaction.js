function formTransaction($scope) {
    let {firebase_load, db} = initFirebase();
    $scope.firebase_load = firebase_load;

    $scope.submit = function () {
        let description = $scope.description;
        let money_in = $scope.money_in || 0;
        let money_out = $scope.money_out || 0;
        submit_money(db, description, money_in, money_out);
    }
}
function dashboard($scope) {
    let {firebase_load, db} = initFirebase();
    var table = new DataTable('#example', {
        order: [[3, 'desc']]
    });
    $scope.firebase_load = firebase_load;
    console.log($scope);
    getTransaction(db).then(function (data) {
        data.forEach(el => {
            const date =
                new Date(el.created_timestamp);
            table.rows.add([
                [
                    el.description,
                    el.money_in,
                    el.money_out,
                    date
                ]
            ]).draw();
        });
    })
}