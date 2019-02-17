const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {

    if (req.isAuthenticated()) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                if (req.user.manager === false) {
                    let queryText = `SELECT * FROM "order" 
                    WHERE "person_id" =$1;`;
                    let values = [req.user.id];
                    let results = await client.query(queryText, values)
                    await client.query('COMMIT');
                    res.send(results.rows)
                } else {
                    queryText = `SELECT * FROM "order";`;
                    results = await client.query(queryText);

                    for (order of results.rows) {
                        queryText = `SELECT * FROM "fulfillment" 
                                 WHERE "date" = CURRENT_DATE
                                 AND "order_id" = $1;`;
                        values = [order.id]
                        results = await client.query(queryText, values)

                        if (results.rows.length === 0) {
                            queryText = `INSERT INTO "fulfillment"
                                         ("order_id","person_id")
                                         VALUES($1,$2)
                                         RETURNING "id";`;
                            values = [order.id, order.person_id]
                            //let values = [req.body.id, req.body.person];
                            console.log('wreck body person: ', req.body.person);
                            console.log('wreck body id: ', req.body.id);
                            results = await client.query(queryText, values);
                            console.log('results 44: ', results);
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
                    queryText = `SELECT "fulfillment".*, "order"."order_name"
                                 FROM "fulfillment"
                                 JOIN "order" ON "order"."id" =
                                 "fulfillment"."order_id"
                                 WHERE "date" = CURRENT_DATE;`
                    results = await client.query(queryText);
                    await client.query('COMMIT');
                    res.send(results.rows)
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