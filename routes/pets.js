import express from 'express';
const router = express.Router();
import Pet from '../models/Pet.js';
import verifyToken from '../middleware/verifyToken.js';

// Get all pets with search and filter
router.get('/', async (req, res) => {
  try {
    const { name, species } = req.query;
    let query = {};
    
    if (name) query.petName = { $regex: name, $options: 'i' };
    if (species) query.species = { $in: species.split(',') };

    const pets = await Pet.find(query).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single pet
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a pet (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPet = new Pet({
      ...req.body,
      ownerEmail: req.user.email
    });
    const savedPet = await newPet.save();
    res.status(201).json({ message: 'Pet added successfully', pet: savedPet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a pet (Protected, Owner only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.ownerEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden access' });

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a pet (Protected, Owner only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    if (pet.ownerEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden access' });

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
