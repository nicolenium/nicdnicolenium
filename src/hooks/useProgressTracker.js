
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useProgressTracker = () => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadProgress();
    }
  }, [currentUser]);

  const loadProgress = async () => {
    try {
      const records = await pb.collection('learning_progress').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      if (records.length > 0) {
        setProgress(records[0]);
      } else {
        const newRecord = await pb.collection('learning_progress').create({
          userId: currentUser.id,
          lessonsCompleted: [],
          puzzlesSolved: [],
          totalAccuracy: 0,
          skillLevel: 'beginner',
          estimatedRating: 1000
        }, { $autoCancel: false });
        setProgress(newRecord);
      }
    } catch (e) {
      console.error('Failed to load progress', e);
    }
  };

  const completeLesson = async (lessonId) => {
    if (!progress) return;
    const completed = progress.lessonsCompleted || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      await pb.collection('learning_progress').update(progress.id, {
        lessonsCompleted: completed,
        estimatedRating: progress.estimatedRating + 10
      }, { $autoCancel: false });
      loadProgress();
    }
  };

  return { progress, completeLesson };
};
