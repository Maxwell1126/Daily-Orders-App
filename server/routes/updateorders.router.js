const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.post('/products', (req, res) => {
    if (req.isAuthenticated) {
        let queryText = `SELECT "product"."product_name",
                        "product"."id", "person"."username"
                        FROM "product" JOIN "order_product" 
                        ON "product"."id" = "order_product"."product_id" 
                        JOIN "order" ON "order"."id" = "order_product"."order_id"
                        JOIN "person" ON "person"."id" = "order"."person_id"
                        WHERE "order_product"."order_id" =$1;`;
        let values = [req.body.id]
        pool.query(queryText, values).then((results) => {
            res.send(results.rows)
        }).catch((error) => {
            console.log('error in updateorders postProducts', error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});


router.get('/', (req, res) => {
    if (req.isAuthenticated) {
        let queryText = `SELECT "id","username" FROM "person"
                         WHERE "manager"=false;`;
        pool.query(queryText).then((results) => { res.send(results.rows); })
            .catch((error) => {
                console.log('error in updateorders get', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

router.post('/add', (req, res) => {
    if (req.isAuthenticated) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `INSERT INTO "product"("product_name")
                                VALUES($1) RETURNING "id";`;
                let values = [req.body.name];
                let results = await client.query(queryText, values);
                const resultsId = results.rows[0].id

                queryText = `INSERT INTO "order_product"("product_id","order_id")
                            VALUES($1,$2);`;
                values = [resultsId, req.body.id];
                results = await client.query(queryText, values);

                await client.query('COMMIT');
                res.send(results.rows)
            } catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.log('error in updateorders postAdd', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
})

router.delete('/:id', (req, res) => {
    if (req.isAuthenticated) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `DELETE FROM "order_product" WHERE "product_id"=$1`;
                let values = [req.params.id];
                let results = await client.query(queryText, values);

                queryText = `DELETE FROM "product" WHERE "id" =$1;`;
                values = [req.params.id];
                results = await client.query(queryText, values);
                await client.query('COMMIT');
                res.sendStatus(201)
            } catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }

        })().catch((error) => {
            console.log('Error', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});

router.put('/', (req, res) => {
    if (req.isAuthenticated) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `UPDATE "order" SET "person_id"=$1
                        WHERE "id"=$2;`;
                let values = [req.body.id, req.body.orderId];
                let results = await client.query(queryText, values);

                queryText = `UPDATE "fulfillment" SET "person_id"=$1
                             WHERE "fulfillment"."date" >= CURRENT_DATE
                             AND "fulfillment"."order_id" = $2;`;
                values = [req.body.id,req.body.orderId];
                results = await client.query(queryText,values);

                await client.query('COMMIT');
                res.sendStatus(201)
            } catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        })().catch((error) => {
                    console.log('error in updateorders put', error);
                    res.sendStatus(500);
                })
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;