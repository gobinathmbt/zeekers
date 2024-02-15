const Canditate = require("../model/models").Canditate;
const Log = require("../model/models").Logs;
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const create_canditate = async (req, res) => {

    //  validation

    try {
      const { name, email, phone } = req.body;

      const requiredFields = ['name', 'email', 'phone'];
      for (const field of requiredFields) {
       if (!req.body.values[field] || req.body.values[field].trim() === "") {
           return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is Required and cannot be empty.` });
       }
       }

      const image = req.file.filename;
      const uid = crypto.randomBytes(16).toString("hex");
      const newCandidate = new Canditate({
        uid,
        name,
        email,
        phone,
        image,
      });
      await Log.create({
        action: 'Candidate Created',
        user: req.body.sessionName 
      });

      (()=>{

      })()

      //
  
  
      await newCandidate.save();
  
      res.status(201).json({ message: 'Candidate created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
};



const get_Image = async (req, res) => {
  const imagePath = path.join(__dirname, '../../public/uploads/', req.params.imgname);
  res.sendFile(imagePath);
};

const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Canditate.find({ is_active: true, is_deleted: false });
        res.status(200).json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAlllogs= async (req, res) => {
    try {
        const data = await Log.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateCandidate = async (req, res) => {

    // validation

   if (!req.params.id) {
        return res.status(400).json({ message: "ID is Required." });
    }

    try {
      const candidateId = req.params.id;
      const { name, email, phone } = req.body;
      let image = null;
  
      const candidate = await Canditate.findById(candidateId);
  
      const logDetails = {
        action: 'Candidate Updated',
        user: req.body.sessionName,
        changes: [] 
      };
  
      if (req.file) {
        image = req.file.filename;
        if (candidate.image) {
          const imagePath = path.join(__dirname, '../../public/uploads/', candidate.image);
          fs.unlinkSync(imagePath);
        }
        logDetails.changes.push({ field: 'image', oldValue: candidate.image, newValue: image });
      } else {
        image = candidate.image;
      }

      if (name !== candidate.name) {
        logDetails.changes.push({ field: 'name', oldValue: candidate.name, newValue: name });
      }
      if (email !== candidate.email) {
        logDetails.changes.push({ field: 'email', oldValue: candidate.email, newValue: email });
      }
      if (phone !== candidate.phone) {
        logDetails.changes.push({ field: 'phone', oldValue: candidate.phone, newValue: phone });
      }
  
      await Log.create(logDetails);
  
      const updatedCandidate = await Canditate.findByIdAndUpdate(
        candidateId,
        { name, email, phone, image },
        { new: true }
      );
  
      if (!updatedCandidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
  
      res.status(200).json(updatedCandidate);
    } catch (error) {
      console.error('Error updating candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

const deleteCandidate = async (req, res) => {

    // validation
    try {
      const candidateId = req.params.id;
      const updatedCandidate = await Canditate.findByIdAndUpdate(
        candidateId,
        { is_deleted: true },
        { new: true }
      );

      await Log.create({
        action: 'Candidate Deleted',
        user: req.body.sessionName 
      });
  
  
      if (!updatedCandidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
  
      res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



module.exports = {
    create_canditate: create_canditate,
    get_Image:get_Image,
    getAllCandidates:getAllCandidates,
    getAlllogs:getAlllogs,
    updateCandidate:updateCandidate,
    deleteCandidate:deleteCandidate,
};