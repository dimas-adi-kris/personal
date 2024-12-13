import Model from "./MAIN_MODEL.js";
import { bsAlert, convertToTimestamp } from "/assets/js/helpers.js";


class Wallet extends Model{
    constructor() {
        super();
        this.collection_name = 'wallets';
    }
}

export default Wallet