import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: {
    email: string;
    phone?: string;
    name: string;
    region: string;
    country: string;
    coordinates?: [number, number];
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    riskLevels: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[];
    frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
  };
  subscriptions: {
    glaciers: mongoose.Types.ObjectId[];
    regions: string[];
    globalAlerts: boolean;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastNotificationSent?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
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
    coordinates: {
      type: [Number],
      validate: {
        validator: function(v: number[]) {
          return !v || (v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90);
        },
        message: 'Invalid coordinates format'
      }
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    riskLevels: [{
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: ['MEDIUM', 'HIGH', 'CRITICAL']
    }],
    frequency: {
      type: String,
      enum: ['IMMEDIATE', 'DAILY', 'WEEKLY'],
      default: 'IMMEDIATE'
    }
  },
  subscriptions: {
    glaciers: [{
      type: Schema.Types.ObjectId,
      ref: 'Glacier'
    }],
    regions: [{
      type: String,
      trim: true
    }],
    globalAlerts: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  lastNotificationSent: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
notificationSchema.index({ 'user.email': 1 });
notificationSchema.index({ 'user.phone': 1 });
notificationSchema.index({ 'user.region': 1 });
notificationSchema.index({ 'user.country': 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ 'preferences.riskLevels': 1 });

// Virtual for notification count
notificationSchema.virtual('notificationCount').get(function(this: INotification) {
  return this.lastNotificationSent ? 1 : 0;
});

// Method to check if user should receive notification
notificationSchema.methods.shouldNotify = function(this: INotification, riskLevel: string, glacierId?: string): boolean {
  if (this.status !== 'ACTIVE') return false;
  
  // Check if risk level matches preferences
  if (!this.preferences.riskLevels.includes(riskLevel as any)) return false;
  
  // Check if user is subscribed to specific glacier
  if (glacierId && !this.subscriptions.glaciers.includes(glacierId as any)) return false;
  
  return true;
};

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
