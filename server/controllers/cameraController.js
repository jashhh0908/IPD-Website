import Camera from '../models/Camera.js';

export const createCamera = async (req, res) => {
    try {
        const { cameraId, locationName, city, lat, lng, status } = req.body;

        if (!cameraId) {
            return res.status(400).json({ error: 'Missing required field: cameraId' });
        }
        if (!locationName) {
            return res.status(400).json({ error: 'Missing required field: locationName' });
        }
        if (!city) {
            return res.status(400).json({ error: 'Missing required field: city' });
        }
        if (lat === undefined || lat === null) {
            return res.status(400).json({ error: 'Missing required field: lat' });
        }
        if (lng === undefined || lng === null) {
            return res.status(400).json({ error: 'Missing required field: lng' });
        }

        const existingCamera = await Camera.findOne({ cameraId });
        if (existingCamera) {
            return res.status(400).json({ 
                error: `Registration failed. A camera with ID '${cameraId}' is already registered.` 
            });
        }

        const newCamera = new Camera({
            cameraId,
            locationName,
            city,
            lat: Number(lat),
            lng: Number(lng),
            status: status || 'online' // Complies with schema schema enum: ['online', 'offline']
        });

        const savedCamera = await newCamera.save();

        return res.status(201).json({
            message: 'Camera registered successfully!',
            camera: savedCamera
        });

    } catch (error) {
        console.error(`Error in createCamera controller: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
