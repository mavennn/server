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
            return result.rows;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async things(categoryId) {
        const query =
            `SELECT DISTINCT ON (things.pid)
                things.pid AS pid,
                s.barcode AS barcode,
                things.name AS name,
                things.brand AS brand,
                things.id AS id,
                things.pictures[1] AS image,
                things.season AS season,
                things.sport AS sport
            FROM things INNER JOIN shk s ON things.pid = s.pid
            WHERE $1 = ANY (categories) AND s.pid = things.pid;`

        try {
            let result = await this.db.query(query, [categoryId]);
            let things = result.rows;
            return things;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

const catalogDAL = new CatalogDAL(db);

export default catalogDAL;
