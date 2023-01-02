import express from 'express';
import { getGenres } from '../tmdb/tmdb-api';
import Genre from './genreModel';
import { genres } from './genresData';
import asyncHandler from 'express-async-handler';

const router = express.Router(); 

router.get('/local', asyncHandler(async (req, res) => {
    const genres = await Genre.find();
    res.status(200).json(genres);
}));

router.get('/tmdb', asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
}));

export default router;