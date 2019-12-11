const knex = require('knex');

const ShoppingListService = require('../src/shopping-list-service');

describe('Shopping list service', () => {
  let db;

  let testItems = [
    {
      id: 1,
      name: 'First test item!',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main'
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch'
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast'
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy());

  context('shopping_list has data', () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    it('getAllItems retrieves all items from shopping_list', () => {
      const expectedItems = testItems.map(item => ({
        ...item,
        checked: false
      }));

      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expectedItems)
        })
    });

    it('getById() returns an article with matching id from shopping_list', () => {
      const idToGet = 3;
      const itemToGet = testItems[idToGet - 1];

      return ShoppingListService.getById(db, idToGet)
        .then(actual => {
          expect(actual).to.eql(
            {
              id: idToGet,
              name: itemToGet.name,
              date_added: itemToGet.date_added,
              price: itemToGet.price,
              category: itemToGet.category,
              checked: false
            }
          )
        });
    });

    it('deleteItem() removes it by id from shopping list', () => {
      const itemId = 3;

      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems
            .filter(item => item.id !== itemId)
            .map(item => ({
              ...item,
              checked: false
            }))
          expect(allItems).to.eql(expected)
        })
    });

    it('updateItem() updates an item in shopping_list', () => {
      const idToUpdate = 3;
      const newItem = {
        name: 'New Name',
        price: '8.99',
        date_added: new Date(),
        checked: true
      };

      const originalItem = testItems[idToUpdate - 1];

      return ShoppingListService.updateItem(db, idToUpdate, newItem)
        .then(() => ShoppingListService.getById(db, idToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idToUpdate,
            ...originalItem,
            ...newItem
          })
        })
    });
  });

  context('shopping_list has no data', () => {
    it('getAllItems() returns an empty array', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        })
    });

    it('insertItem() inserts an item into shopping_list', () => {
      const newItem = {
        name: 'Banana Bread',
        price: '4.55',
        date_added: new Date(),
        checked: true,
        category: 'Snack'
      }

      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category
          })
        })
    })
  })
});