import { bsAlert, convertToTimestamp } from "/assets/js/helpers.js";
import { initFirebase } from "/db.js";


class Transaction {
    constructor(data) {
        this.id = data.id || null;
        this.description = data.description;
        this.money_in = data.money_in || 0;
        this.money_out = data.money_out || 0;
        if (data.id) {
            this.created_timestamp = new Date(data.created_timestamp);
        }else{
            this.created_timestamp = convertToTimestamp(data.created_timestamp || new Date());
        }
        this.db = initFirebase().db;
    }

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
            db.collection('transaction').doc(this.id).update(data);
        } else {
            db.collection('transaction').add(data);
        }
    }
}


export default Transaction