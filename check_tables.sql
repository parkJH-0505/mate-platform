-- Supabase Dashboard의 SQL Editor에서 이 쿼리를 실행하여
-- 테이블이 존재하는지 확인하세요

-- 1. actions 테이블 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'actions'
) AS actions_exists;

-- 2. daily_plans 테이블 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'daily_plans'
) AS daily_plans_exists;

-- 3. growth_logs 테이블 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'growth_logs'
) AS growth_logs_exists;

-- 4. user_content_likes 테이블 확인 (010 마이그레이션)
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_content_likes'
) AS user_content_likes_exists;

-- 5. curriculum_contents의 level 컬럼 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'curriculum_contents' 
AND column_name IN ('level', 'category', 'view_count', 'like_count', 'is_active');
