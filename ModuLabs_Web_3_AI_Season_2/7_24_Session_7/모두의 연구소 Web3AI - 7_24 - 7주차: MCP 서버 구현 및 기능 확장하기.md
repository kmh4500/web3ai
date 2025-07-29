# MCP 서버 구현 및 기능 확장 세션 요약

## 🧠 MCP란?

- **MCP (Model Context Protocol)**: 앤트로픽(Anthropic)이 2024년 말 발표한 개방형 프로토콜
- **의의**:
  - LLM의 한계를 극복하기 위한 **외부 컨텍스트 연결 구조**
  - JSON-RPC 2.0 기반 **클라이언트-서버 통신 표준**
  - **RAG를 넘어서** 도구/시스템/데이터를 직접 호출

---

## 📐 MCP 아키텍처

### 주요 구성 요소

| 역할 | 설명 |
|------|------|
| **Host App** | Claude Desktop, Cursor IDE, Custom AI App 등 |
| **MCP Client** | 호스트 앱에 내장된 MCP 메시지 중계기 |
| **MCP Server** | 외부 리소스/도구와 연결, AI에 기능 제공 |

### 통신 방식
- JSON-RPC 2.0
- HTTP / SSE(Server-Sent Events)
- 1:1 연결 원칙 (단, LangChain 등은 MultiServerMCPClient 지원)

---

## ⚙️ 구현 사례

- **사용 SDK**: [FastMCP (Python)](https://github.com/modelcontextprotocol/fastmcp)
- **예시 워크플로우**: “오늘 서울 날씨 어때?” 질문 → MCP 날씨 서버 통해 실시간 응답 → AI가 통합 응답 생성
- **응답 생성 흐름**:
  1. 요청 → MCP 클라이언트 → 서버
  2. 외부 API 연동 후 응답
  3. AI 맥락 통합 → 사용자 응답 생성

---

## 🏗️ 시스템 설계 & 기능 확장

### MyResume (Job Tracker) 사례
- Claude를 통한 채용 추적 시스템
- MCP 서버 기반 상태 관리, 외부 데이터 연동 등 구현

### 기능 확장 항목
- **상태 저장 도구**: 유저, 세션, 에이전트 컨텍스트 유지 (DB, Redis 등)
- **비동기 작업 처리**: 외부 API 호출, 대기 작업 큐 처리 (Celery 등)
- **데이터 형식화**: 외부 데이터 → LLM 친화 포맷 가공

---

## 🔐 MCP 서버 보안

- **인증 & 권한 관리**: OAuth, JWT, API Key 기반 접근 제어
- **입력 값 검증**: XSS, SQLi 등 방지
- **TLS/SSL 전송 보안**
- **민감 정보 분리 저장**: API Key, 토큰, 사용자 정보 등

---

## 🧩 서버 확장성과 안정성

| 항목 | 설명 |
|------|------|
| **Stateless 설계** | 요청 간 상태 미저장, 외부 저장소 활용 |
| **로드 밸런싱** | 수평 확장 용이 |
| **비동기 큐** | Celery, Kafka 등 |
| **캐싱** | Redis 기반 빠른 응답 처리 |

---

## 🔍 MCP 서버 개발 후기

- 기존 Claude 코드 및 입력 명세가 있었다면 구현 난이도 급감
- 다양한 참고 구현체 제공:
  - GitHub, Slack, PostgreSQL, Puppeteer, Stripe 등
- 개인화된 사내 시스템 연동 가능성 ↑

---

## 🔗 주요 링크

- [MCP 공식 사이트](https://modelcontextprotocol.io)
- [공식 GitHub 저장소](https://github.com/modelcontextprotocol)
- [MCP Client 목록](https://modelcontextprotocol.io/clients)

---

> **요약**: MCP는 AI와 외부 시스템의 통합을 위한 차세대 통신 표준입니다. MCP 서버를 통해 다양한 도구와 데이터를 실시간 연결함으로써, AI의 활용성과 실시간성, 협업성을 획기적으로 확장할 수 있습니다.
