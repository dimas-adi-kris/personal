import { bsAlert, convertToTimestamp } from "../assets/js/helpers.js";
import Transaction from "../models/transaction.js";
import { initFirebase } from '/db.js'

function getTransactionFields() {
    return [
        {
            name: "description",
            type: "text",
            label: "Description"
        },
        {
            name: "money_in",
            type: "number",
            label: "Money In"
        },
        {
            name: "money_out",
            type: "number",
            label: "Money out"
        },
        {
            name: "wallet_id",
            type: "select",
            label: "Wallet",
            options: JSON.parse(sessionStorage.getItem("wallets"))
        }
    ]
}
function fixTransaction() {
    let { firebase_load, db } = initFirebase();
    getTransaction(db).then(function (data) {
        data.forEach(el => {
            el.user_id = sessionStorage.getItem("user_id");
            editTransaction(el);
        });
    });
}

function formTransaction($scope, $sce, $routeParams) {
    let { firebase_load, db } = initFirebase();
    $scope.params = $routeParams;
    $("input[name='created_timestamp']").value = new Date().toLocaleString();
    $scope.firebase_load = firebase_load;
    $scope.title = "Add Transaction";
    $scope.loading = "";
    $scope.wallets = {
        availableOptions: JSON.parse(sessionStorage.getItem("wallets")),
        // selectedOption: {id: '3', name: 'Option C'} //This sets the default value of the select in the ui
    };
    // $scope.tags = {
    //     availableOptions: JSON.parse(sessionStorage.getItem("tags")),
    //     selectedOption: { id: '3', name: 'Option C' } //This sets the default value of the select in the ui
    // }
    // $scope.example13model = []; 
    // $scope.example13data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Lisa"}, {id: 4, label: "Nicole"}, {id: 5, label: "Danny"} ]; 
    // $scope.example13settings = { smartButtonMaxItems: 3, smartButtonTextConverter: function(itemText, originalItem) { if (itemText === 'Jhon') { return 'Jhonny!'; } return itemText; } };
    $scope.tags = [];
    $scope.tagsData = JSON.parse(sessionStorage.getItem("tags"));
    $scope.tagSettings = { smartButtonMaxItems: 1000, smartButtonTextConverter: function(itemText, originalItem) { return itemText; } };

    $scope.computeDescription = function () {

    }
    $scope.example1model = [];
    $scope.example1data = [{ id: 1, label: "David" }, { id: 2, label: "Jhon" }, { id: 3, label: "Danny" }];
    if ($scope.params.id) {
        let transaction = new Transaction();
        transaction.findById($scope.params.id).then(function (data) {
            $.exposed_data = {
                data,
                $scope
            };
            // transaction
            $scope.description = data.description;
            $scope.money_in = data.money_in;
            $scope.money_out = data.money_out;
            $scope.created_timestamp = new Date(data.created_timestamp);
            $scope.wallets.selected = data.wallet_id;
            $scope.tags.selected = data.tag_id;
        })
    }
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
        form['wallet_id'] = $scope.wallets.selected;
        form['tag_id'] = $scope.tags.selected;

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
            console.error(error);
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
/**
 * Add a new transaction to the database.
 * @param {Object} db - The firestore database to write to.
 * @param {Object} fields - The fields to add to the transaction.
 * @returns {Promise<Object>}
 *   A promise that resolves to an object with the id of the newly created
 *   transaction and the passed in fields. If the write fails, the promise will
 *   reject with an error object.
 */
function addTransaction(db, fields) {
    let tc = db.collection('transaction');
    // let date_now = Date.now();
    return tc.add({
        ...fields,
        // user_id: sessionStorage.getItem("user_id"),
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
            console.error(error);
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
            console.error(error);
            return {
                status: "error",
                message: error
            }
        });
}

export default {
    getTransactionFields,
    fixTransaction,
    formTransaction,
    dashboard,
    getTransaction,
    getTransactionById,
    addTransaction,
    editTransaction
}