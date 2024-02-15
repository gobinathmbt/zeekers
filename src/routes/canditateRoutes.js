const express = require("express");
const app = express.Router();
const multer = require('multer');
const candidateController = require('../controllers/canditateController');

const upload = multer({ dest: 'public/uploads/' });

app.post('/candidate', upload.single('image'), candidateController.create_canditate);
app.get('/candidate/image/:imgname', candidateController.get_Image);
app.get('/candidates', candidateController.getAllCandidates);
app.get('/logs', candidateController.getAlllogs);
app.put('/candidates/:id',upload.single('image'), candidateController.updateCandidate);
app.delete('/candidates/:id', candidateController.deleteCandidate);


module.exports = app;
