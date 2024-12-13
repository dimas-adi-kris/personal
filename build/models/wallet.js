import Model from "./MAIN_MODEL.js";
import { bsAlert, convertToTimestamp, updateSessionStorageFromCollection } from "/assets/js/helpers.js";


class Wallet extends Model{
    constructor() {
        super();
        this.collection_name = 'wallets';
    }

    create(req) {
        super.create(req);
        updateSessionStorageFromCollection(this);
    }
}

export default Wallet