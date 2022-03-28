require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3001;
const MONGODB = process.env.MONGODB;
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Mongoose Models
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    teacher: String,
    subject: String,
    dateAdded: Date,
    files: [String],
    students: [String],
});
const Classes = mongoose.model('classes',ClassSchema);

const UserSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    role: String,
    classes: [String]
});
const Users = mongoose.model('users', UserSchema);

//multer options
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, 'public')
//   },
//     filename: function (req, file, cb) {
//     cb(null,file.originalname )
//   }
// });

// var upload = multer({storage:storage});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,X-CSRF-TOKEN');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//AWS configuration
aws.config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
});

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        bucket: BUCKET,
        s3: s3,
        acl: 'public-read',
        key: (req,file,cb) => {
            cb(null,file.originalname);
        }
    })
});

app.post('/api/login', async (req,res) => {
    try{
        const {username, password} = req.body;

        const user = await Users.findOne({
            username
        }, '-_id -email').lean();

        if(!user){
            throw new Error('Invalid username/password combination');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(validPassword){
            delete user.password;
            res.status(200).json({userInfo: user});
        }
    }
    catch(error){
        console.log(error);
        return res.status(503).send();
    }
});

app.post('/api/get-classes', async (req,res) => {
    try{
        const {name} = req.body;

        if(!name){
            throw new Error('Student name not found');
        }
            
        const classes = await Classes.find({students: name.trim() }, 'subject files')
    
        if(classes){
            return res.status(200).json({classes})
        }
        else{
            throw new Error('No classes found.');
        }
    }
    catch(error){
        console.log(error);
        return res.status(503).send(error);
    }
});

app.post('/api/get-students', async (req,res) => {
    try{
        const {searchWord} = req.body;
        const query = {$or: [ {firstName: searchWord}, {lastName: searchWord} ], role: 'student'};
        const students = await Users.find(
            query, 'firstName lastName'
        );
    
        if(students){
            return res.json({students});
        }
        else{
            throw new Error('No students found.');
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }

});

app.post('/api/add-class', upload.single('file') , async (req,res) => {
    try{
        const filePath = !req.file ? undefined : req.file.location ;

        let {teacher,subject,selectedStudents} = req.body;
        selectedStudents = !selectedStudents ? undefined : selectedStudents.split(',');
        
        if(!subject){
            throw new Error('No subject defined');
        }

        const classExists = await Classes.findOne({
            subject,
        }).lean();
    
        if(classExists){
            await Classes.updateOne(
                {subject:subject},
                {$push: {students: selectedStudents}},
                {$push: {files: filePath}},
            );
        }
        else{
            let addClass = new Classes({
                teacher,
                subject,
                dateAdded: Date.now(),
                students: selectedStudents,
                files: filePath
            });
            addClass.save();
        }
        if(selectedStudents){
            const students = selectedStudents.map((student) => student.split(' ')[0]);
            students.forEach(async (student) => {
                await Users.updateOne(
                    {firstName: student}, 
                    {$push: {classes: subject}}
                );
            });
        }
        res.status(200).send();
    }
    catch(error){   
        console.log(error);
        res.status(503).json({message: 'Enter subject name'});
    }
});

app.get('/api/download/:filename', (req,res) => {
    console.log(req.params.filename);
    const file = `${__dirname}/public/${req.params.filename}`;
    res.download(file);
});

app.listen(PORT);
console.log('Server is listening on port: ' + PORT);
mongoose.connect(MONGODB, () => console.log('connected to mongoDB'));