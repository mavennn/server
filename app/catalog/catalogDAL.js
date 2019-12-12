import db from '../db/index';
import helper from '../helpers';
import thingDAl from '../things/thingsDAL';

class CatalogDAL {
    constructor(db) {
        this.db = db;
    }

    /* поиск подкатегорий по id старшей категории */
    async subcategories(id) {
        if (!id || typeof id !== 'number') return null;

        const query = 'SELECT id, name FROM categories where parent_id = $1;';

        try {
            let result = await this.db.query(query, [id]);
            console.log(result);
            return result.rows;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async things(id) {
        if (!id || typeof id !== 'number') return null;

        const query =
            'SELECT DISTINCT ON(pid) pid,\n' +
            '                ware,\n' +
            '                name,\n' +
            '                pictures\n' +
            'FROM things\n' +
            'WHERE $1 = ANY (categories) limit 40';

        try {
            let result = await this.db.query(query, [id]);
            return result.rows;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

const catalogDAL = new CatalogDAL(db);

export default catalogDAL;
