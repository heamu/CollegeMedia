export default function ensureAuthenticated(req, res, next) {
  // Safely log req.session and req.user for debugging
  //console.log('req.session in ensure :', req.session);
  //console.log('req.user in ensure :', req.user);
  // console.log("In ensure authenticated isAuthenticated : ",req.isAuthenticated());
  // console.log("user in ensure Authenticated : ",req.user);
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Not authenticated' });
}
