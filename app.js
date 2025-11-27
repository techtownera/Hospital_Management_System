const exprees = require('express');
const app = exprees();
const path = require('path');
const ejs = require('ejs');
const Appointment = require("./models/appointment");
const Patient = require('./models/patient');
const Feedback = require('./models/feedback');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { hash } = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const patient = require('./models/patient');



app.set("view engine", "ejs");
// app.use(exprees.static(path.join(__dirname + 'public')));
app.use(exprees.static('public'));
app.use(exprees.json());
app.use(exprees.urlencoded({extended:true}));
app.use(cookieParser());


// console.log(path.join(__dirname + 'public'));


app.get('/', (req, res) =>{

    res.render("index");

});

app.get('/about', function(req, res){

    res.render("about");

});

app.get('/contact', function(req, res){

    res.render("contact");

});

app.post('/register', async (req, res) =>{

    const {fname, lname, email, phone, password, gender, role} = req.body;

    const user = await Patient.findOne({email});

    if(user) res.status(500).res.send("User Already Registerd.....");

    bcrypt.genSalt(10, (err, salt) =>{
        // console.log(salt);
        bcrypt.hash(password, salt, async (err, hash) =>{
            // console.log(hash);

           const newuser = await Patient.create({


                 First_Name : fname,
                 Last_Name: lname,
                 email: email,
                 phone: phone,
                 gender: gender,
                 password: hash,
                 role: role
                
               
            });

            const token = jwt.sign({email : newuser.email, id: newuser._id}, "SECRET");
            res.cookie("token", token);

            // res.status(500).render("patientlogin");

            if(newuser.role === "Patient"){
                console.log("check1");
                res.render('patientlogin');
            }
            else if(newuser.role === "Doctor"){
                console.log("check2");
                res.render("doctorlogin");

            }
            else if(newuser.role === "Admin"){
               console.log("check2");
                res.render("adminlogin");
            }

            
        })
    })

    


});

app.get('/login', function(req, res){

    res.render("commonlogin");

});  

app.post("/login", async function(req, res){

    const {email, password } = req.body;

    const user = await Patient.findOne({email});

    if(!user) res.status(500).send("Something Went Wrong........");

    bcrypt.compare(password, user.password, function(err, result){

        if(result) {

            const token = jwt.sign({email: user.email, id: user._id }, "SECRET");
            res.cookie("token", token);

            // res.status(200).render("Dashboard");

            if(user.role === "Patient"){
                res.status(200).render('Dashboard', {fname: user.First_Name});
            }
            else if(user.role === "Doctor"){
                res.status(200).render("doctordashboard", {email});
            }
            else{
                res.status(200).render("admindashboard", {fname: user.First_Name});
            }

        }
        else{
            console.log("Wrong Credantials.....");
            res.redirect("/login");

        }

    })

});

app.get('/docmeet/:email', async function(req, res){

    const appoint = await Appointment.find();
    console.log("all appointments", appoint);

    const doc = await Patient.findOne({email : req.params.email});
    console.log("One users ", doc);

    // console.log(req.params.email);

     const doctorname = doc.First_Name + " " + doc.Last_Name;
    console.log(doctorname);

    res.render("doctorapp", {doctorname, doc, appoint});
 
    



});

app.get('/profile', isloggedin, function(req, res){

    console.log(req.user);
    res.redirect("/login");
})

app.get("/logout", function(req, res){

    res.cookie("token", "");
    // res.redirect("/login");
    res.send("logout");

});


function isloggedin (req , res, next){

//    console.log(req.cookies.token);
    // const token = req.cookies.token;
    

    if(req.cookies.token === "") {
        res.send("You Must Be Logged in First...... ");
    }
    else {

        const data = jwt.verify(req.cookies.token, "SECRET");
    //  console.log(data);
        req.user = data;
        next();

    }

   
    
}

app.get('/book', function(req, res){

    res.render("appointment");

});

app.post('/book', async function(req, res){

    const {docname, patient_name, fees, date, time } = req.body;

    console.log(req.body);

    const new_appointment = await Appointment.create({

        doctor_name : docname,
        patient_name: patient_name,
        fee: fees,
        date: date,
        time: time

    });

     // Create a new PDF document
    const doc = new PDFDocument();

    // Set the response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${docname}.pdf"`);

    // Pipe the PDF content to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(25).text('Your Appointment Details', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${docname}`);
    doc.text(`Fees: ${patient_name}`);
    doc.text(`Fees: ${fees}`);
    doc.text(`Date: ${date}`);
    doc.text(`Time: ${time}`);


    // End the PDF generation
    doc.end();



});


app.post('/feedback', async function(req, res){

    const {name, email, phone, feedback} = req.body;
    
    // console.log(req.body);
   

    const fb = await Feedback.create({

        name,
        email,
        phone,
        feedback

    });

     res.redirect('/'); 

    

});

app.get('/queries', async function(req, res){

    const query = await Feedback.find();

    res.render("queries", {query});
});

app.get('/alldoctors', async function(req, res){

    const alldocs = await Patient.find();

    res.render("doctorlist", {alldocs});
});

app.get('/allpatients', async function(req, res){

    const allpatients = await Patient.find();

    res.render("patientlist", {allpatients});
});

app.get('/allappoint', async function(req, res){

    const allappoint = await Appointment.find();

    res.render("apointmentdetail", {allappoint});
});

app.get('/adddoc', function(req, res){

    res.render("adddoc");
});

app.post('/adddoc', async function(req, res){

    const {fname, lname, email, phone, password, gender} = req.body;

    const user = await Patient.findOne({email});

    if(user) res.status(500).res.send("User Already Registerd.....");

    bcrypt.genSalt(10, (err, salt) =>{
        // console.log(salt);
        bcrypt.hash(password, salt, async (err, hash) =>{
            // console.log(hash);

           const newuser = await Patient.create({


                 First_Name : fname,
                 Last_Name: lname,
                 email: email,
                 phone: phone,
                 gender: gender,
                 password: hash,
                 role: "Doctor" 
                
               
            });

            const token = jwt.sign({email : newuser.email, id: newuser._id}, "SECRET");
            res.cookie("token", token);

            res.redirect('/alldoctors');

        });
    });
    

});


app.get('/deletedoc', function(req, res){

    res.render("delete");

});

app.post('/deletedoc', async function(req, res){

    const {email} = req.body;

    const doc = await Patient.findOneAndDelete({email});

    console.log(doc);


    res.redirect("/alldoctors"); 

});


app.get('/history', async function(req, res){

    const allappointments = await Appointment.find();

    console.log(allappointments);

    res.render("history",  {allappointments});


});

module.exports = app; // Export the app



