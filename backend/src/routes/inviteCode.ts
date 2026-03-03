import express from 'express';
import { getAllInviteCodes, generateInviteCode, deleteInviteCode } from '../services/inviteCodeService.js';
import InviteCode from '../models/InviteCode.js';

const router = express.Router();

// GET /api/invite-codes
router.get('/', async (req, res) => {
  try {
    const codes = await getAllInviteCodes();
    res.json({ codes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch invite codes' });
  }
});

// POST /api/invite-codes/generate
router.post('/generate', async (req, res) => {
  try {
    const { assignedTo = "", usesLeft = 1 } = req.body || {};
    const code = await generateInviteCode(assignedTo, usesLeft);
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate invite code' });
  }
});

// DELETE /api/invite-codes/clear-all
router.delete('/clear-all', async (req, res) => {
  try {
    await InviteCode.deleteMany({});
    res.json({ message: 'All invite codes cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear all invite codes' });
  }
});

// DELETE /api/invite-codes/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteInviteCode(req.params.id);
    res.json({ message: 'Invite code deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete invite code' });
  }
});

// Update /api/invite-codes/:id
router.patch('/:id', async (req, res) => {
  try {
    const { assignedTo, usesLeft } = req.body;
    const updated = await InviteCode.findByIdAndUpdate(
      req.params.id,
      { assignedTo, usesLeft },
      { new: true }
    );
    res.json({ code: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update invite code' });
  }
});

export default router;