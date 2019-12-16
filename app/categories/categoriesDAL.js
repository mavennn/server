class CategoriesDAL {
  constructor(db) {
    this.db = db;
  }

  async insertToCategories(name, id, parentId) {
    await this.db.query('TRUNCATE TABLE categories CASCADE').then(() => console.log('Таблица очищена'));
    const query = 'INSERT INTO categories (name, id, parent_id) VALUES ($1, $2, $3)';

    try {
      await this.db.query(query, [name, id, parentId]);
      return {
        name,
        id,
        parentId
      };
    } catch (e) {
      console.log(e);
    }
  }

}

export default CategoriesDAL;
