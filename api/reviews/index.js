import express from 'express';
import asyncHandler from 'express-async-handler';
import { movieReviews } from '../movies/moviesData';
import uniqid from 'uniqid';

const router = express.Router(); 

// Get movie reviews
router.get('/:id/reviews', (req, res) => {
    const id = parseInt(req.params.id);
    if (movieReviews.id == id) {
        res.status(200).json(movieReviews);
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
});

//Post a movie review
router.post('/movie/:id/reviews/:username', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const userName = req.params.username;
    if (movieReviews.id == id) {
        if (req.body.content) {
            req.body.author = userName;
            req.body.created_at = new Date();
            req.body.updated_at = new Date();
            req.body.id = uniqid();
            movieReviews.results.push(req.body); //push the new review onto the list
            res.status(201).json(req.body);
        }
        else {
            res.status(403).json({ message: 'Invalid content.', status_code: 403 });
        }
    } else {
        res.status(404).json({
            message: 'The resource you requested could not be found.',
            status_code: 404
        });
    }
}));
export default router;