const mongoose=require("mongoose");
const initData=require("./data.js"); 
const Listing=require("../models/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to DB of index.js");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
} 

const initDB = async ()=>{
    //Deleting complete existing data
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj) => ({...obj, owner:"65ace8dc23accd2ab375babf"}));  //zeba 65ace8dc23accd2ab375babf
   await Listing.insertMany(initData.data);
   console.log("Data was initialized");
}

initDB();