const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `SELECT * FROM "fulfillment" 
                                 WHERE "date" = $1
                                 AND "order_id" = $2;`;
                let values = [req.body.date,req.body.id]
                let response = await client.query(queryText,values)
                let responseId = response.rows[0].id;

                
                queryText = `INSERT INTO "note"("note_entry")
                             VALUES($1) RETURNING "id";`;
                values = [req.body.note]
                //console.log('values 23 add',values);
                
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


