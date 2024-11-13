function formTransaction($scope, $sce, $routeParams) {
    let {firebase_load, db} = initFirebase();
    $scope.params = $routeParams;
    if ($scope.params.id) {
        getTransactionById($scope.params.id).then(function (data) {
            $.exposed_data = data;
            $scope.description = data.description;
            $scope.money_in = data.money_in;
            $scope.money_out = data.money_out;
            $scope.created_timestamp = new Date(data.created_timestamp).toLocaleString();
        })
    }
    $scope.firebase_load = firebase_load;
    $scope.title = "Add Transaction";
    $scope.loading = "";
    console.log({$scope, $sce, $routeParams});
    $scope.submit = function () {
        console.log($scope);
        let loading = `<span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>`;
        $("#loading").html(loading);    
        
        let description = $scope.description;
        let money_in = $scope.money_in || 0;
        let money_out = $scope.money_out || 0;
        try {
            if ($scope.params.id) {
                let id = $scope.params.id;
                let created_timestamp = new Date($scope.created_timestamp);
                editTransaction({id, description, money_in, money_out, created_timestamp}).then(function (data) {
                    loading = `<i class="bi bi-check text-success"></i>`;
                    $("#loading").html(loading);    
                    console.log(data);
                });
            }else{
                addTransaction(db, {description, money_in, money_out}).then(function (data) {
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
function dashboard ($scope) {
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
                    date,
                    `<a href="/#!/form_transaction/${el.id}" class="btn btn-primary btn-sm" ><i class="bi bi-pencil"></i></a>`,
                ]
            ]).draw();
        });
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
    let {firebase_load, db} = initFirebase();
    let data = await db.collection('transaction').doc(id).get();
    return {
        ...data.data(),
        id: data.id
    }
}
function addTransaction(db, fields) {
    let tc = db.collection('transaction');
    let date_now = Date.now();
       return tc.add({
            ...fields,
            user_id: localStorage.getItem("user_id"),
            date_time: new Date(date_now),
            created_timestamp: date_now,
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

function editTransaction(fields){
    const {firebase_load, db} = initFirebase();
    return db.collection("transaction").doc(fields.id).set({
        ...fields,
    }, { merge: true })
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