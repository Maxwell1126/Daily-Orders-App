const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/:id', (req, res) => {
    if (req.isAuthenticated) {
        pool.query(`SELECT "product"."product_name", 
                "product_fulfillment"."quantity" FROM "product" 
                JOIN "order_product" ON "product"."id" = "order_product"."product_id" 
                JOIN "fulfillment" ON "fulfillment"."order_id" 
                = "order_product"."order_id"
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."fulfillment_id" = "fulfillment"."id"
                WHERE "order_product"."order_id" =${req.params.id}
                GROUP BY "product"."product_name", "product_fulfillment"."quantity", 
                "product"."id"
                ORDER BY "product"."id";`)
            .then((results) => {
            res.send(results.rows);
        }).catch((error) => {
            console.log('error in dashboard get', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }

});

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;