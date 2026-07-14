import { useState, useEffect } from 'react';
import { UserProfile, Badge, RenderItem } from '../types';
import { BADGES } from '../data/academyData';

const STORAGE_KEY = 'remotion_academy_profile_v1';

const INITIAL_PROFILE: UserProfile = {
  username: 'Apprenti Développeur',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  xp: 0,
  level: 1,
  streakCount: 1,
  streakLastDate: new Date().toISOString().split('T')[0],
  unlockedBadges: ['welcome'], // Starts with Welcome badge
  completedLessons: [],
  quizScores: {},
  exerciseSubmissions: {},
  certificates: []
};

export function getRankName(level: number): string {
  if (level >= 8) return 'Architecte Vidéo Certifié';
  if (level >= 6) return 'Motion Designer Expert';
  if (level >= 4) return 'Monteur React Confirmé';
  if (level >= 2) return 'Monteur Junior';
  return 'Apprenti Développeur';
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [renders, setRenders] = useState<RenderItem[]>([]);
  const [lastNotification, setLastNotification] = useState<{ title: string; desc: string; icon: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Dynamic streak validation
        const todayStr = new Date().toISOString().split('T')[0];
        let streak = parsed.streakCount || 0;
        let lastDate = parsed.streakLastDate;

        if (lastDate) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate !== todayStr) {
            if (lastDate === yesterdayStr) {
              // Streak maintained! (but not yet updated for today unless they do an action)
            } else {
              // Streak broken
              streak = 0;
            }
          }
        } else {
          streak = 1;
          lastDate = todayStr;
        }

        setProfile({
          ...parsed,
          streakCount: streak || 1,
          streakLastDate: lastDate || todayStr
        });
      } catch (e) {
        setProfile(INITIAL_PROFILE);
      }
    } else {
      setProfile(INITIAL_PROFILE);
    }
    
    // Initial fetch of rendering history
    fetchRenders();
  }, []);

  const fetchRenders = async () => {
    try {
      const res = await fetch('/api/renders');
      if (res.ok) {
        const data = await res.json();
        setRenders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfile = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const triggerNotification = (title: string, desc: string, icon: string) => {
    setLastNotification({ title, desc, icon });
    setTimeout(() => {
      setLastNotification(null);
    }, 4500);
  };

  // Add XP and check for level-ups
  const addXp = (amount: number) => {
    let newXp = profile.xp + amount;
    // Simple level formula: Level = floor(xp / 100) + 1
    let newLevel = Math.floor(newXp / 100) + 1;
    if (newLevel < 1) newLevel = 1;

    let levelUp = newLevel > profile.level;
    
    const updated = {
      ...profile,
      xp: newXp,
      level: newLevel,
    };

    if (levelUp) {
      triggerNotification('Niveau Supérieur ! 🎉', `Vous êtes passé au niveau ${newLevel} : "${getRankName(newLevel)}"`, 'Award');
    }

    saveProfile(updated);
  };

  // Mark lesson as complete
  const completeLesson = (lessonId: string, xpReward: number) => {
    if (profile.completedLessons.includes(lessonId)) return;

    const newCompleted = [...profile.completedLessons, lessonId];
    let newUnlockedBadges = [...profile.unlockedBadges];

    // Trigger streak check / update
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = profile.streakCount;
    if (profile.streakLastDate !== todayStr) {
      newStreak += 1;
    }

    // Unlock "first_lesson" badge
    if (!newUnlockedBadges.includes('first_lesson')) {
      newUnlockedBadges.push('first_lesson');
      triggerNotification('Badge Débloqué ! 🏆', 'Esprit Curieux : Première leçon validée !', 'BookOpen');
    }

    const updatedProfile = {
      ...profile,
      completedLessons: newCompleted,
      unlockedBadges: newUnlockedBadges,
      streakCount: newStreak,
      streakLastDate: todayStr
    };

    setProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    
    addXp(xpReward);
  };

  // Save quiz score
  const submitQuizScore = (quizId: string, scorePercentage: number) => {
    const currentBest = profile.quizScores[quizId] || 0;
    const updatedScores = {
      ...profile.quizScores,
      quizId: Math.max(currentBest, scorePercentage)
    };

    let newUnlockedBadges = [...profile.unlockedBadges];
    if (scorePercentage === 100 && !newUnlockedBadges.includes('quiz_master')) {
      newUnlockedBadges.push('quiz_master');
      triggerNotification('Badge Rare Débloqué ! 🌟', 'Sans Faute : Score parfait au quiz !', 'Award');
    }

    const updatedProfile = {
      ...profile,
      quizScores: updatedScores,
      unlockedBadges: newUnlockedBadges
    };

    setProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    
    // Reward XP for first-time pass or score improvement
    if (scorePercentage > currentBest) {
      const xpGain = scorePercentage === 100 ? 30 : 20;
      addXp(xpGain);
    }
  };

  // Save exercise submission
  const submitExercise = (exerciseId: string, code: string, passed: boolean, feedback: string = "") => {
    const previousStatus = profile.exerciseSubmissions[exerciseId]?.status;
    const updatedSubmissions = {
      ...profile.exerciseSubmissions,
      [exerciseId]: {
        code,
        status: passed ? 'passed' : 'draft',
        feedback
      }
    };

    let newUnlockedBadges = [...profile.unlockedBadges];

    // Check if we unlocked Module 5 exercise -> "data_wizard"
    if (exerciseId === 'ex5' && passed && !newUnlockedBadges.includes('data_wizard')) {
      newUnlockedBadges.push('data_wizard');
      triggerNotification('Badge Épique Débloqué ! 🔮', 'Magicien de la Data : Vidéo dynamique validée !', 'Database');
    }

    // Check if we unlocked Module 7 exercise (Projet Final) -> "certified"
    if (exerciseId === 'ex7' && passed && !newUnlockedBadges.includes('certified')) {
      newUnlockedBadges.push('certified');
      triggerNotification('Légende Vivante ! 🎓', 'Architecte Vidéo Certifié : Projet final validé par l\'IA !', 'Cpu');
      
      // Generate certificate
      const certId = `CERT-${Math.floor(100000 + Math.random() * 900000)}`;
      const certs = [...profile.certificates, {
        id: certId,
        academyId: 'remotion',
        code: certId,
        date: new Date().toISOString().split('T')[0]
      }];
      
      const updatedProfile = {
        ...profile,
        exerciseSubmissions: updatedSubmissions,
        unlockedBadges: newUnlockedBadges,
        certificates: certs
      };
      
      setProfile(updatedProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      addXp(100); // Massive XP for finishing!
      return;
    }

    const updatedProfile = {
      ...profile,
      exerciseSubmissions: updatedSubmissions,
      unlockedBadges: newUnlockedBadges
    };

    setProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

    if (passed && previousStatus !== 'passed') {
      addXp(30); // 30 XP for passing an exercise
    }
  };

  // Record a real/simulated render call
  const recordRender = (renderItem: RenderItem) => {
    let newUnlockedBadges = [...profile.unlockedBadges];
    if (!newUnlockedBadges.includes('first_render')) {
      newUnlockedBadges.push('first_render');
      triggerNotification('Badge Débloqué ! 🎬', 'Monteur Virtuel : Premier rendu MP4 lancé !', 'Video');
    }

    const updatedProfile = {
      ...profile,
      unlockedBadges: newUnlockedBadges
    };

    saveProfile(updatedProfile);
    fetchRenders();
  };

  const updateUsername = (newUsername: string) => {
    saveProfile({
      ...profile,
      username: newUsername
    });
  };

  const updateAvatar = (avatarUrl: string) => {
    saveProfile({
      ...profile,
      avatarUrl
    });
  };

  const resetProgress = () => {
    saveProfile(INITIAL_PROFILE);
    triggerNotification('Réinitialisation ! 🔄', 'Votre progression de l\'académie a été effacée.', 'RefreshCw');
  };

  return {
    profile,
    renders,
    lastNotification,
    completeLesson,
    submitQuizScore,
    submitExercise,
    recordRender,
    updateUsername,
    updateAvatar,
    resetProgress,
    fetchRenders
  };
}
