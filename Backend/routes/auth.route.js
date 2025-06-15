// routes/auth.route.js (ESM style)
import express from "express";
import passport from "passport";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import imagekit from "../utils/imagekit.js";
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: `${process.env.FRONTEND_URL}`,
  failureRedirect: `${process.env.FRONTEND_URL}/authenticate`,
}));

router.get('/me',ensureAuthenticated, (req, res) => {
   // console.log("from /me",req.session)
    res.json(req.user);
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid'); // optional: clear session cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


//this is for my imagekit.io for getting authentication details 
router.get("/imagekitio",ensureAuthenticated,(req, res) => {
   
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get ImageKit auth params" });
  }
});

router.post('/delete-img',ensureAuthenticated,async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) return res.status(400).json({ error: "fileId is required" });

  try {
    await imagekit.deleteFile(fileId);
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Image delete failed:", err?.message);
    // Provide more error info for debugging
    res.status(500).json({ error: "Failed to delete image", details: err?.message });
  }
});


export default router;
