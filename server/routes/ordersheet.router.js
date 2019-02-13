const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/:id', (req, res) => {
    if (req.isAuthenticated) {
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" WHERE "date" = CURRENT_DATE
                                 AND "order_id" = ${req.params.id};`;
                let response = await client.query(queryText)
                const responseId = response.rows[0].id
                console.log('responseId:', responseId);
                
                queryText = `SELECT "product"."product_name", 
                "product_fulfillment"."quantity" FROM "product" 
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."product_id" = "product"."id"
                WHERE "product_fulfillment"."fulfillment_id" = ${responseId}
                ORDER BY "product"."id";`
                let results =await client.query(queryText)
            
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
router.post('/', (req, res) => {

});

module.exports = router;