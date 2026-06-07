import { useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export const useGameInvitation = () => {
  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 14).toUpperCase();
  };

  const createInvitation = async (gameType, inviterName) => {
    if (!pb.authStore.isValid) {
      toast.error('You must be logged in to create an invitation.');
      return null;
    }

    try {
      const code = generateInvitationCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Valid for 24 hours

      const data = {
        game_type: gameType,
        inviter_id: pb.authStore.model.id,
        inviter_name: inviterName || pb.authStore.model.username || 'Player',
        invitation_code: code,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      };

      const record = await pb.collection('game_invitations').create(data, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast.error('Failed to create game invitation.');
      return null;
    }
  };

  const fetchInvitation = async (code) => {
    try {
      const record = await pb.collection('game_invitations').getFirstListItem(`invitation_code="${code}"`, {
        $autoCancel: false
      });
      return record;
    } catch (error) {
      console.error('Error fetching invitation:', error);
      return null;
    }
  };

  const acceptInvitation = async (id, userId) => {
    try {
      const record = await pb.collection('game_invitations').update(id, {
        status: 'accepted',
        accepted_by_id: userId,
      }, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation.');
      return null;
    }
  };

  const validateExpiration = (expiresAt) => {
    if (!expiresAt) return true;
    return new Date(expiresAt) > new Date();
  };

  return {
    generateInvitationCode,
    createInvitation,
    fetchInvitation,
    acceptInvitation,
    validateExpiration
  };
};