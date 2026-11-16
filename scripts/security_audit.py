#!/usr/bin/env python3
"""Conservative, offline, non-destructive repository audit for ElAi."""
from pathlib import Path
import re, sys
ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'.git', 'node_modules', '.next', 'dist', 'build', '.venv', '__pycache__'}
SUFFIXES = {'.js','.jsx','.ts','.tsx','.html','.json','.yaml','.yml','.env','.txt','.md','.sql'}
checks = []
def add(level, title, detail): checks.append((level,title,detail))
for p in ROOT.rglob('*'):
    if not p.is_file() or any(x in EXCLUDED for x in p.relative_to(ROOT).parts) or p.stat().st_size > 2_000_000: continue
    rel=p.relative_to(ROOT).as_posix()
    if p.name == '.env' or p.name.startswith('.env.') and p.name != '.env.example':
        add('FAIL','Environment file committed',rel)
    if p.suffix.lower() not in SUFFIXES or rel in {'scripts/security_audit.py','security-report.md'}: continue
    try: data=p.read_text(encoding='utf-8')
    except UnicodeError: continue
    # High-confidence private key blocks, token formats; redact values from report.
    if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----',data):
        add('FAIL','Private key in repository',rel)
    if re.search(r'\b(?:ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{30,}\b',data):
        add('FAIL','GitHub token pattern',rel)
    if re.search(r'\bsk-proj-[A-Za-z0-9_-]{30,}',data):
        add('FAIL','OpenAI project key pattern',rel)
    if re.search(r'\b(?:AKIA|ASIA)[0-9A-Z]{16}\b',data):
        add('FAIL','AWS access key ID pattern',rel)
    if rel.startswith('api/') and re.search(r'Access-Control-Allow-Origin\s*[\x22\x27:]\s*\*',data):
        add('REVIEW','Permissive CORS may be present',rel)
    if rel.startswith('api/') and re.search(r'console\.log\s*\(',data):
        add('REVIEW','Review API logs for sensitive data',rel)
if not (ROOT/'.gitignore').exists(): add('REVIEW','Missing .gitignore','Add ignores for .env and dependencies')
else:
    ignore=(ROOT/'.gitignore').read_text(encoding='utf-8')
    if '.env' not in ignore: add('REVIEW','.gitignore lacks .env','Consider ignoring secrets')
if not (ROOT/'vercel.json').exists(): add('REVIEW','No vercel.json','Review platform security headers')
if not (ROOT/'robots.txt').exists(): add('INFO','No robots.txt','Search indexing guidance not present')
if not (ROOT/'sitemap.xml').exists(): add('INFO','No sitemap.xml','Search discovery map not present')
report=['# ElAi repository security report','', 'Offline static checks only; not a penetration test.','', '| Severity | Finding | Location / note |','|---|---|---|']
for level,title,detail in checks: report.append(f'| {level} | {title} | {detail.replace("|","/")} |')
if not checks: report.append('| INFO | No configured patterns matched | Manual review is still required |')
report += ['', '## Manual follow-up','- Verify Vercel environment variables and API authentication/rate limits.', '- Review Supabase RLS policies and public anon key usage.', '- Review security headers, spam controls, and error handling.', '- Do not run active scanners against production without written scope and approval.']
(ROOT/'security-report.md').write_text('\n'.join(report)+'\n',encoding='utf-8')
print('\n'.join(report))
sys.exit(1 if any(level=='FAIL' for level,_,_ in checks) else 0)
