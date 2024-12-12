import { initFirebase } from "/db.js";
import { bsAlert, convertToTimestamp } from "/assets/js/helpers.js";

class Model {

    constructor() {
        this.db = initFirebase().db;
    }

    checkCollectionName() {
        if (!this.collection_name) {
            throw new Error("Collection name is required");
        }
    }

    /**
     * Creates a new document in the collection with the given request data.
     * 
     * @param {Object} req 
     * The request object containing all the data to be saved.
     * 
     * @returns {Promise<FirebaseFirestore.DocumentReference>}
     * A Promise that resolves to a DocumentReference of the newly created document.
     */
    create(req) {
        this.checkCollectionName();
        let date = req.created_timestamp || new Date();
        let data = {
            ...req,
            created_timestamp: convertToTimestamp(date),
            date_time: date.toString(),
        }
        this.db.collection(this.collection_name).add(data);
    }

    update(req) {
        this.checkCollectionName();
        let date = req.created_timestamp || new Date();
        let data = {
            ...req,
            created_timestamp: convertToTimestamp(date),
            date_time: date.toString(),
        }
        this.db.collection(this.collection_name).doc(this.id).set(data);
    }

    async getAll() {
        this.checkCollectionName();
        let result = [];
        let tc = await this.db.collection(this.collection_name).get();
        tc.forEach(doc => {
            result.push({
                ...doc.data(),
                id: doc.id,
            });
        });
        return result;
    }
    async findById(id) {
        this.checkCollectionName();
        let data = await this.db.collection(this.collection_name).doc(id).get();
        this.id = data.id;
        let fields = this.fields();
        fields.forEach(field => {
            this[field] = data.data()[field] || null;
        })
        // this.data = data.data();
        this.created_timestamp = new Date(this.created_timestamp);
        return this;
    }

}

export default Model