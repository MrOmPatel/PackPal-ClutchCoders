const mongoose = require('mongoose');
const crypto = require('crypto');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Activity date is required']
  },
  startTime: String,
  endTime: String,
  location: {
    type: String,
    required: [true, 'Activity location is required']
  },
  cost: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planned', 'confirmed', 'completed', 'cancelled'],
    default: 'planned'
  },
  notes: String,
  attachments: [{
    type: String, // URLs to attachments
    trim: true
  }]
});

const checklistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Checklist title is required'],
    trim: true
  },
  items: [{
    text: {
      type: String,
      required: [true, 'Checklist item text is required'],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date
  }]
});

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Expense amount cannot be negative']
  },
  category: {
    type: String,
    enum: ['Transportation', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Other'],
    default: 'Other'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number
  }],
  date: {
    type: Date,
    default: Date.now
  },
  receipt: String // URL to receipt image
});

const packingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1']
  },
  category: {
    type: String,
    enum: ['Essentials', 'Clothing', 'Electronics', 'Documents', 'Other'],
    default: 'Other'
  },
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  memberPackingStatus: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    packed: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, 'Quantity cannot be negative']
    },
    packedAt: {
      type: Date,
      default: null
    },
    notes: String
  }],
  isShared: {
    type: Boolean,
    default: false
  },
  sharedQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Shared quantity must be at least 1']
  }
});

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxLength: [100, 'Trip title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripCode: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase()
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxParticipants: {
    type: Number,
    min: [1, 'Trip must allow at least 1 participant'],
    max: [50, 'Trip cannot have more than 50 participants'],
    default: 10
  },
  activities: [activitySchema],
  checklists: [checklistSchema],
  expenses: [expenseSchema],
  packingList: [packingItemSchema],
  status: {
    type: String,
    enum: ['planning', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    trim: true
  },
  gallery: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  weatherForecast: {
    type: mongoose.Schema.Types.Mixed
  },
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  importantNotes: [{
    title: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating trip duration
tripSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for calculating number of current participants
tripSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => p.status === 'accepted').length;
});

// Virtual for calculating total expenses
tripSchema.virtual('totalExpenses').get(function() {
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Method to check if trip is full
tripSchema.methods.isFull = function() {
  return this.participantCount >= this.maxParticipants;
};

// Method to get upcoming activities
tripSchema.methods.getUpcomingActivities = function() {
  const now = new Date();
  return this.activities
    .filter(activity => activity.date >= now)
    .sort((a, b) => a.date - b.date);
};

// Method to join trip using trip code
tripSchema.methods.joinWithCode = async function(userId, code) {
  if (this.tripCode !== code) {
    throw new Error('Invalid trip code');
  }

  if (this.isFull()) {
    throw new Error('Trip is full');
  }

  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  if (existingParticipant) {
    throw new Error('User is already a participant');
  }

  this.participants.push({
    user: userId,
    role: 'member',
    status: 'pending'
  });

  return this.save();
};

// Pre-save middleware to update status based on dates
tripSchema.pre('save', function(next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'completed';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  }
  next();
});

// Add new virtual property for overall packing status
tripSchema.virtual('packingProgress').get(function() {
  const totalItems = this.packingList.length;
  if (totalItems === 0) return 0;
  
  const totalPackedItems = this.packingList.reduce((count, item) => {
    const packedMembers = item.memberPackingStatus.filter(status => status.packed).length;
    return count + (packedMembers > 0 ? 1 : 0);
  }, 0);
  
  return Math.round((totalPackedItems / totalItems) * 100);
});

// Add method to get member's packing status
tripSchema.methods.getMemberPackingStatus = function(userId) {
  const memberItems = this.packingList.map(item => {
    const memberStatus = item.memberPackingStatus.find(status => status.user.toString() === userId.toString());
    return {
      itemId: item._id,
      name: item.name,
      category: item.category,
      assigned: item.assignedTo?.toString() === userId.toString(),
      packed: memberStatus?.packed || false,
      quantity: memberStatus?.quantity || 1,
      packedAt: memberStatus?.packedAt,
      notes: memberStatus?.notes
    };
  });
  
  const totalItems = memberItems.length;
  const packedItems = memberItems.filter(item => item.packed).length;
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  
  return {
    items: memberItems,
    progress,
    totalItems,
    packedItems
  };
};

// Add method to update member's packing status
tripSchema.methods.updateMemberPackingStatus = async function(userId, itemId, status) {
  const item = this.packingList.id(itemId);
  if (!item) {
    throw new Error('Item not found');
  }
  
  const memberStatus = item.memberPackingStatus.find(s => s.user.toString() === userId.toString());
  if (memberStatus) {
    memberStatus.packed = status.packed;
    memberStatus.quantity = status.quantity || 1;
    memberStatus.notes = status.notes;
    memberStatus.packedAt = status.packed ? new Date() : null;
  } else {
    item.memberPackingStatus.push({
      user: userId,
      packed: status.packed,
      quantity: status.quantity || 1,
      notes: status.notes,
      packedAt: status.packed ? new Date() : null
    });
  }
  
  return this.save();
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip; 