import { bsAlert, convertToTimestamp } from "/assets/js/helpers.js";
import { initFirebase } from "/db.js";
import Model from "./MAIN_MODEL.js";


class Transaction extends Model {
    constructor() {
        super();
        this.collection_name = 'transaction';
    }

    fields() {
        return [
            "description",
            "money_in",
            "money_out",
            "created_timestamp",
            "wallet_id",
            "tag_id"
        ]
    }

    // create(req) {
    //     let data = {
    //         ...req,
    //         created_timestamp: convertToTimestamp(req.created_timestamp) || new Date()
    //     }
    //     this.db.collection(this.collection_name).add(data);
    // }

    // async getAll() {
    //     let result = [];
    //     let tc = await this.db.collection(this.collection_name).get();
    //     tc.forEach(doc => {
    //         result.push({
    //             ...doc.data(),
    //             id: doc.id,
    //         });
    //     });
    //     return result;
    // }

    toObject() {
        return {
            id: this.id,
            description: this.description,
            money_in: this.money_in,
            money_out: this.money_out,
            created_timestamp: this.created_timestamp,
        }
    }

    save() {
        let data = this.toObject();
        if (this.id) {
            this.db.collection('transaction').doc(this.id).set({
                ...data,
                created_timestamp: convertToTimestamp(data.created_timestamp)
            });
        } else {
            this.db.collection('transaction').add({
                ...data,
                created_timestamp: convertToTimestamp(data.created_timestamp) || new Date()
            });
        }
    }
}


export default Transaction