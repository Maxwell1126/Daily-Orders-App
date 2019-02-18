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
        }).catch((err) => {
            console.log('error in post', err);
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
            .catch((err) => {
                console.log('error in post', err);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

router.post('/add',(req,res)=>{
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
                values = [resultsId,req.body.id];
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
            console.log('error in dashboard post', error);
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
})

module.exports = router;