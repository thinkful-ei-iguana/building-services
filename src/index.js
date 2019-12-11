require('dotenv').config();
const knex = require('knex');

const ShoppingListService = require('./shopping-list-service');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

console.log(ShoppingListService.getAllItems());