const express=require("express");
const router = express.Router();                                                                     

// User Module
router.get("/",(req,res)=>{
    res.send("User Route");
})

router.get("/:id",(req,res)=>{
    res.send("Get for show users");
})

router.post("/",(req,res)=>{
    res.send("Post for users");
})

router.delete("/:id",(req,res)=>{
    res.send("Delete for user id");
})

// above 2 line router we are exporting here
module.exports = router;  