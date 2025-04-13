const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ 'participants.user': req.user.id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all trips for the current user
router.get('/my-trips', auth, async (req, res) => {
  try {
    const trips = await Trip.find({
      'participants.user': req.user._id,
      'participants.status': 'accepted'
    })
    .populate('participants.user', 'name email profilePicture')
    .sort({ startDate: 1 });

    // Separate trips into upcoming and past
    const now = new Date();
    const upcomingTrips = trips.filter(trip => trip.startDate > now);
    const pastTrips = trips.filter(trip => trip.startDate <= now);

    res.json({
      upcomingTrips,
      pastTrips
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming trips
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const upcomingTrips = await Trip.find({
      'participants.user': req.user._id,
      'participants.status': 'accepted',
      startDate: { $gt: now }
    })
    .populate('participants.user', 'name email profilePicture')
    .sort({ startDate: 1 });

    res.json(upcomingTrips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get past trips
router.get('/past', auth, async (req, res) => {
  try {
    const now = new Date();
    const pastTrips = await Trip.find({
      'participants.user': req.user._id,
      'participants.status': 'accepted',
      startDate: { $lte: now }
    })
    .populate('participants.user', 'name email profilePicture')
    .sort({ startDate: -1 });

    res.json(pastTrips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const trip = new Trip({
      ...req.body,
      creator: req.user._id,
      participants: [{
        user: req.user._id,
        role: 'admin',
        status: 'accepted',
        joinedAt: new Date()
      }],
      status: 'planning'
    });

    await trip.save();

    // Update user's trips array
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        trips: {
          trip: trip._id,
          role: 'admin',
          status: 'accepted',
          joinedAt: new Date()
        }
      }
    });

    // Return the newly created trip with populated data
    const populatedTrip = await Trip.findById(trip._id)
      .populate('participants.user', 'name email profilePicture')
      .populate('creator', 'name email profilePicture');

    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join a trip using trip code
router.post('/join/:code', auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ tripCode: req.params.code });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is already a participant
    const existingParticipant = trip.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );
    if (existingParticipant) {
      return res.status(400).json({ error: 'Already a participant of this trip' });
    }

    // Add user as a member
    trip.participants.push({
      user: req.user._id,
      role: 'member',
      status: 'pending',
      joinedAt: new Date()
    });

    await trip.save();

    // Update user's trips array
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        trips: {
          trip: trip._id,
          role: 'member',
          status: 'pending',
          joinedAt: new Date()
        }
      }
    });

    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Accept a pending member
router.post('/:tripId/accept/:userId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if requester is an admin
    const requester = trip.participants.find(
      p => p.user.toString() === req.user._id.toString() && p.role === 'admin'
    );
    if (!requester) {
      return res.status(403).json({ error: 'Only admins can accept members' });
    }

    // Update participant status
    const participant = trip.participants.find(
      p => p.user.toString() === req.params.userId
    );
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    participant.status = 'accepted';
    await trip.save();

    // Update user's trip status
    await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        'trips.$[elem].status': 'accepted'
      }
    }, {
      arrayFilters: [{ 'elem.trip': trip._id }]
    });

    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific trip
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('participants.user', 'name email profilePicture')
      .populate('creator', 'name email profilePicture');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is a participant
    const isParticipant = trip.participants.some(
      p => p.user._id.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized to view this trip' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trip details (admin only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is an admin
    const isAdmin = trip.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.role === 'admin'
    );
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can update trip details' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => trip[update] = req.body[update]);
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove a participant (admin only)
router.delete('/:tripId/participants/:userId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if requester is an admin
    const isAdmin = trip.participants.some(
      p => p.user.toString() === req.user._id.toString() && p.role === 'admin'
    );
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can remove participants' });
    }

    // Remove participant from trip
    trip.participants = trip.participants.filter(
      p => p.user.toString() !== req.params.userId
    );
    await trip.save();

    // Remove trip from user's trips array
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: {
        trips: { trip: trip._id }
      }
    });

    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get packing status for a trip
router.get('/:tripId/packing-status', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const packingStatus = await trip.getMemberPackingStatus(req.user.id);
    res.json(packingStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update packing status for an item
router.put('/:tripId/packing-status/:itemId', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await trip.updateMemberPackingStatus(req.user.id, req.params.itemId, req.body);
    const updatedStatus = await trip.getMemberPackingStatus(req.user.id);
    res.json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new packing item
router.post('/:tripId/packing-items', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const newItem = {
      name: req.body.name,
      quantity: req.body.quantity || 1,
      category: req.body.category || 'Other',
      notes: req.body.notes,
      assignedTo: req.body.assignedTo || req.user.id,
      memberPackingStatus: [{
        user: req.user.id,
        packed: false,
        quantity: req.body.quantity || 1,
        notes: req.body.notes
      }]
    };

    trip.packingList.push(newItem);
    await trip.save();

    const updatedStatus = await trip.getMemberPackingStatus(req.user.id);
    res.json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 