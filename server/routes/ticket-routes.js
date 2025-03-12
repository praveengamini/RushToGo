import express from 'express';
import { uploadTicket,getAllTickets } from '../controllers/ticket-controller.js';
import { upload } from '../helpers/cloudinary.js'; // Import the upload middleware

const router = express.Router();

// Route to upload a ticket with an image
// "upload.single('image')" specifies that the form field containing the image is called "image"
router.post('/upload', upload.single('image'), uploadTicket);
router.get('/getAll', getAllTickets);
export default router;
