import { Router } from 'express'

const router = Router();
export default router;

router.get('/timeline-data', (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "user_not_authenticated" });
  }
  res.json({
    user: {
      displayName: req.user.displayName,
    },
    accounts: req.user.twitterAccounts.map(acc => ({})),
  });
});

router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: "user_not_authenticated" });
  }
  res.json({
    user: {
      displayName: req.user.displayName,
    },
    accounts: req.user.twitterAccounts.map(acc => ({})),
  });
});

router.get('/debug/user', (req, res) => (res.json({ user: req.user || '-' })));
