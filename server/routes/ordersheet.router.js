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
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = CURRENT_DATE
                                 AND "order_id" = ${req.params.id};`;
                let response = await client.query(queryText)
                const responseId = response.rows[0].id
                console.log('wreck params: ', req.params);
                
                console.log('responseId:', responseId);
                
                queryText = `SELECT "product"."id", "product"."product_name", 
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

router.put('/', (req, res) => {
    if (req.isAuthenticated) {
        console.log('wreck body products: ', req.body.products);
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = CURRENT_DATE
                                 AND "order_id" = $1;`;
                let value= [req.body.id]
                let response = await client.query(queryText, value)
                const responseId = response.rows[0].id
                console.log('responseId: ',responseId);
                
                // queryText = `SELECT "product"."product_name" FROM "product" 
                // JOIN "product_fulfillment" ON 
                // "product_fulfillment"."product_id" = "product"."id"
                // WHERE "product_fulfillment"."fulfillment_id" = $1
                // ORDER BY "product"."id";`
                // value=[responseId]
                // let results = await client.query(queryText,value)
                // console.log('results : ', results);
                
                let i = 0;
                while(i< req.body.products.length){
                    // console.log('wreck ', wreck);
                    console.log('i',i);
                    console.log('products: ', req.body.products[i].quantity);
                    
                    queryText = `UPDATE "product_fulfillment" 
                             SET "quantity" =$1
                             WHERE "fulfillment_id" = $2
                             AND "product_id" =$3;`
                    value=[req.body.products[i].quantity,
                           responseId,
                           req.body.products[i].id]
                i++
                    await client.query(queryText, value)
                }
                
                queryText = `UPDATE "fulfillment"
                             SET "status_id" =2
                             WHERE "id" = $1;`
                value = [responseId]
                await client.query(queryText, value)
                
                await client.query('COMMIT');
                res.sendStatus(201)
            }catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            }finally {
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