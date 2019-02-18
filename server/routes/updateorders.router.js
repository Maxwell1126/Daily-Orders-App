const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.post('/', (req, res) => {
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

/**
 * POST route template
 */
// router.post('/', (req, res) => {

// });

module.exports = router;