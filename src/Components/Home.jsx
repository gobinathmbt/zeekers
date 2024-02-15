import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const API_URL = "http://localhost:9000";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  image: Yup.mixed().required('Image is required'),
});

const Home = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/candidates`);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditOpen = (candidate) => {
    setSelectedCandidate(candidate);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setSelectedCandidate(null);
    setEditOpen(false);
  };


const handleOpenConfirmation = (id) => {
    setDeleteCandidateId(id);
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setDeleteCandidateId(null);
    setOpenConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/candidates/${deleteCandidateId}`);
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    } finally {
      handleCloseConfirmation();
    }
  };

  const handleDelete = (id) => {
    handleOpenConfirmation(id);
  };

  const handleSubmit = async (values, actions) => {

    const userEmail = sessionStorage.getItem('email');
    const userName = sessionStorage.getItem('name');

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('image', values.image);
      formData.append('sessionEmail', userEmail);
      formData.append('sessionName', userName);


      await axios.post(`${API_URL}/candidate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      actions.setSubmitting(false);
      handleClose();
      fetchCandidates();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditSubmit = async (values, actions) => {
    const userEmail = sessionStorage.getItem('email');
    const userName = sessionStorage.getItem('name');
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('image', values.image);
      formData.append('sessionEmail', userEmail);
      formData.append('sessionName', userName);

      await axios.put(`${API_URL}/candidates/${selectedCandidate._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      actions.setSubmitting(false);
      handleEditClose();
      fetchCandidates();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  return (
    <div>
      <Button onClick={handleOpen} variant="contained" color="primary">
        Add User
      </Button>

      <Modal open={editOpen} onClose={handleEditClose}>
  <div style={{ position: 'absolute', top: '50%', padding: "30px", backgroundColor: '#FFFFFF', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
    <h2>Edit User</h2>
    <Formik
      initialValues={{ name: selectedCandidate ? selectedCandidate.name : '', email: selectedCandidate ? selectedCandidate.email : '', phone: selectedCandidate ? selectedCandidate.phone : '', image: null }}
      validationSchema={validationSchema}
      onSubmit={handleEditSubmit}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <FormControl fullWidth error={errors.name && touched.name}>
            <Field
              as={TextField}
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
            />
            {errors.name && touched.name ? (
              <FormHelperText>{errors.name}</FormHelperText>
            ) : null}
          </FormControl>
          <FormControl fullWidth error={errors.email && touched.email}>
            <Field
              as={TextField}
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
            />
            {errors.email && touched.email ? (
              <FormHelperText>{errors.email}</FormHelperText>
            ) : null}
          </FormControl>
          <FormControl fullWidth error={errors.phone && touched.phone}>
            <Field
              as={TextField}
              id="phone"
              name="phone"
              label="Phone"
              variant="outlined"
              fullWidth
            />
            {errors.phone && touched.phone ? (
              <FormHelperText>{errors.phone}</FormHelperText>
            ) : null}
          </FormControl>
          <FormControl fullWidth error={errors.image && touched.image}>
            <input
              id="image"
              name="image"
              type="file"
              onChange={(event) => {
                setFieldValue('image', event.currentTarget.files[0]);
              }}
            />
            {errors.image && touched.image ? (
              <FormHelperText>{errors.image}</FormHelperText>
            ) : null}
          </FormControl>
          <Button type="submit" variant="contained" color="primary" disabled={false}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  </div>
</Modal>

      <Modal open={open} onClose={handleClose} >
        <div style={{ position: 'absolute', top: '50%',padding:"30px",backgroundColor: '#FFFFFF',  left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <h2>Add User</h2>
          <Formik
            initialValues={{ name: '', email: '', phone: '', image: null }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                <FormControl fullWidth error={errors.name && touched.name}>
                  <Field
                    as={TextField}
                    id="name"
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                  />
                  {errors.name && touched.name ? (
                    <FormHelperText>{errors.name}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl fullWidth error={errors.email && touched.email}>
                  <Field
                    as={TextField}
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                  {errors.email && touched.email ? (
                    <FormHelperText>{errors.email}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl fullWidth error={errors.phone && touched.phone}>
                  <Field
                    as={TextField}
                    id="phone"
                    name="phone"
                    label="Phone"
                    variant="outlined"
                    fullWidth
                  />
                  {errors.phone && touched.phone ? (
                    <FormHelperText>{errors.phone}</FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl fullWidth error={errors.image && touched.image}>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={(event) => {
                      setFieldValue('image', event.currentTarget.files[0]);
                    }}
                  />
                  {errors.image && touched.image ? (
                    <FormHelperText>{errors.image}</FormHelperText>
                  ) : null}
                </FormControl>
                <Button type="submit" variant="contained" color="primary" disabled={false}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>

      <Modal open={openConfirmation} onClose={handleCloseConfirmation}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: '#FFFFFF', boxShadow: 24, padding: 4 }}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this candidate?</p>
          <Button variant="contained" color="primary" onClick={handleConfirmDelete}>Yes</Button>
          <Button variant="contained" color="secondary" onClick={handleCloseConfirmation}>No</Button>
        </div>
      </Modal>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Sno</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={index}>
                 <TableCell>{index + 1}</TableCell>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>{candidate.phone}</TableCell>
                <TableCell>
                  <img src={`${API_URL}/candidate/image/${candidate.image}`} alt="Candidate Image" style={{ width: 100, height: 100 }} />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditOpen(candidate)}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(candidate._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Home;
