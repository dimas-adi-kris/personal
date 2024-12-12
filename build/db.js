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

function initFirebase() {
	let firebase_load = '';
	let db = false;
    try {
        let app = firebase.app();
        let features = [
            "auth",
            "database",
            "firestore",
            "functions",
            "messaging",
            "storage",
            "analytics",
            "remoteConfig",
            "performance",
        ].filter((feature) => typeof app[feature] === "function");
        firebase_load = `Firebase SDK loaded with ${features.join(
            ", "
        )}`;
        db = firebase.firestore();
		return {
			firebase_load,
			db
		};

    } catch (e) {
        console.error(e);
        firebase_load =
            "Error loading the Firebase SDK, check the console.";
		return {
			firebase_load,
			db: false
		};
    }
}

export { database, initFirebase }