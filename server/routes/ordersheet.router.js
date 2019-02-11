const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/:id', (req, res) => {
    if (req.isAuthenticated) {
        pool.query(`SELECT "product_name" FROM "product" JOIN "order_product"
                    ON "product"."id" = "order_product"."product_id" 
                    WHERE "order_id" =${req.params.id};`).then((results) => {
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