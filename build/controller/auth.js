import { initFirebase } from "/db.js";
import Wallet from "./wallet.js";

/**
 * cyrb53: A non-cryptographic string hash function designed to be fast while maintaining a good distribution for non-pathological keys.
 * @param {string} str - The string to hash.
 * @param {number} [seed=0] - The seed value to use.
 * @returns {number} The hash value.
 */
const cyrb53 = (str, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
function login(db, $location) {
	var provider = new firebase.auth.GoogleAuthProvider();
	let is_logged_in = sessionStorage.getItem("token");
	if (is_logged_in) {
		// $location.path('#!form_transaction');
		window.location.href = "#!form_transaction";
	} else {
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				/** @type {firebase.auth.OAuthCredential} */
				var credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = credential.accessToken;
				sessionStorage.setItem("token", token);
				// The signed-in user info.
				var user = result.user;
				sessionStorage.setItem("user", JSON.stringify(user));
				console.log({
					token,
					user,
				});
				let users = db.collection("users");
				initWallet();
				initTag();
				// add if not exist
				users.doc(user.uid).get().then((doc) => {
					if (!doc.exists) {
						let token = '';
						users.doc(user.uid).set({
							id: user.uid,
							name: user.displayName,
							email: user.email,
							token: token,
						}).then(() => {
							sessionStorage.setItem("token", token);
							sessionStorage.setItem("user_id", user.uid);
							window.location.href = "/unauthorized.html";
						});
					} else {
						sessionStorage.setItem("token", doc.data().token);
						sessionStorage.setItem("user_id", user.uid);
						// $location.path('/form_transaction');
						window.location.href = "#!form_transaction";
					}
				});
				// ...
			})
			.catch((error) => {

				console.error(error);
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				console.log({
					errorCode,
					errorMessage,
					email,
					credential,
				});
				// ...
			});
	}
}
function authentication(db) {
	let token = sessionStorage.getItem('token');
	let hash_token = cyrb53(token);
	if (hash_token != 262920812735202) {
		window.location.href = "/unauthorized.html";
	}

	let user_id = sessionStorage.getItem('user_id');
	if (!user_id) {
		window.location.href = "/logout";
	}
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
function loginPage($scope, $http, $location) {
	$scope.firebase_load = 'Firebase SDK Loading...';
	let { firebase_load, db } = initFirebase();
	$scope.firebase_load = firebase_load;
	$scope.signIn = function () {
		login(db, $location);
	}
}

function logout($scope) {
	sessionStorage.removeItem("token");
	sessionStorage.removeItem("user_id");
	window.location.href = "/";
}

function initWallet() {
	let { db } = initFirebase();
	getWallet(db).then(function (data) {
		sessionStorage.setItem("wallets", JSON.stringify(data));
	});
}

function initTag() {
	let { db } = initFirebase();
	getTag(db).then(function (data) {
		sessionStorage.setItem("tags", JSON.stringify(data));
	});
}

function head_tag($scope) {
	let { db } = initFirebase();
	console.log($scope);
}

export default {
	cyrb53,
	login,
	authentication,
	download,
	loginPage,
	logout,
	initWallet,
	initTag,
	head_tag
}