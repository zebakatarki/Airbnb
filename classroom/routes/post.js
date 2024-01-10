const express=require("express");
const router = express.Router();                                                                     

//POST
router.get("/",(req,res)=>{
    res.send("Post Route");
})

router.get("/:id",(req,res)=>{
    res.send("Get for show Posts");
})

router.post("/",(req,res)=>{
    res.send("Post for Posts");
})

router.delete("/:id",(req,res)=>{
    res.send("Delete for Post id");
})

module.exports = router;