import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    type: { type: String, trim: true },
    make: { type: String, trim: true },
    plate: { type: String, trim: true },
    color: { type: String, trim: true },
    damage: { type: String, trim: true }
});

const accidentSchema = new mongoose.Schema({
    caseId: {
        type: String,
        trim: true
    },
    cameraId: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    severity: {
        type: String,
        required: true,
        enum: ['Critical', 'High', 'Moderate', 'Low']
    },
    status: {
        type: String,
        enum: ['Open', 'Under Investigation', 'Closed'],
        default: 'Open'
    },
    description: {
        type: String,
        trim: true
    },
    vehicles: [vehicleSchema],
    casualties: {
        fatal: { type: Number, default: 0 },
        injured: { type: Number, default: 0 },
        unharmed: { type: Number, default: 0 }
    },
    weather: { type: String, trim: true },
    roadCondition: { type: String, trim: true },
    lightCondition: { type: String, trim: true },
    responseTime: { type: String, trim: true },
    detectedBy: {
        type: String,
        default: 'Sentry Camera (YOLOv8)'
    },
    mlConfidence: {
        type: Number,
        default: null
    },
    poseDetected: {
        type: Boolean,
        default: false
    },
    aiOutputs: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    officerAssigned: {
        type: String,
        default: null
    },
    victimId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Accident = mongoose.model('Accident', accidentSchema);

export default Accident;
