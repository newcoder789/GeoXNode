import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'FLOOD' | 'AVALANCHE' | 'GLACIER_RETREAT' | 'LAKE_FORMATION' | 'WEATHER_ALERT' | 'SYSTEM_ALERT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: {
    coordinates: [number, number];
    region: string;
    country: string;
    glacierName?: string;
  };
  details: {
    startTime: Date;
    endTime?: Date;
    affectedArea?: number; // km²
    casualties?: number;
    damage?: string;
    source: string; // API source or manual entry
  };
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING';
  notifications: {
    sent: number;
    total: number;
    lastSent?: Date;
  };
  metadata: {
    tags: string[];
    images?: string[];
    externalLinks?: string[];
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['FLOOD', 'AVALANCHE', 'GLACIER_RETREAT', 'LAKE_FORMATION', 'WEATHER_ALERT', 'SYSTEM_ALERT'],
    required: [true, 'Event type is required']
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: [true, 'Event severity is required']
  },
  location: {
    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(v: number[]) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates format'
      }
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    glacierName: {
      type: String,
      trim: true
    }
  },
  details: {
    startTime: {
      type: Date,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: Date
    },
    affectedArea: {
      type: Number,
      min: [0, 'Affected area must be positive']
    },
    casualties: {
      type: Number,
      min: [0, 'Casualties must be non-negative']
    },
    damage: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      required: [true, 'Event source is required'],
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED', 'MONITORING'],
    default: 'ACTIVE'
  },
  notifications: {
    sent: {
      type: Number,
      default: 0,
      min: [0, 'Sent notifications must be non-negative']
    },
    total: {
      type: Number,
      default: 0,
      min: [0, 'Total notifications must be non-negative']
    },
    lastSent: {
      type: Date
    }
  },
  metadata: {
    tags: [{
      type: String,
      trim: true
    }],
    images: [{
      type: String,
      trim: true
    }],
    externalLinks: [{
      type: String,
      trim: true
    }],
    verified: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ type: 1, severity: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ 'details.startTime': -1 });
eventSchema.index({ 'location.region': 1 });
eventSchema.index({ 'location.glacierName': 1 });

// Virtual for duration
eventSchema.virtual('duration').get(function(this: IEvent) {
  if (!this.details.endTime) return null;
  return this.details.endTime.getTime() - this.details.startTime.getTime();
});

// Virtual for isActive
eventSchema.virtual('isActive').get(function(this: IEvent) {
  return this.status === 'ACTIVE';
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
