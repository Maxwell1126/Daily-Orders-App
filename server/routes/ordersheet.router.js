const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        
        console.log('in order sheet post');
        
        (async () => {
         
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let values =[req.body.date, req.body.id]
                let response = await client.query(queryText, values)
                
                if (response.rows.length === 0) {
                    queryText = `INSERT INTO "fulfillment"("order_id","person_id","date")
                    VALUES($1,$2,$3) RETURNING "id";`;
                    values = [req.body.id,req.body.person,req.body.date];
                    let results = await client.query(queryText,values);

                    const resultsId = results.rows[0].id;

                    queryText = `SELECT "product"."product_name", "order_product"."product_id"
                             FROM "product" JOIN "order_product" 
                             ON "product"."id" = "order_product"."product_id" 
                             WHERE "order_product"."order_id" =${req.body.id};`
                    let responses = await client.query(queryText);



                    for (product of responses.rows) {
                        queryText = `INSERT INTO "product_fulfillment"
                             ("fulfillment_id","product_id")
                             VALUES (${resultsId},${product.product_id});`;
                        //values = [resultsId, product.product_id]
                        await client.query(queryText);
                    }
                

                queryText = `SELECT "product"."id", "product"."product_name", 
                "product_fulfillment"."quantity" FROM "product" 
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."product_id" = "product"."id"
                WHERE "product_fulfillment"."fulfillment_id" = $1
                GROUP BY "product"."id","product_fulfillment"."quantity"
                ORDER BY "product"."id";`;
                values = [resultsId];
                results =await client.query(queryText,values);
            
                await client.query('COMMIT');
                res.send(results.rows);
                }else{
                    const responseId = response.rows[0].id;
                    // console.log('responseId 69', responseId);
                    
                    queryText = `SELECT "product"."id", "product"."product_name", 
                "product_fulfillment"."quantity", "fulfillment"."status_id" FROM "product" 
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."product_id" = "product"."id"
                JOIN "fulfillment" ON "fulfillment"."id" = "product_fulfillment"."fulfillment_id"
                WHERE "product_fulfillment"."fulfillment_id" = $1
                ORDER BY "product"."id";`;
                    values = [responseId];
                    let final = await client.query(queryText, values);
                    // console.log('results 80', final.rows);
                    
                    await client.query('COMMIT');
                    res.send(final.rows)
                }
            }catch (e) {
                console.log('ROLLBACK', e);
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        })().catch((error) => {
        console.log('error in ordersheet post', error);
        res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }

});

router.put('/', (req, res) => {
    if (req.isAuthenticated) {
        //console.log('wreck body button: ', req.body.button);
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let value= [req.body.date,req.body.id]
                let response = await client.query(queryText, value)
                const responseId = response.rows[0].id
               // console.log('responseId: ',responseId);
                
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
                   // console.log('i',i);
                   // console.log('products: ', req.body.products[i].quantity);
                    
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
                if (req.body.button ==='submit'){
                queryText = `UPDATE "fulfillment"
                             SET "status_id" =2
                             WHERE "id" = $1;`
                value = [responseId]
                await client.query(queryText, value)
                } else if (req.body.button === 'approve'){
                    queryText = `UPDATE "fulfillment"
                             SET "status_id" =4
                             WHERE "id" = $1;`
                    value = [responseId]
                    await client.query(queryText, value)
                }
                
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


module.exports = router;