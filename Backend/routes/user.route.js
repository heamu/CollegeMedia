import express from "express"
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import User from "../models/user.model.js"
import ModerationQueue from '../models/moderationQueue.model.js';
import Question from '../models/question.model.js';
import 
{ updateTags , updateProfile,askQuestion,editAnonymousName,getPublicProfile,searchUser,updateAnonymousName} 
from "../controllers/user.controller.js";
const router = express.Router()


router.patch('/update-tags', ensureAuthenticated,updateTags );


router.patch('/update-profile',ensureAuthenticated ,updateProfile);


router.post('/ask-question', ensureAuthenticated, askQuestion);


router.get('/:userId/profile', ensureAuthenticated, getPublicProfile);


router.get('/search', ensureAuthenticated, searchUser);


router.patch('/update-anonymous-name', ensureAuthenticated, updateAnonymousName);


router.patch('/editAnonymousName', ensureAuthenticated,editAnonymousName );


export default router;





