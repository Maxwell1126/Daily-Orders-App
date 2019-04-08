const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.manager === true) {
            let queryText = `SELECT * FROM "order";`;
            pool.query(queryText).then((result) => {
                console.log('in result', result);
                res.send(result.rows);
            }).catch((error) => {
                console.log('in error', error);
            })
        } else {
            let queryText = `SELECT * FROM "order" WHERE "person_id" = $1;`;
            let value = [req.user.id];
            pool.query(queryText, value).then((result) => {
                console.log('in result', result);
                res.send(result.rows);
            }).catch((error) => {
                console.log('in error', error);
            })
        }
    } else {
        res.sendStatus(403);
    }
})

router.post('/', (req, res) => {
    console.log('in dashboardget post');
    if (req.isAuthenticated()) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                if (req.user.manager === false) {
                    let ordersQueryText = `SELECT * FROM "order" WHERE "person_id" = $1`;
                    let ordersValues = [req.body.id]
                    let ordersResults = await client.query(ordersQueryText, ordersValues)
                    // console.log(results)
                    for (order of ordersResults.rows) {
                        let orderQueryText = `SELECT * FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                        //  console.log('order', order.id);

                        let orderValues = [req.body.date, order.id]
                        let orderResults = await client.query(orderQueryText, orderValues)
                        let resultRows = orderResults.rows.length
                        // console.log('results', results);

                        if (resultRows === 0) {
                            // console.log('here', resultRows);

                            let fulfillmentQueryText = `INSERT INTO "fulfillment"
                                         ("order_id","person_id","date")
                                         VALUES($1,$2,$3)
                                         RETURNING "id";`;
                            let fulfillmentValues = [order.id, req.body.id, req.body.date]
                            // console.log('person', req.body.id);

                            let fulfillmentResults = await client.query(fulfillmentQueryText, fulfillmentValues);
                            const resultsId = fulfillmentResults.rows[0].id;

                            let productsQueryText = `SELECT "product"."product_name",
                            "order_product"."product_id"
                            FROM "product" JOIN "order_product" 
                            ON "product"."id" = "order_product"."product_id" 
                            WHERE "order_product"."order_id" = $1;`;
                            let productsValues = [order.id]
                            let productsResults = await client.query(productsQueryText, productsValues)

                            // if (resultRows === 0) {
                            for (product of productsResults.rows) {
                                let productQueryText = `INSERT INTO "product_fulfillment"
                                            ("fulfillment_id","product_id")
                                            VALUES ($1,$2);`;
                                let productValues = [resultsId, product.product_id];
                                let productResults = await client.query(productQueryText, productValues);
                            }
                            // }
                        }
                    }

                    queryText = `SELECT "fulfillment".*, "order"."order_name",
                        "person"."username"
                    FROM "fulfillment"
                    JOIN "order" ON "order"."id" =
                        "fulfillment"."order_id"
                    JOIN "person" ON "person"."id" =
                        "fulfillment"."person_id"
                    WHERE "date" = $1
                    AND "fulfillment"."person_id" = $2
                    ORDER BY "order"."id";`;
                    values = [req.body.date, req.body.id];
                    results = await client.query(queryText, values)

                    await client.query('COMMIT');
                    res.send(results.rows)
                } else {
                    queryText = `SELECT * FROM "order";`;
                    results = await client.query(queryText);

                    for (order of results.rows) {
                        queryText = `SELECT * FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                        values = [req.body.date, order.id]
                        results = await client.query(queryText, values)

                        if (results.rows.length === 0) {
                            queryText = `INSERT INTO "fulfillment"
                                         ("order_id","person_id","date")
                                         VALUES($1,$2,$3)
                                         RETURNING "id";`;
                            values = [order.id, order.person_id, req.body.date]
                            results = await client.query(queryText, values);
                            const resultsId = results.rows[0].id;

                            queryText = `SELECT "product"."product_name",
                            "order_product"."product_id"
                            FROM "product" JOIN "order_product" 
                            ON "product"."id" = "order_product"."product_id" 
                            WHERE "order_product"."order_id" =$1;`;
                            values = [order.id]
                            results = await client.query(queryText, values)

                            for (product of results.rows) {
                                queryText = `INSERT INTO "product_fulfillment"
                                            ("fulfillment_id","product_id")
                                            VALUES ($1,$2);`;
                                values = [resultsId, product.product_id];
                                await client.query(queryText, values);
                            }
                        }
                    }
                    queryText = `SELECT "fulfillment".*, "order"."order_name",
                                 "person"."username"
                                 FROM "fulfillment"
                                 JOIN "order" ON "order"."id" =
                                 "fulfillment"."order_id"
                                 JOIN "person" ON "person"."id" =
                                 "fulfillment"."person_id"
                                 WHERE "date" = $1
                                 ORDER BY "fulfillment"."person_id";`;
                    values = [req.body.date]
                    let final = await client.query(queryText, values);
                    await client.query('COMMIT');
                    res.send(final.rows)
                }
            }
            catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.log('error in dashboard get', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;