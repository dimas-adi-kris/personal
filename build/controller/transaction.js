
function fixTransaction() {
    let { firebase_load, db } = initFirebase();
    getTransaction(db).then(function (data) {
        data.forEach(el => {
            el.user_id = localStorage.getItem("user_id");
            editTransaction(el);
        });
    });
}

function formTransaction($scope, $sce, $routeParams) {
    let { firebase_load, db } = initFirebase();
    $scope.params = $routeParams;
    $("input[name='created_timestamp']").value = new Date().toLocaleString();
    if ($scope.params.id) {
        getTransactionById($scope.params.id).then(function (data) {
            $.exposed_data = {
                data,
                $scope
            };
        $scope.description = data.description;
        $scope.money_in = data.money_in;
        $scope.money_out = data.money_out;
        $scope.created_timestamp = new Date(data.created_timestamp);
        })
    }
    $scope.firebase_load = firebase_load;
    $scope.title = "Add Transaction";
    $scope.loading = "";
    console.log({ $scope, $sce, $routeParams });
    $scope.submit = function () {
        console.log($scope);
        let loading = `<span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>`;
        $("#loading").html(loading);

        let form = {};
        form['description'] = $scope.description;
        form['money_in'] = $scope.money_in || 0;
        form['money_out'] = $scope.money_out || 0;
        let date = $scope.created_timestamp || new Date();
        form["created_timestamp"] = convertToTimestamp(date);
        form['date_time'] = date.toString();
        // let description = $scope.description;
        // let money_in = $scope.money_in || 0;
        // let money_out = $scope.money_out || 0;
        try {
            if ($scope.params.id) {
                form['id'] = $scope.params.id;
                // form["created_timestamp"] = convertToTimestamp(new Date($scope.created_timestamp));
                // form['date_time'] = new Date($scope.created_timestamp).toString();
                // let created_timestamp = convertToTimestamp(new Date($scope.created_timestamp));
                // let date_time = new Date($scope.created_timestamp).toString();
                editTransaction(form).then(function (data) {
                    loading = `<i class="bi bi-check text-success"></i>`;
                    $("#loading").html(loading);
                    console.log(data);
                });
            } else {
                addTransaction(db, form).then(function (data) {
                    loading = `<i class="bi bi-check text-success"></i>`;
                    $("#loading").html(loading);
                    console.log(data);
                });
            }
        } catch (error) {
            let alert = bsAlert("Error", error, "danger");
            $("#alert").html(alert);
            loading = `<i class="bi bi-x text-danger"></i>`;
            $("#loading").html(loading);
        }
    }
}
function dashboard($scope) {
    let { firebase_load, db } = initFirebase();
    var table = new DataTable('#example', {
        order: [[3, 'desc']]
    });
    $scope.firebase_load = firebase_load;
    console.log($scope);
    let transactions = [];
    getTransaction(db).then(function (data) {
        data.forEach(el => {
            const date =
                new Date(el.created_timestamp);
            transactions.push([
                el.description,
                el.money_in,
                el.money_out,
                date,
                `<a href="/#!/form_transaction/${el.id}" class="btn btn-primary btn-sm" ><i class="bi bi-pencil"></i></a>`,
            ]);
        });
        table.rows.add(transactions).draw();
    })
}

async function getTransaction(db) {
    let data = [];
    let tc = await db.collection('transaction').orderBy("created_timestamp").get();
    tc.forEach(doc => {
        data.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return data;
}
async function getTransactionById(id) {
    let { firebase_load, db } = initFirebase();
    let data = await db.collection('transaction').doc(id).get();
    return {
        ...data.data(),
        id: data.id
    }
}
function addTransaction(db, fields) {
    let tc = db.collection('transaction');
    // let date_now = Date.now();
    return tc.add({
        ...fields,
        // user_id: localStorage.getItem("user_id"),
        // created_timestamp: date_now,
    })
        .then((docRef) => {
            return {
                id: docRef.id,
                ...fields,
                status: "success",
            }
        })
        .catch((error) => {
            return {
                status: "error",
                message: error
            }
        });
}

function editTransaction(fields) {
    const { firebase_load, db } = initFirebase();
    return db.collection("transaction").doc(fields.id).set({
        ...fields,
    }, { merge: true })
        .then((docRef) => {
            return {
                ...fields,
                status: "success",
            }
        })
        .catch((error) => {
            return {
                status: "error",
                message: error
            }
        });
}