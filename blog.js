const express = require('express');
const router = express.Router();


router.get("/blog", (req,res)=> {
    
    res.status(200).send("OK Successfully Get All Data");
});

router.post("/blog", (req , res)  => {
    console.log(req.body);
    res.status(201).send("Create successfully");
    
})

module.exports = router;
