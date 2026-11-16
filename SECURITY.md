# ElAi security policy

## Scope
ElAi website source, Vercel APIs and connected services under the owner's control.

## Reporting
Report suspected vulnerabilities privately to the repository owner. Do not open public issues containing secrets or exploit details.

## Safety
Do not test production with active penetration-testing tools without explicit written authorization and an agreed scope. Prefer staging, low-rate tests and rollback plans.

## Secrets
Keep credentials in Vercel environment variables, not Git. If exposed, revoke/rotate immediately and inspect commit history.

## Automated checks
GitHub Actions runs `scripts/security_audit.py` on pushes, pull requests and manual dispatch. It is a lightweight pattern-based check and does not replace manual review or a professional audit.
