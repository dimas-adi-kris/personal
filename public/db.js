function database(db) {    
    let users_collection = db.collection('users');
    for (let index = 0; index < users_collection.length; index++) {
        const doc = users_collection[index];
        console.log(doc.id, '=>', doc.data());
    }
    // users_collection.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    // });

    // .doc('alovelace').set({
    //     first: 'Ada',
    //     last: 'Lovelace',
    //     born: 1815
    // })
}
function submit_money(db, description, money_in, money_out) {
    
    let tc = db.collection('transaction');
    let date_now = Date.now();
    tc.add({
        description: description,
        money_in: money_in, 
        money_out: money_out,
        date_time: new Date(date_now),
        created_timestamp: date_now,
    });

}

function getWallet(db) {
    let list_wallets = localStorage.getItem('wallets');
    if (list_wallets) {
        list_wallets = JSON.parse(list_wallets);
    }
    else{
        list_wallets = [];
        let wallets_collection = db.collection('wallets');
        wallets_collection.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                list_wallets.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            localStorage.setItem('wallets', JSON.stringify(list_wallets));
        });
    }
}