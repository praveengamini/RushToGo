import express from 'express';
import { uploadTicket,getAllTickets } from '../controllers/ticket-controller.js';
import { upload } from '../helpers/cloudinary.js'; 

const router = express.Router();

router.post('/upload', upload.single('image'), uploadTicket);
router.get('/getAll', getAllTickets);
export default router;
