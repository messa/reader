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
    accounts: req.user.twitterAccounts.map(acc => ({
      twitterId: acc.twitterId,
      username: acc.username,
      displayName: acc.displayName,
    })),
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
    accounts: req.user.twitterAccounts.map(acc => ({
      twitterId: acc.twitterId,
      username: acc.username,
      displayName: acc.displayName,
    })),
  });
});
