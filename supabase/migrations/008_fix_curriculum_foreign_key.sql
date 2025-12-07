-- curriculums 테이블의 user_id foreign key 제약 조건 수정
-- 문제: users 테이블과 auth.users가 분리되어 있어서 foreign key 에러 발생

-- 1. 기존 foreign key 제약 조건 삭제
ALTER TABLE curriculums DROP CONSTRAINT IF EXISTS curriculums_user_id_fkey;

-- 2. user_id를 auth.users를 참조하도록 변경 (nullable)
-- auth.users는 Supabase 내장 테이블로 회원가입 시 자동 생성됨
ALTER TABLE curriculums
  ADD CONSTRAINT curriculums_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. user_id가 null이어도 되도록 명시적으로 설정 (이미 nullable이지만 확인)
-- ALTER TABLE curriculums ALTER COLUMN user_id DROP NOT NULL;

-- 4. 회원가입 시 public.users 테이블에 자동으로 레코드 생성하는 트리거 추가
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있으면 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 새 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
