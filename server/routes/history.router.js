const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        (async () => {
            console.log('wreck body: ', req.body);
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let values=[req.body.date, req.body.order]
                let response = await client.query(queryText,values)
                const responseId = response.rows[0].id
                console.log('responseId:', responseId);
                
                
                queryText = `SELECT "product"."id", "product"."product_name", 
                "product_fulfillment"."quantity" FROM "product" 
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."product_id" = "product"."id"
                WHERE "product_fulfillment"."fulfillment_id" = $1
                ORDER BY "product"."id";`
                values=[responseId]
                let results = await client.query(queryText,values)

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