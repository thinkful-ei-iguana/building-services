require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// function getProductByName(searchTerm) {
//   db('shopping_list')
//     .select('*')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log(result);
//     });
// }

// getProductByName('key');

// function paginateProducts(pageNumber) {
//   const productsPerPage = 6;
//   const offset = productsPerPage * (pageNumber - 1);

//   db('shopping_list')
//     .select('*')
//     .limit(productsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log(result);
//     });
// }

// paginateProducts(2);

// function getItemsAddedAfter(daysAgo) {
//   db('shopping_list')
//     .select('*')
//     .where(
//       'date_added',
//       '>',
//       db.raw(`now() - '?? days'::INTERVAL`, daysAgo)
//     )
//     .then(result => {
//       console.log(result);
//     });
// }

// getItemsAddedAfter(5);

function getCategoryCostTotal() {
  db('shopping_list')
    .select('category',
      db.raw('SUM(price) AS total')
    )
    .groupBy('category')
    .then(result => {
      console.log(result);
    });
}

getCategoryCostTotal();