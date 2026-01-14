const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const app = express()



app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://abdul:123@cluster0.vcb1wby.mongodb.net/passkey?appName=Cluster0").then(function () {
  console.log("Connected to DB")
}).catch(function () { console.log("Failed to Connect") })


const credential = mongoose.model("credential", {}, "bulkmail")




app.post("/sendMail", function (req, res) {

  var msg = req.body.msg
  var emailList = req.body.emailList

  credential.find().then(function (data) {
    const transporter = nodemailer.createTransport({

      service: "gmail",

      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function (resolve, reject) {
      try {

        for (var i=0;i<emailList.length;i++) 
          {
          await transporter.sendMail({
            from: "basheethabdul1024@gmail.com",
            to: emailList[i],
            subject: "bulk mail App",
            text: msg
          }
          )
          console.log("Email sent to:"+emailList[i])
        }
        resolve("Success")
      }
      catch (error) {
        reject("Failed")
      }


    }).then(function () {
      res.send("Email Send Successfully")
    }).catch(function () {
      res.send(false)
    })


  }).catch(function (error) {
    console.log(error)
  })


})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
