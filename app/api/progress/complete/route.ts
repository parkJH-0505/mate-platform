import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import {
  XP_REWARDS,
  calculateStreak,
  calculateLevel,
  getWeekStart,
  BADGE_DEFINITIONS
} from '@/lib/gamification'

interface GamificationReward {
  xpEarned: number
  xpBreakdown: { reason: string; amount: number }[]
  streakUpdated: boolean
  newStreak: number
  levelUp: boolean
  newLevel?: { level: number; name: string; icon: string }
  badgeEarned?: { id: string; name: string; icon: string }
  goalProgress?: { completed: number; target: number; isAchieved: boolean }
}

async function processGamification(
  supabase: any,
  userId: string | null,
  sessionId: string
): Promise<GamificationReward> {
  const rewards: GamificationReward = {
    xpEarned: 0,
    xpBreakdown: [],
    streakUpdated: false,
    newStreak: 0,
    levelUp: false
  }

  const today = new Date().toISOString().split('T')[0]
  const identifier = userId ? { user_id: userId } : { session_id: sessionId }

  // 1. 콘텐츠 완료 XP
  rewards.xpEarned += XP_REWARDS.CONTENT_COMPLETE
  rewards.xpBreakdown.push({ reason: '콘텐츠 완료', amount: XP_REWARDS.CONTENT_COMPLETE })

  // 2. 오늘 첫 학습인지 확인 (daily_activities 테이블)
  const { data: todayActivity } = await supabase
    .from('daily_activities')
    .select('id, contents_completed')
    .match(identifier)
    .eq('activity_date', today)
    .single()

  let isFirstLearningToday = !todayActivity

  if (isFirstLearningToday) {
    // 오늘 첫 학습 보너스
    rewards.xpEarned += XP_REWARDS.DAILY_FIRST_LEARNING
    rewards.xpBreakdown.push({ reason: '오늘 첫 학습', amount: XP_REWARDS.DAILY_FIRST_LEARNING })

    // daily_activities 생성
    await supabase
      .from('daily_activities')
      .insert({
        ...identifier,
        activity_date: today,
        contents_completed: 1,
        xp_earned: rewards.xpEarned
      })
  } else {
    // daily_activities 업데이트
    await supabase
      .from('daily_activities')
      .update({
        contents_completed: (todayActivity.contents_completed || 0) + 1,
        xp_earned: (todayActivity.xp_earned || 0) + rewards.xpEarned
      })
      .eq('id', todayActivity.id)
  }

  // 3. 스트릭 업데이트
  const { data: streakData } = await supabase
    .from('learning_streaks')
    .select('*')
    .match(identifier)
    .single()

  if (streakData) {
    const streakResult = calculateStreak(streakData.last_activity_date, streakData.current_streak)

    if (streakResult.shouldUpdate) {
      const newStreak = streakResult.newStreak
      const longestStreak = Math.max(newStreak, streakData.longest_streak)

      await supabase
        .from('learning_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today
        })
        .match(identifier)

      rewards.streakUpdated = true
      rewards.newStreak = newStreak

      // 스트릭 보너스 XP
      if (newStreak === 7 && streakData.current_streak < 7) {
        rewards.xpEarned += XP_REWARDS.STREAK_7_DAYS
        rewards.xpBreakdown.push({ reason: '7일 연속 학습!', amount: XP_REWARDS.STREAK_7_DAYS })
      } else if (newStreak === 30 && streakData.current_streak < 30) {
        rewards.xpEarned += XP_REWARDS.STREAK_30_DAYS
        rewards.xpBreakdown.push({ reason: '30일 연속 학습!', amount: XP_REWARDS.STREAK_30_DAYS })
      }
    }
  } else {
    // 첫 스트릭 생성
    await supabase
      .from('learning_streaks')
      .insert({
        ...identifier,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today
      })

    rewards.streakUpdated = true
    rewards.newStreak = 1
  }

  // 4. 레벨 업데이트
  const { data: levelData } = await supabase
    .from('user_levels')
    .select('*')
    .match(identifier)
    .single()

  const previousLevel = levelData?.current_level || 1
  const previousXP = levelData?.total_xp || 0
  const newTotalXP = previousXP + rewards.xpEarned

  if (levelData) {
    await supabase
      .from('user_levels')
      .update({ total_xp: newTotalXP })
      .match(identifier)
  } else {
    await supabase
      .from('user_levels')
      .insert({
        ...identifier,
        total_xp: newTotalXP,
        current_level: 1
      })
  }

  const newLevelInfo = calculateLevel(newTotalXP)

  if (newLevelInfo.level > previousLevel) {
    rewards.levelUp = true
    rewards.newLevel = {
      level: newLevelInfo.level,
      name: newLevelInfo.name,
      icon: newLevelInfo.icon
    }

    // 레벨업 XP 보너스
    rewards.xpEarned += XP_REWARDS.LEVEL_UP
    rewards.xpBreakdown.push({ reason: `레벨업! Lv.${newLevelInfo.level}`, amount: XP_REWARDS.LEVEL_UP })

    await supabase
      .from('user_levels')
      .update({
        current_level: newLevelInfo.level,
        total_xp: newTotalXP + XP_REWARDS.LEVEL_UP
      })
      .match(identifier)
  }

  // 5. 주간 목표 진행
  const weekStart = getWeekStart()

  const { data: goalData } = await supabase
    .from('weekly_goals')
    .select('*')
    .match(identifier)
    .eq('week_start', weekStart)
    .single()

  if (goalData) {
    const newCompleted = (goalData.completed_contents || 0) + 1
    const isNowAchieved = !goalData.is_achieved && newCompleted >= goalData.target_contents

    const updateData: any = { completed_contents: newCompleted }

    if (isNowAchieved) {
      updateData.is_achieved = true
      updateData.achieved_at = new Date().toISOString()

      // 주간 목표 달성 보너스
      rewards.xpEarned += XP_REWARDS.WEEKLY_GOAL_ACHIEVED
      rewards.xpBreakdown.push({ reason: '주간 목표 달성!', amount: XP_REWARDS.WEEKLY_GOAL_ACHIEVED })
    }

    await supabase
      .from('weekly_goals')
      .update(updateData)
      .eq('id', goalData.id)

    rewards.goalProgress = {
      completed: newCompleted,
      target: goalData.target_contents,
      isAchieved: goalData.is_achieved || isNowAchieved
    }
  }

  // 6. 배지 확인 (일부 간단한 배지만)
  const { data: existingBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .match(identifier)

  const earnedBadgeIds = new Set(existingBadges?.map((b: any) => b.badge_id) || [])

  // 첫 학습 배지
  if (!earnedBadgeIds.has('first_step')) {
    await supabase
      .from('user_badges')
      .insert({
        ...identifier,
        badge_id: 'first_step',
        earned_at: new Date().toISOString()
      })

    const badge = BADGE_DEFINITIONS.find(b => b.id === 'first_step')
    if (badge) {
      rewards.badgeEarned = { id: badge.id, name: badge.name, icon: badge.icon }
      rewards.xpEarned += 20
      rewards.xpBreakdown.push({ reason: `배지 획득: ${badge.name}`, amount: 20 })
    }
  }

  // 7일 연속 배지
  if (!earnedBadgeIds.has('week_warrior') && rewards.newStreak >= 7) {
    await supabase
      .from('user_badges')
      .insert({
        ...identifier,
        badge_id: 'week_warrior',
        earned_at: new Date().toISOString()
      })

    const badge = BADGE_DEFINITIONS.find(b => b.id === 'week_warrior')
    if (badge && !rewards.badgeEarned) {
      rewards.badgeEarned = { id: badge.id, name: badge.name, icon: badge.icon }
    }
  }

  return rewards
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contentId, curriculumId, sessionId } = body

    if (!contentId || !curriculumId || !sessionId) {
      return NextResponse.json(
        { error: 'contentId, curriculumId, and sessionId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 인증된 사용자 확인
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    // 이미 완료된 콘텐츠인지 확인
    const progressQuery = supabase
      .from('user_progress')
      .select('id, completed')
      .eq('content_id', contentId)

    if (userId) {
      progressQuery.eq('user_id', userId)
    } else {
      progressQuery.eq('session_id', sessionId)
    }

    const { data: existing } = await progressQuery.single()

    // 이미 완료된 콘텐츠라면 중복 XP 지급 안함
    if (existing?.completed) {
      return NextResponse.json({
        success: true,
        message: 'Content already completed',
        gamification: null
      })
    }

    // 진행 상태 업데이트
    if (existing) {
      await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      const insertData: any = {
        content_id: contentId,
        curriculum_id: curriculumId,
        completed: true,
        completed_at: new Date().toISOString()
      }

      if (userId) {
        insertData.user_id = userId
      } else {
        insertData.session_id = sessionId
      }

      await supabase
        .from('user_progress')
        .insert(insertData)
    }

    // 게이미피케이션 처리
    const gamificationRewards = await processGamification(supabase, userId, sessionId)

    return NextResponse.json({
      success: true,
      message: 'Content marked as completed',
      gamification: gamificationRewards
    })

  } catch (error) {
    console.error('Error completing content:', error)
    return NextResponse.json(
      { error: 'Failed to complete content' },
      { status: 500 }
    )
  }
}
