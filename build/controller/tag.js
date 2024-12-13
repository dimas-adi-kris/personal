
import { initFirebase } from '/db.js'
import Tag from '../models/tag.js';


function dashboard($scope, $http, $location) {
    let { firebase_load, db } = initFirebase();
    console.log(
        { $scope, $http, $location }
    );
    $.exposed = { $scope, $http, $location }
    let tag = new Tag();
    $scope.submit = function () {
        let label = $scope.label;
        let keywords = $scope.keywords;
        console.log({ $scope, $http, $location, label, });
        tag.create({ label, keywords });
        // add_tag(db, name)
    }
    var table = new DataTable('#example');

    tag.getAll().then(function (data) {
        data.forEach(el => {
            const date =
                new Date(el.created_timestamp);
            table.rows.add([
                [el.label,
                    date,]
            ]).draw();
        });
    })
}

// function add_tag(db, name) {
//     db.collection("tags").add({
//         name: name
//     });
// }

export default {
    dashboard,
}