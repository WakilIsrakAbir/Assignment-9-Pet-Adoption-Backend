import express from 'express';
const router = express.Router();
import Request from '../models/Request.js';
import Pet from '../models/Pet.js';
import verifyToken from '../middleware/verifyToken.js';

// Submit an adoption request (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { petId, pickupDate, message, ownerEmail } = req.body;
    
    if (ownerEmail === req.user.email) {
      return res.status(400).json({ message: 'Owners cannot request to adopt their own pets' });
    }

    const newRequest = new Request({
      petId,
      requesterName: req.user.name || 'User', // assuming user name is in token or body
      requesterEmail: req.user.email,
      pickupDate,
      message,
      ownerEmail
    });

    await newRequest.save();
    res.status(201).json({ message: 'Adoption request submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's requests (My Requests) (Protected)
router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ requesterEmail: req.user.email }).populate('petId', 'petName');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get requests for user's pets (My Listings) (Protected)
router.get('/my-listings', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ ownerEmail: req.user.email }).populate('petId', 'petName');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject a request (Protected, Owner only)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.ownerEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden access' });

    request.status = status;
    await request.save();

    if (status === 'approved') {
      // Mark pet as adopted
      await Pet.findByIdAndUpdate(request.petId, { status: 'adopted' });
      // Reject other pending requests for the same pet
      await Request.updateMany(
        { petId: request.petId, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    res.json({ message: `Request ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
