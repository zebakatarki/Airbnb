const mongoose=require("mongoose");
const initData=require("./data.js"); //complete data of data.js in "initData"
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

// let finalData=initData.data; 

const initDB = async ()=>{
    //Deleting complete existing data
    await Listing.deleteMany({});

    //mapping tthe owner property
    //Adding same user to every review
    //initData is the file and data is array but the map fun ll not make the changes in original array but make new array and add owner propert in it 
    //and return new array and v store it in a same variable
    initData.data=initData.data.map((obj) => ({...obj, owner:"65a04cba5747b40bb2954dda"}));

    //inserting only the "data" of data.js from "initData" whr complete data of data.js is present
   await Listing.insertMany(initData.data);
   console.log("Data was initialized");
}

initDB();