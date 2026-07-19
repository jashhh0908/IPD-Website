import Camera from '../models/Camera.js';
import Accident from '../models/Accident.js';

export const createAccident = async (req, res) => {
    try {
        const { cameraId, severity, timestamp, mlConfidence, poseDetected, aiOutputs } = req.body;

        if (!cameraId) {
            return res.status(400).json({ error: 'Missing required field: cameraId' });
        }
        if (!severity) {
            return res.status(400).json({ error: 'Missing required field: severity' });
        }
        if (!timestamp) {
            return res.status(400).json({ error: 'Missing required field: timestamp' });
        }

        const camera = await Camera.findOne({ cameraId });

        if (!camera) {
            return res.status(404).json({error: `Camera lookup failed. Camera with ID '${cameraId}' is not registered in the Sentry network.`});
        }

        const { lat, lng, city, locationName } = camera;

        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: "Invalid timestamp" });
        }

        const newAccident = new Accident({
            cameraId,
            severity,
            date,
            lat,
            lng,
            city,
            location: locationName,
            mlConfidence: mlConfidence !== undefined ? mlConfidence : null,
            poseDetected: poseDetected !== undefined ? poseDetected : false,
            aiOutputs: aiOutputs || {}
        });

        const savedAccident = await newAccident.save();

        return res.status(201).json({
            message: "Accident saved!",
            accident: savedAccident
        });
    } catch (error) {
        console.error(`Error in createAccident controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
