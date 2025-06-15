// Middleware to ensure the user is either an admin or a content moderator
export default function ensureIsAdminOrModerator(req, res, next) {
  if (req.user && (req.user.isAdmin)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin only.' });
}
