import { Router } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';
import { IUserProfile } from '../config/passport';

const router = Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const user = req.user as IUserProfile;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.redirect(`/?token=${token}`);
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/', session: false }),
  (req, res) => {
    const user = req.user as IUserProfile;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.redirect(`/?token=${token}`);
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return res.status(500).send({ message: 'Logout failed' }); }
    req.session.destroy((err) => {
      if (err) { return res.status(500).send({ message: 'Session destruction failed' }); }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.send({ message: 'Logged out successfully' });
    });
  });
});

export default router;