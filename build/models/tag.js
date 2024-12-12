import Model from "./MAIN_MODEL.js";
import { bsAlert, convertToTimestamp } from "/assets/js/helpers.js";


class Tag extends Model{
    constructor() {
        super();
        this.collection_name = 'tags';
    }
}

export default Tag