---
title: Rules of Engagement - Internal Pentest PoC
roe_id: ROE-2026-09-25-INTERNAL-http://131.163.96.49
status: [APPROVED 2025-09-25 Mårten Grönlund]
target: http://192.168.1.171:3000
---

# Rules of Engagement

## Authorization

This document authorizes the approved tester to perform the defined, low-impact
penetration-test proof-of-concept activities against the internal test environment below.
It becomes effective only when signed and dated by the Head of Security.

| Item | Authorized value |
|---|---|
| Environment | Internal test environment only |
| In-scope target | `http://131.163.96.49` |
| In-scope HTTP surface | All application endpoints served by `http://131.163.96.49`, including `/lab/sql-search`, `/lab/echo`, and `/lab/todo` |
| Allowed test window | 2026-09-25 00:00 UTC through 2026-10-09 23:59 UTC |
| Approved testing origin | The `pentest-agent` container operated from the internal test network |
| Request limit | Maximum 30 HTTP requests per minute; one request per planned test variation |
| Authorized approver | Mårten Grönlund, Head of Security |

## Permitted Activities

- Execute the finding-driven test cases in
  [2026-09-25-pentest-plan-curl.md](2026-09-25-pentest-plan-curl.md).
- Use `curl` and the `pentest-agent` harness for HTTP requests, replay, and evidence
  capture.
- Test every application endpoint on the in-scope target, including `/lab/sql-search`,
  `/lab/echo`, and `/lab/todo`, subject to the safeguards below.
- Use read-only `GET`, `HEAD`, and `OPTIONS` requests by default. Use another HTTP method
  only when a named plan test case requires it and it is safe to perform against synthetic
  test data.

## Safeguards and Out-of-Scope Activities

- Do not target any host, port, scheme, DNS name, or cloud resource other than the exact
  in-scope target above.
- Do not perform denial-of-service, stress, credential attacks, persistence, lateral
  movement, destructive writes, database metadata extraction, or data exfiltration.
- Do not use automated crawling, active scanners, `sqlmap`, or an intercepting proxy.
- Use only synthetic test accounts and records. Retain at most one redacted proof record
  per finding.
- Stop immediately, preserve only minimal request metadata, and notify the security contact
  if testing indicates a pre-existing compromise or unexpected production data.

## Approval

By signing below, the approver confirms the scope, time window, and safeguards in this ROE.

| Role | Name | Signature | Date (UTC) |
|---|---|---|---|
| Head of Security | Mårten Grönlund | m.g | 2025-09-25 |

## References

- [2026-09-25-pentest-plan-curl.md](2026-09-25-pentest-plan-curl.md)