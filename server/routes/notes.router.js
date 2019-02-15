const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/:id', (req, res) => {
    if (req.isAuthenticated) {
        console.log('wreck params: ', req.body.params);
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = CURRENT_DATE
                                 AND "order_id" = $1;`;
                let values =[req.params.id]
                let response = await client.query(queryText,values)
                const responseId = response.rows[0].id
                console.log('wreck params: ', req.params);

                console.log('responseId:', responseId);

                queryText = `SELECT "note"."id", "note"."note_entry" FROM "note" 
                JOIN "note_fulfillment" ON 
                "note_fulfillment"."note_id" = "note"."id"
                WHERE "note_fulfillment"."fulfillment_id" = $1
                ORDER BY "note"."id";`
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
            console.log('error in notes get', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }

});

// router.put('/', (req, res) => {
//     if (req.isAuthenticated) {
//         console.log('wreck body products: ', req.body.products);

//         (async () => {
//             const client = await pool.connect();
//             try {
//                 await client.query('BEGIN');
//                 let queryText = `SELECT "id" FROM "fulfillment" 
//                                  WHERE "date" = CURRENT_DATE
//                                  AND "order_id" = $1;`;
//                 let value = [req.body.id]
//                 let response = await client.query(queryText, value)
//                 const responseId = response.rows[0].id
//                 console.log('responseId: ', responseId);

//                 let i = 0;
//                 while (i < req.body.products.length) {
//                     // console.log('wreck ', wreck);
//                     console.log('i', i);
//                     console.log('products: ', req.body.products[i].quantity);

//                     queryText = `UPDATE "product_fulfillment" 
//                              SET "quantity" =$1
//                              WHERE "fulfillment_id" = $2
//                              AND "product_id" =$3;`
//                     value = [req.body.products[i].quantity,
//                         responseId,
//                     req.body.products[i].id]
//                     i++
//                     await client.query(queryText, value)
//                 }
//                     await client.query('COMMIT');
//                     res.sendStatus(201)
                
//             } catch (e) {
//                 console.log('ROLLBACK', e);
//                 await client.query('ROLLBACK');
//                 throw e;
//             } finally {
//                 client.release();
//             }
//         })().catch((error) => {
//             console.log('error in dashboard post', error);
//             res.sendStatus(500);
//         })
//     } else {
//         res.sendStatus(403);
//     }
// });

// /**
//  * POST route template
//  */
router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT * FROM "fulfillment" 
                                 WHERE "date" = CURRENT_DATE
                                 AND "order_id" = $1;`;
                let values = [req.body.id]
                let response = await client.query(queryText,values)
                let responseId = response.rows[0].id;

                
                queryText = `INSERT INTO "note"("note_entry")
                             VALUES($1) RETURNING "id";`;
                values = [req.body.note.note]
                let results = await client.query(queryText, values)
                let noteId = results.rows[0].id

                queryText = `INSERT INTO "note_fulfillment"("fulfillment_id", "note_id")
                             VALUES ($1,$2);`
                values = [responseId,noteId]
                await client.query(queryText, values)

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
            console.log('error in notes post', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;


