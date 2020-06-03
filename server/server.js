const express = require('express');
const cors = require('cors');
const { userRoutes, authRoutes, avatarRoutes } = require('./routes/index');
const app = express();

import { hostname, port } from './config';
import './db';

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/avatar', avatarRoutes);

app.listen(port, hostname, () =>
    console.log(`Server running at http://${hostname}:${port}/`)
);
