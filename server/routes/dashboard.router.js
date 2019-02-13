const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    if(req.isAuthenticated){
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
    if (req.isAuthenticated) {
        pool.query(`INSERT INTO "fulfillment"("order_id","person_id")
                    VALUES($1,$2);`, [req.body.id, req.body.person]).then((results) => {
            res.send(results.rows);
        }).catch((error) => {
            console.log('error in dashboard post', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;