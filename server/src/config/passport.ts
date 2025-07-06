import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found for Google profile'), undefined);
    }

    let user = await pool.query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', ['google', profile.id]);

    if (user.rows.length === 0) {
      // User not found, create a new one
      user = await pool.query(
        'INSERT INTO users (id, email, displayName, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
        [profile.id, email, profile.displayName, 'google', profile.id]
      );
    }
    done(null, user.rows[0]);
  } catch (err: any) {
    done(err, undefined);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: '/api/auth/github/callback',
  scope: ['user:email'],
}, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
  try {
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      return done(new Error('No email found for GitHub profile'), undefined);
    }

    let user = await pool.query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', ['github', profile.id]);

    if (user.rows.length === 0) {
      // User not found, create a new one
      user = await pool.query(
        'INSERT INTO users (id, email, displayName, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
        [profile.id, email, profile.displayName, 'github', profile.id]
      );
    }
    done(null, user.rows[0]);
  } catch (err: any) {
    done(err, undefined);
  }
}));

export default passport;
