var mysql = require("mysql");
var express = require("express");
var bodyparser = require("body-parser");
const path = require("path");
const multer = require("multer");
var cors = require("cors")

var app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors())

app.use("/imgupload",express.static("imgupload"));

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test",
});

const storage = multer.diskStorage({
    destination:path.join('./imgupload'),
    filename:function(req,file,callback){
        callback(null, Date.now() + '-' + path.extname
        (file.originalname))
    }
})

app.post("/api/insert",(req,res)=>{
    let upload = multer({storage:storage}).single("desti_file");

    upload(req,res,function(err){
        if(!req.file){
            console.log("Not Found");
        }else{
            var desti_name = req.body.desti_name;
            var stay_night = req.body.stay_night;
            var start_price = req.body.start_price;
            var desti_file = req.file.filename;
            
            const query = "insert into add_desti (desti_name ,stay_night,start_price,desti_file) values(?,?,?,?) "
            con.query(query,[desti_name,stay_night,start_price,desti_file])
            // console.log(query)
            
            res.send({
                message:"Data Submit"
            })
            return;
        }
    
    })
});

app.get("/api/data_list",(req,resp)=>{
    const fetch_data ="select * from add_desti";
    con.query(fetch_data,(err,result)=>{
        // console.log(result);
        resp.send(result);
    });
})
// app.post("/api/insert",(req,res)=>{
//     var name=req.body.name;
//     var email = req.body.email
//     console.log(name)
//     console.log(email)
//     const query = "insert into demo (name ,email) values(?,?) "
//     con.query(query,[name,email])
//     console.log(query)
    
//     res.send({
//         message:"Data Submit"
//     })
//     return;
// })

var port=1337;

app.listen(port, ()=>{
    console.log("Connected");
});

con.connect(function (error){
if(error)
    throw error;
console.log("DB is Connected");
});




// app.post("/api/insert",(req,res)=>{
//     var desti_name = req.body.desti_name;
//     var stay_night = req.body.stay_night
//     console.log(desti_name)
//     console.log(stay_night)
//     console.log(start_price)
//     console.log(desti_file)
//     const query = "insert into demo (desti_name ,stay_night,start_price,desti_file) values(?,?) "
//     con.query(query,[desti_name,stay_night,start_price,desti_file])
//     console.log(query)
    
//     res.send({
//         message:"Data Submit"
//     })
//     return;
// });