const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        //console.log('notesGET Body: ', req.body);
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT "id" FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let values = [req.body.date, req.body.order]
                //console.log('values: ',values);
                
                let response = await client.query(queryText, values)
                //console.log('response 18: ',response.rows);
                
                const responseId = response.rows[0].id
                //console.log('responseId: ', responseId);
                
                queryText = `SELECT "note"."note_entry" FROM "note" 
                JOIN "note_fulfillment" ON 
                "note_fulfillment"."note_id" = "note"."id"
                WHERE "note_fulfillment"."fulfillment_id" = $1
                ORDER BY "note"."id";`
                values = [responseId]
                //console.log('values 31', values);
                
                let results = await client.query(queryText, values)
                //console.log('resultsrow 34',results);
                
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

module.exports = router;