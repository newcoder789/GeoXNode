import mongoose, { Document, Schema } from 'mongoose';

export interface IGlacier extends Document {
  name: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    region: string;
    country: string;
    elevation: number;
  };
  measurements: {
    area: number; // km²
    length: number; // km
    thickness: number; // m
    volume: number; // km³
    lastMeasured: Date;
  };
  riskAssessment: {
    glofRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    retreatRate: number; // m/year
    lakeFormation: boolean;
    lastAssessment: Date;
  };
  environmentalData: {
    temperature: number; // °C
    precipitation: number; // mm
    snowCover: number; // %
    lastUpdated: Date;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'MONITORING';
  createdAt: Date;
  updatedAt: Date;
}

const glacierSchema = new Schema<IGlacier>({
  name: {
    type: String,
    required: [true, 'Glacier name is required'],
    trim: true,
    unique: true
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
    elevation: {
      type: Number,
      required: [true, 'Elevation is required'],
      min: [0, 'Elevation must be positive']
    }
  },
  measurements: {
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area must be positive']
    },
    length: {
      type: Number,
      required: [true, 'Length is required'],
      min: [0, 'Length must be positive']
    },
    thickness: {
      type: Number,
      required: [true, 'Thickness is required'],
      min: [0, 'Thickness must be positive']
    },
    volume: {
      type: Number,
      required: [true, 'Volume is required'],
      min: [0, 'Volume must be positive']
    },
    lastMeasured: {
      type: Date,
      default: Date.now
    }
  },
  riskAssessment: {
    glofRisk: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
    },
    retreatRate: {
      type: Number,
      default: 0,
      min: [0, 'Retreat rate must be non-negative']
    },
    lakeFormation: {
      type: Boolean,
      default: false
    },
    lastAssessment: {
      type: Date,
      default: Date.now
    }
  },
  environmentalData: {
    temperature: {
      type: Number,
      required: [true, 'Temperature is required']
    },
    precipitation: {
      type: Number,
      required: [true, 'Precipitation is required'],
      min: [0, 'Precipitation must be non-negative']
    },
    snowCover: {
      type: Number,
      required: [true, 'Snow cover is required'],
      min: [0, 'Snow cover must be between 0 and 100'],
      max: [100, 'Snow cover must be between 0 and 100']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'MONITORING'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
glacierSchema.index({ 'location.coordinates': '2dsphere' });

// Index for risk assessment queries
glacierSchema.index({ 'riskAssessment.glofRisk': 1 });

// Index for region-based queries
glacierSchema.index({ 'location.region': 1 });

// Virtual for risk level
glacierSchema.virtual('riskLevel').get(function() {
  const risk = this.riskAssessment.glofRisk;
  const retreat = this.riskAssessment.retreatRate;
  
  if (risk === 'CRITICAL' || retreat > 50) return 'EXTREME';
  if (risk === 'HIGH' || retreat > 30) return 'HIGH';
  if (risk === 'MEDIUM' || retreat > 15) return 'MEDIUM';
  return 'LOW';
});

export default mongoose.model<IGlacier>('Glacier', glacierSchema);
