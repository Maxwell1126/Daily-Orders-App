const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        pool.query(`SELECT * FROM "order" 
                    WHERE "person_id" =${req.user.id};`).then((results) => {
            res.send(results.rows);
        }).catch((error) => {
            console.log('error in dashboard get', error);
            res.sendStatus(500);
        })
    }else{
        res.sendStatus(403);
    }
    
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
    if (req.isAuthenticated()) {
        // moment().format('L');
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                let queryText = `INSERT INTO "fulfillment"("order_id","person_id")
                    VALUES($1,$2);`;
                const values = [req.body.id, req.body.person];
                let results =await client.query(queryText, values);
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
    }
    else {
        res.sendStatus(403);
    }
})

module.exports = router;