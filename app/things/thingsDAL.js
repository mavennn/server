import db from '../db/index';
import helper from '../helpers';

class ThingsDAL {
    constructor(db) {
        this.db = db;
    }

    async insertRecs(type, shop_num, pid1, pid2, score) {
        shop_num = Number(shop_num);
        pid1 = Number(pid1);
        pid2 = Number(pid2);

        const query =
            'INSERT INTO recs (type, shop_num, pid1, pid2, score) VALUES ($1, $2, $3, $4, $5)';

        try {
            const result = await this.db.query(query, [
                type,
                shop_num,
                pid1,
                pid2,
                score,
            ]);
            console.log(result);
            return result;
        } catch (e) {
            null;
        }
    }

    async insertRestsAndPrices(shop_num, ware, rest, price, price_wo_disc) {
        shop_num = Number(shop_num);
        rest = Number(rest);
        price_wo_disc = Number(price_wo_disc);

        const query =
            'INSERT INTO rests_and_prices (shop_num, ware, rest, price, price_wo_disc) VALUES ($1, $2, $3, $4, $5)';

        try {
            const result = await this.db.query(query, [
                shop_num,
                ware,
                rest,
                price,
                price_wo_disc,
            ]);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async insertShk(barcode, pid, model, ware) {
        barcode = Number(barcode);
        pid = Number(pid);

        const query =
            'INSERT INTO shk (barcode, pid, model, ware) VALUES ($1, $2, $3, $4)';

        try {
            const result = await this.db.query(query, [
                barcode,
                pid,
                model,
                ware,
            ]);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async insertSortedItems(pid, rn) {
        pid = Number(pid);
        rn = Number(rn);

        const query = 'INSERT INTO sorted_items (pid, rn) VALUES ($1, $2)';

        try {
            const result = await this.db.query(query, [pid, rn]);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async insertToSizes(name) {
        const query = 'INSERT INTO sizes (name) VALUES ($1)';
        try {
            const result = await this.db.query(query, [name]);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async insertThing(thing) {
        let {
            id,
            ware,
            name,
            pid,
            color,
            size,
            categories,
            images,
            brand,
        } = thing;
        id = Number(id);
        pid = Number(pid);
        categories.forEach((el) => (el = Number(el)));

        const query =
            'INSERT INTO things (id, ware, name, pid, color, size, categories, pictures, brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

        try {
            const result = await this.db.query(query, [
                id,
                ware,
                name,
                pid,
                color,
                size,
                categories,
                images,
                brand,
            ]);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getThingByBarcode(barcode) {
        try {
            // находим pid по barcode
            const pidResult = await this.db.query(
                'SELECT pid FROM shk WHERE barcode = $1',
                [barcode]
            );

            let pid = Number(pidResult.rows[0].pid);

            // сама шмотка
            const thing = await this.getThingByPid(pid);
            thing.recs = await this.getRecsByPid(pid);
            return thing;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getSizes(pid) {
        if (!pid || typeof pid !== 'number') return null;

        try {
            let result = await this.db.query(
                'select size from things where pid = $1',
                [pid]
            );
            let sizes = [];
            result.rows.map((size) => {
                sizes.push(size.size);
            });
            return sizes;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getColors(pid) {
        if (!pid || typeof pid !== 'number') return null;

        try {
            let thing = await this.getThingByPid(pid);

            let colorsResult = await this.db.query(
                'select distinct color from things where name = $1',
                [thing.name]
            );
            let colors = [];
            colorsResult.rows.map((color) => {
                colors.push(color.color);
            });
            return colors;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getPrice(ware) {
        if (!ware || typeof ware != 'string') return null;

        const query =
            'SELECT DISTINCT price FROM rests_and_prices WHERE ware = $1';

        try {
            let priceResult = await this.db.query(query, [ware]);

            if (priceResult.rows[0] !== undefined)
                return priceResult.rows[0].price;
            return null;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getThingByPid(pid) {
        if (!pid || typeof pid !== 'number') return null;

        try {
            // шмотка по pid
            const thingResult = await this.db.query(
                'SELECT * FROM things WHERE pid = $1 limit 1',
                [pid]
            );
            let thing = thingResult.rows[0];

            if (thing !== undefined) {
                const colorsResult = await this.db.query(
                    'select distinct color from things where name = $1',
                    [thing.name]
                );

                thing.availableColors = [];
                colorsResult.rows.map((color) => {
                    thing.availableColors.push(color.color);
                });
            }
            try {
                thing.availableSizes = await this.getSizes(pid);
            } catch (e) {
                thing.availableSizes = [];
            }

            try {
                thing.price = await this.getPrice(thing.ware);
            } catch (e) {
                thing.price = 0;
            }

            try {
                let barcode = await this.db.query(
                    'select barcode from shk where pid = $1',
                    [pid]
                );
                thing.barcode = Number(barcode.rows[0].barcode);
            } catch (e) {
                console.log(e);
            }
            return thing;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getRecsByPid(pid) {
        try {
            // массив рекомендаций pid2 и score
            const recsResult = await this.db.query(
                'SELECT pid2, score FROM recs WHERE pid1 = $1',
                [pid]
            );
            let recs = recsResult.rows;

            // дополняем информацию о рекомандациях
            const MAX_RECS_COUNT = 10;
            let result = [];
            for (let i = 0; i <= MAX_RECS_COUNT; i++) {
                try {
                    const info = await this.getThingByPid(recs[i].pid2);
                    let obj = {
                        barcode: info.barcode,
                        pid: info.pid,
                        name: info.name,
                        image: info.pictures[0],
                        score: recs[i].score,
                        price: info.price,
                    };
                    result.push(obj);
                } catch (e) {
                    console.log(e);
                    return e;
                }
            }
            // сортируем
            helper.sortByScore(result);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

const thingDAl = new ThingsDAL(db);

export default thingDAl;
