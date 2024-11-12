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
