function walletDashboard($scope, $http, $location) {
    let {firebase_load, db} = initFirebase();
    console.log(
        {
            $scope,
            $http,
            $location
        }
    );
    $.exposed = {
        $scope,
        $http,
        $location
    }
    $scope.submit = function () {
        let name = $scope.name;
        console.log(
            {
                $scope,
                $http,
                $location,
                name,
            });
        add_wallet(db, name)
    }
    var table = new DataTable('#example');

    getWallet(db).then(function (data) {
        data.forEach(el => {
            const date =
                new Date(el.created_timestamp);
            table.rows.add([
                [
                    el.name,
                    date
                ]
            ]).draw();
        });
    })
}
function add_wallet(db, name) {
    
    let tc = db.collection('wallets');
    let date_now = Date.now();
    tc.add({
        name: name,
        user_id: localStorage.getItem("user_id"),
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

async function getWallet(db){
    let data = [];
    let tc = await db.collection('wallets').orderBy("created_timestamp").get();
    tc.forEach(doc => {
        data.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return data;

}

// function getWallet(db) {
//     let list_wallets = localStorage.getItem('wallets');
//     if (list_wallets) {
//         list_wallets = JSON.parse(list_wallets);
//     }
//     else{
//         list_wallets = [];
//         let wallets_collection = db.collection('wallets');
//         wallets_collection.get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 console.log(doc.id, '=>', doc.data());
//                 list_wallets.push({
//                     id: doc.id,
//                     ...doc.data()
//                 });
//             });
//             localStorage.setItem('wallets', JSON.stringify(list_wallets));
//         });
//     }
// }
