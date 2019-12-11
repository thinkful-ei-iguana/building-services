const ShoppingListService = {
  getAllItems(db) {
    return db('shopping_list')
      .select('*');
  },

  getById(db, id) {
    return db('shopping_list')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteItem(db, id) {
    return db('shopping_list')
      .where({ id })
      .delete();
  },

  updateItem(db, id, newItemValues) {
    return db('shopping_list')
      .where({ id })
      .update(newItemValues);
  },

  insertItem(db, newItem) {
    return db('shopping_list')
      .insert(newItem)
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = ShoppingListService;