import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
    cameraId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    locationName: {
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
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online'
    }
}, {
    timestamps: true
});

const Camera = mongoose.model('Camera', cameraSchema);

export default Camera;
