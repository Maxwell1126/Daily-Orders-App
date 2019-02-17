const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        
        
        (async () => {
            console.log('wreck order date 10', req.body.date);
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let values =[req.body.date,req.body.id]
                let response = await client.query(queryText, values)
                console.log('response 19', response);
                
                //console.log('wreck params: ', req.params);
                
                //console.log('responseId:', responseId);
                
                if (response.rows.length === 0) {
                    queryText = `INSERT INTO "fulfillment"("order_id","person_id","date")
                    VALUES($1,$2,$3) RETURNING "id";`;
                    values = [req.body.id,req.body.person,req.body.date]
                    //let values = [req.body.id, req.body.person];
                    // console.log('wreck body person: ', req.body.person);
                    // console.log('wreck body id: ', req.body.id);
                    let results = await client.query(queryText,values);
                    // console.log('results 44: ', results);

                    const resultsId = results.rows[0].id;

                    queryText = `SELECT "product"."product_name", "order_product"."product_id"
                             FROM "product" JOIN "order_product" 
                             ON "product"."id" = "order_product"."product_id" 
                             WHERE "order_product"."order_id" =${req.body.id};`
                    let responses = await client.query(queryText)
                    console.log('response', responses.rows);



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
                ORDER BY "product"."id";`
                values = [resultsId]
                results =await client.query(queryText,values)
            
                await client.query('COMMIT');
                res.send(results.rows)
                }else{
                    const responseId = response.rows[0].id
                    queryText = `SELECT "product"."id", "product"."product_name", 
                "product_fulfillment"."quantity" FROM "product" 
                JOIN "product_fulfillment" ON 
                "product_fulfillment"."product_id" = "product"."id"
                WHERE "product_fulfillment"."fulfillment_id" = $1
                ORDER BY "product"."id";`
                    values = [responseId]
                    results = await client.query(queryText, values)

                    await client.query('COMMIT');
                    res.send(results.rows)
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
        console.log('wreck body button: ', req.body.button);
        
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
                if (req.body.button ==='submit'){
                queryText = `UPDATE "fulfillment"
                             SET "status_id" =2
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