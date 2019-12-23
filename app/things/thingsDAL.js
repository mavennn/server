import db from "../db/index";
import helper from "../helpers";

class ThingsDAL {
  constructor(db) {
    this.db = db;
  }

  async insertRecs(type, shop_num, pid1, pid2, score) {
    shop_num = Number(shop_num);
    pid1 = Number(pid1);
    pid2 = Number(pid2);

    const query = "INSERT INTO recs (type, shop_num, pid1, pid2, score) VALUES ($1, $2, $3, $4, $5)";

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

    const query = "INSERT INTO rests_and_prices (shop_num, ware, rest, price, price_wo_disc) VALUES ($1, $2, $3, $4, $5)";

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

    const query = "INSERT INTO shk (barcode, pid, model, ware) VALUES ($1, $2, $3, $4)";

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

    const query = "INSERT INTO sorted_items (pid, rn) VALUES ($1, $2)";

    try {
      const result = await this.db.query(query, [pid, rn]);
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
      season,
      sport,
    } = thing;
    id = Number(id);
    pid = Number(pid);
    categories.forEach((el) => (el = Number(el)));

    const query = "INSERT INTO things (id, ware, name, pid, color, size, categories, pictures, brand, season, sport) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

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
        season,
        sport,
      ]);
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async getThingByBarcode(barcode) {
    const query = `SELECT *,
        array(
            SELECT things.size AS sizes FROM things WHERE things.pid = (
                    SELECT shk.pid FROM shk WHERE shk.barcode = $1
                )
        ) as availableSizes,
        array(
            SELECT distinct things.color FROM things WHERE things.name = (
                SELECT DISTINCT things.name FROM things WHERE things.ware = (
                    SELECT shk.ware FROM shk WHERE barcode = $1
                )
            )
        ) as availableColors
        FROM things WHERE ware = (
            SELECT shk.ware FROM shk WHERE barcode = $1
        );`;

    const queryRecs = `select distinct
            things.pictures[1] as  image,
            things.name as name,
            things.ware as ware
        from things
        where things.pid in (
            select recs.pid2
            from recs
            where recs.pid1 in (
                select shk.pid
                from shk
                where shk.barcode = $1
            )
        );`;
    try {
      const result = await this.db.query(query, [barcode]);
      const recs = await this.db.query(queryRecs, [barcode]);
      const thing = result.rows[0];
      if (thing) {
        thing.recs = recs.rows;
        thing.barcode = barcode;
      }
      return thing;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async getPrice(ware) {
    if (!ware || typeof ware !== "string") return null;

    const query = "SELECT DISTINCT price FROM rests_and_prices WHERE ware = $1";

    try {
      const priceResult = await this.db.query(query, [ware]);

      if (priceResult.rows[0] !== undefined) return priceResult.rows[0].price;
      return null;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async getRecs(barcode) {
    const query = `SELECT DISTINCT
            things.pictures[1] as  image,
            things.name
        FROM things
        WHERE things.pid IN (
            SELECT recs.pid2
            FROM recs
            WHERE recs.pid1 IN (
                SELECT shk.pid
                FROM shk
                WHERE shk.barcode = $1
            )
        )`;

    try {
      const result = await this.db.query(query, [barcode]);
      const recs = result.rows;
      return recs;
    } catch (e) {
      console.log(e);
    }
  }

  async getThingByWare(ware) {
    const query = `SELECT *,
        -- available sizes
        array(
            SELECT things.size as sizes FROM things WHERE things.ware = $1
        ) as availableSizes,
    
        --  available colors
        array(
            SELECT DISTINCT things.color FROM things WHERE things.name = (
                SELECT DISTINCT things.name FROM things WHERE things.ware = $1
            )
        ) as availableColors
        FROM things where ware = $1;
        `;

    const queryRecs = `select distinct
        things.pictures[1] as  image,
        things.name as name,
        things.ware as ware
            from things
            where things.pid in (
            select recs.pid2
            from recs
            where recs.pid1 in (
                select shk.pid
                from shk
                where shk.ware = $1
            )
        );`;

    try {
      const result = await this.db.query(query, [ware]);
      const recsResult = await this.db.query(queryRecs, [ware]);
      const barcode = await this.db.query(
        "select barcode from shk where shk.ware = $1",
        [ware],
      );
      const recs = recsResult.rows;
      const thing = result.rows[0];
      if (thing) {
        thing.recs = recs;
        thing.barcode = Number(barcode.rows[0].barcode);
      }
      return thing;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

const thingDAl = new ThingsDAL(db);

export default thingDAl;
