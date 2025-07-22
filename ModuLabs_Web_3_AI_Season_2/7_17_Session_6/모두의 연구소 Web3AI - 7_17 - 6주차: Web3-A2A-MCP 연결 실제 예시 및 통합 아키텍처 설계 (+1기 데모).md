<세션 요약>
순서	발표자	핵심 내용
프레젠테이션	사용자	Function Calling, Model Context Protocol(MCP), Agent to Agent(A2A) 프로토콜 설명. 각 구조의 정의와 차이점, 도구 호출 방식(Function vs MCP/A2A), A2A 흐름 및 흐름 단절 문제 소개.
강의 및 예시	사용자	Query → LLM → Function Calling → MCP/A2A의 전체 흐름 설명. AgentExecutor와 Runner를 통한 Loop, create_task, artifact 반환 과정 설명. A2A와 MCP는 동적 호출 구조. DAG 기반 워크플로우로 안정성 확보 가능. 예시로 Dr. Jenny, Google A2A 컨시어지 언급.

<프레젠테이션 핵심>
Function Calling / MCP / A2A 개념 및 호출 방식 비교

항목	핵심 내용
Function Calling	LLM이 외부 도구를 정적으로 호출하는 메커니즘. 고정된 기능(예: 계산기, DB 조회 등)을 직접 실행.
MCP	LLM이 원격 툴(Remote Tools) 과 상호작용할 수 있도록 돕는 동적 호출 프로토콜. MCP 리스트와 설명을 Wrapping하여 LLM이 선택 가능.
A2A	LLM이 다른 에이전트(Remote Agents) 와 협업하는 동적 호출 프로토콜. Task를 자동 생성하고, Agent 간 루프 기반 실행 구조.

<A2A 흐름 요약>
단계	주요 내용
1. Query 입력	사용자 쿼리 발생
2. AgentExecutor	실행 요청 수신 및 실행
3. Runner	다른 Agent들과 루프 수행
4. LLM 판단	Function Calling(create_task) 수행
5. Artifact 생성	실행 결과 반환
6. 결과 반환	사용자에게 응답 전달

⚠️ 문제점: 응답 지연, 돌발 상황 시 전체 흐름이 멈출 수 있음

✅ 해결책: DAG 기반 Workflow를 도입해 안정적인 작업 흐름 설계 가능

<기타 요약 및 참고자료>
항목	내용
동적 vs 정적 호출	Function Calling은 정적 호출, MCP와 A2A는 동적 호출
→ 툴 개수가 적을 경우 정적 호출이 더 단순하고 효율적
예시	🔹 Google A2A Purchasing Concierge
🔹 Dr. Jenny (멀티 에이전트 협업)
🔹 O’Reilly A2A Protocol
정리된 메시지	Function Calling : for Tools
MCP : for Remote Tools
A2A : for Remote Agents