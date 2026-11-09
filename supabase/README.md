# 현재 연결 상태

기존 Supabase 프로젝트에 `public.todo` 테이블과 사용자별 SELECT/INSERT/UPDATE/DELETE RLS 정책이 설정되어 있는 것을 확인했다. 현재 프로젝트에서는 SQL을 다시 실행할 필요가 없다.
앱은 기존 `id`, `user_id`, `nickname`, `title`, `is_completed`, `created_at` 컬럼을 사용한다.
아래 SQL은 새 프로젝트에 같은 구조를 준비할 때만 사용한다.

# 투두리스트 DB 설정

1. `.env.local`의 URL에 해당하는 Supabase 프로젝트를 연다.
2. SQL Editor에서 `migrations/202611090001_create_todos.sql` 전체를 한 번 실행한다.
   기존 `todo` 테이블이 있으면 먼저 스키마와 정책을 확인한다. 이 스크립트는 기존 테이블을 덮어쓰지 않는다.
3. React 개발 서버에서 로그인하고 할 일을 추가한다.
4. 새로고침 후 데이터 유지, 완료 체크·해제, 삭제를 확인한다.
5. 별도 브라우저에서 B 계정으로 로그인해 A의 할 일이 보이지 않는지 확인한다.
   B의 인증 토큰으로 A의 할 일 ID를 조회·수정·삭제해도 데이터가 반환되거나 변경되지 않아야 한다.
   B가 A의 user_id로 추가하거나 자기 할 일의 user_id를 A로 바꾸는 요청도 거부되어야 한다.

클라이언트의 user_id 필터는 편의를 위한 것이며 실제 접근 제어는 DB의 RLS가 수행한다.
브라우저에는 공개용 키만 사용하고 service_role 또는 secret 키를 넣지 않는다.
로그인 후 회원별 목록 조회·추가·완료 변경·삭제가 Supabase에 저장된다.
다른 탭에서 변경한 내용은 새로고침 버튼으로 다시 불러온다.
