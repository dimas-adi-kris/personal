function formTransaction($scope) {
    let {firebase_load, db} = initFirebase();
    $scope.firebase_load = firebase_load;

    $scope.submit = function () {
        let description = $scope.description;
        let money_in = $scope.money_in || 0;
        let money_out = $scope.money_out || 0;
        addTransaction(db, description, money_in, money_out);
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
function addTransaction(db, description, money_in, money_out) {
    
    let tc = db.collection('transaction');
    let date_now = Date.now();
    tc.add({
        description: description,
        money_in: money_in, 
        money_out: money_out,
        date_time: new Date(date_now),
        created_timestamp: date_now,
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        alert("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        alert("Error adding document: ", error);
    });
}