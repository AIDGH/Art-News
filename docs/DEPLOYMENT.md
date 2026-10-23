# Cinema Namayesh Deployment

## English admin category — 2026-10-20

Production and origin/main both ran `2ac3455`; deployment was healthy. Alireza's
English dropdown change only modified `prisma/seed.ts`, which deployment does
not run. No English Category row existed, so the live dropdown could not list it.

Added `20261020190000_add_english_category`, a data-only migration that inserts
the missing row at the end of category ordering and leaves an existing English
category unchanged. It was checked for repeat execution and preservation of
customized title/order. Do not run the full seed: it also updates administrator
and sample editorial data.

To make the admin option available immediately, the same idempotent SQL was
applied in a transaction under the deployment lock. Backup:
`/var/backups/cinema-namayesh/cinema-before-english-category-20261020.db`.
Article/User/MediaPost counts stayed `24/2/2`; SQLite quick_check passed. The
live public category API (loopback and HTTPS) now returns English. An open
admin editor needs a refresh to reload its category options. The next normal
`prisma migrate deploy` will run the same SQL as a no-op and record the migration
in its own history; no manual migration-history insertion or reset was used.

## Ecran News HTTPS and redirect — 2026-10-19

- Pulled `main` first; it was already current at `c9bfb7c`.
- Public DNS for `ecrannews.ir` resolves to `95.38.160.189`. Both the server
  resolver and Cloudflare returned NXDOMAIN for `www.ecrannews.ir`; the DNS
  provider still needs `www CNAME ecrannews.ir` (or an A to the same address).
- Issued a separate Let's Encrypt certificate for `ecrannews.ir`, expiring
  2027-01-17. The existing Certbot account, nginx renewal integration and active
  renewal timer are used. Main-domain certificate and application are unchanged.
- Installed `deploy/nginx-ecrannews.conf` at
  `/etc/nginx/sites-available/ecrannews`, enabled it, and removed both Ecran
  names from the default application's HTTP server block to avoid duplicates.
  HTTP for both names and HTTPS for the apex redirect 301 directly to
  `https://cinemanamayesh.ir$request_uri`, preserving path and query.
- Config backups: `/root/cinema-nginx-before-ecrannews-20261019.conf` and
  `/root/cinema-nginx-pre-redirect-20261019.conf`. `nginx -t` and reload passed;
  real HTTP/HTTPS apex redirects and an HTTPS check from outside the server
  passed. A forced-address HTTP check passed for www; this does not establish
  public www DNS or HTTPS readiness. Main homepage returned 200 and API health
  returned ok. Although the SSH session closed before returning dry-run output,
  reconnecting and checking the Certbot log confirmed at 11:26:36 UTC that all
  simulated renewals succeeded. Nginx config, the live redirect and the active
  Certbot timer were also rechecked successfully afterwards.
- Once www DNS works, expand the existing certificate with
  `certbot certonly --nginx --non-interactive --cert-name ecrannews.ir --expand -d ecrannews.ir -d www.ecrannews.ir`,
  add `www.ecrannews.ir` to the HTTPS server_name in the Ecran config, run
  `nginx -t`, reload and verify both public hostnames. Do not add www to the
  TLS block before its certificate covers that name. The saved config in the
  repo describes the currently deployed apex-only TLS state.

## Homepage search presentation — 2026-10-18

Search Console's stored crawl from October 17 already contains the current home
title, meta description and footer `data-nosnippet`. A successful crawl does not
mean Google has regenerated the displayed title/snippet. The homepage now has a
metadata description shared with WebSite structured data, and the portaled
mobile menu has its own snippet exclusion with the corrected brand. The owner
requested removal of the visible introduction later the same day; it was removed
and the original carousel headings restored.
No migration or server setting change is required. After the usual deployment,
request indexing once for the canonical homepage if needed; repeated requests,
removing the page from Search, or noindexing categories are not fixes. Search
presentation remains Google's decision. Do not wait for deployment after push.

## Failed rich-text rollout — 2026-10-13

Read-only SSH audit found the deploy timer active and retrying `eab0de2`, while
the current symlink and deployed-revision still pointed to `7b42a93`. Frontend
build failed at `src/lib/api.ts:169`: media mapping returned `body: never[]` after
Article.body changed to string. Free root disk space was 18 GiB (21% used), and
there were no pending migrations. Correct the media and sample body mappings;
retain the editor, menu version 2.0 and title changes from main. No live service,
deployment script, database or upload mutation was made during diagnosis.
The existing timer will publish the corrected main through its usual build path;
do not wait for deployment after pushing. Google result text also needs recrawling.

## Search discovery — 2026-10-08

Deploy API and web together; `/sitemap.xml` depends on the new public
`/api/v1/articles/sitemap` endpoint. No migration or database write is needed.
Production `NEXT_PUBLIC_SITE_URL` must be `https://cinemanamayesh.ir`; it is
shared with canonical metadata and robots sitemap URLs. The sitemap is generated
at request time, so build does not require a running API. API failure returns an
error rather than publishing a partial sitemap. No deployment polling after push.

Owner follow-up: add `cinemanamayesh.ir` as a Domain property in Google Search
Console, install the exact supplied DNS TXT record in the authoritative DNS zone,
verify ownership, submit `https://cinemanamayesh.ir/sitemap.xml`, and use URL
Inspection to test/request indexing of the home page and a few published stories.
Do not change nameservers to verify ownership or replace existing DNS records.
Search Console account access is required; indexing and ranking are not guaranteed.

## Admin text and ordering update — 2026-10-07

Apply `20261007090000_add_ecran_promo_text` using migrate deploy after Prisma
generation. It adds one defaulted text column and preserves existing site copy;
no reset/reseed is required. The main deploy script already runs generate/migrate
before builds. Runtime Article upload covers now bypass Next image optimization,
while build-time images retain optimization. The live Bot cover was verified as
HTTP 200 at its upload URL and HTTP 400 through the Next image processor. No live
content or uploaded file was changed. Do not wait for deployment after pushing.

## Runtime upload access — 2026-10-06

The uploaded test PNG and MP4 existed, but Nginx returned 404 because
`/var/lib/cinema-namayesh` had mode 0700 and lacked traversal access for
`www-data`. Grant that user traversal only on the state directory and read/traverse
access only to uploads, with an inherited ACL for future files:

```bash
setfacl -m u:www-data:--x /var/lib/cinema-namayesh
setfacl -R -m u:www-data:rX /var/lib/cinema-namayesh/uploads
setfacl -m d:u:www-data:r-x /var/lib/cinema-namayesh/uploads
```

Applied live: PNG returned 200 and the MP4 range request returned 206 with
`Content-Type: video/mp4` and a correct Content-Range. `www-data` cannot read
the SQLite database. The repository deploy script repeats these limited ACLs.
Installing that updated script at `/usr/local/sbin/deploy-cinema-namayesh` was
not completed because subsequent SSH/SCP connections timed out. The live ACL
fix itself succeeded and is persistent, including defaults for future uploads.
Gallery cover rendering bypasses Next image optimization for runtime uploads.
Migration `20261006170000_add_media_post_link` adds nullable `MediaPost.targetUrl`
without changing existing posts. Normal main deployment applies it; no reseed/reset.
Per owner preference, do not wait for or poll deployment after committing/pushing.

## Multimedia rollout — 2026-10-05

Migration `20261005100000_add_media_posts` adds two tables only. Back up SQLite
and uploads, then run `prisma migrate deploy`; do not reset or reseed. Verify
`/api/v1/media-posts`, admin draft/publish, and `/category/photos` and
`/category/videos`. Existing 8 MiB image and 30 MiB video limits apply; keep
Nginx request limit at least 32 MiB. The owner authorized committing and pushing
all gallery changes and the Ecran banner spacing fix to v2 and main on October 5.
Deployment verification is pending the push.

Pre-deploy checks on October 5: API, web and deploy timer active at `6e2f0b1`;
12 articles and 2 users present. Backup service succeeded, producing
`cinema-20261005T185442Z.db` and the paired uploads archive. Live Nginx limits
were raised from 10m to 32m after preserving its configuration at
`/root/cinema-nginx-before-media-20261005.conf`; `nginx -t` and reload succeeded,
with the existing HTTPS configuration retained.

## Main-domain HTTPS — 2026-09-28

- Public DNS uses `ns1.f95.com` and `ns2.f95.com`; apex and `www` resolve directly to `95.38.160.189`. CDN proxy activation has not been verified.
- Let's Encrypt certificate installed for `cinemanamayesh.ir` and `www.cinemanamayesh.ir`, initially expiring 2026-12-27. Certbot renewal timer is active. No account contact email was configured.
- HTTP for these two names and HTTPS `www` redirect permanently to `https://cinemanamayesh.ir`, preserving path and query.
- HTTPS homepage, cinema category, sample article, admin login page and API health returned 200. Interactive login/upload has not been tested in this step.
- Direct-IP HTTP remains available for migration compatibility. Ecran News DNS/TLS/redirect is still pending. Pre-TLS and Certbot-generated Nginx configurations are retained under `/root` for rollback.

## Server migration — 2026-09-27

- Source: `37.32.25.137`, now temporarily reverse-proxying HTTP requests to the destination. Its application services and deployment/backup timers are disabled; its data remains available for rollback.
- Destination: `95.38.160.189`, Ubuntu 24.04, approximately 4 GiB RAM and a 25 GB disk.
- SSH uses the project-specific `cinema_namayesh_arvan` key; do not commit private keys.
- A fresh source backup completed successfully; SQLite integrity check returned `ok` (12 articles, 2 users).
- Release `92f81f0978923fdfc23416ed26ef81e40dfdaa09`, configuration, uploads, and backup history were transferred. A final SQLite snapshot was restored with both servers' application services stopped to prevent concurrent writes.
- Node.js 22, project pnpm 11.18.0, application services, Nginx, daily backups, and automatic main deployment are active on the destination. Manual backup/deployment runs succeeded; SSH is key-only and UFW allows SSH/HTTP/HTTPS.
- Homepage, article, admin-login page, and API health checks passed over the public IP. Existing user records and password hashes were preserved; an interactive admin login has not been tested.
- Main-domain DNS and HTTPS were completed on 2026-09-28 (see above). The old IP requires the old server to remain running; switch remaining clients to the new domain/IP before shutting it down. Infrastructure-level weekly backup on the new account must be verified separately in ArvanCloud.

## Current production topology

The first production release runs on one Ubuntu 24.04 cloud server in Iran:

```text
Internet
  -> Nginx :80/:443
    -> Next.js :3001 (loopback only)
      -> NestJS :4001 (loopback only)
        -> SQLite /var/lib/cinema-namayesh/cinema.db
```

Public news images now use `/image-source/:filename` as the input to Next's
image optimizer. This runtime route reads only timestamp/UUID image filenames
from the absolute runtime `NEWS_UPLOAD_DIRECTORY` (set by `cinema-web.service`
to `/var/lib/cinema-namayesh/uploads`), including uploads created after build.
Do not resolve the public uploads symlink in the route: Turbopack traces it
outside the release root and fails the build. The `cinema` user's read access is required;
no Nginx or database changes are needed. Next caches resized WebP variants in
its writable `.next/cache`; originals and GIFs remain available under `/uploads/`.
If optimization fails, the browser falls back to the original image.

Regression check after a local production build and
`NEWS_UPLOAD_DIRECTORY=/absolute/path/to/apps/web/public/uploads next start --port 3002`:
`node scripts/verify-image-optimization.mjs http://127.0.0.1:3002` from `apps/web`.
The test creates and removes only its own temporary upload and verifies new
uploads, thumbnail dimensions/bytes, cache hits, invalid paths, and original
file integrity. On 2026-10-22 this passed locally; SSH production timed out,
so live performance and deployment were not verified during that session.

Runtime uploads live in `/var/lib/cinema-namayesh/uploads`. Application releases
live under `/srv/cinema-namayesh/releases`, while
`/srv/cinema-namayesh/current` points to the active release.

The current public IPv4 address is `95.38.160.189`. The application, API, article,
category, and admin-login routes have been verified through Nginx on this address.

## Automatic deployment

`cinema-deploy.timer` checks `origin/main` approximately once per minute. When a
new commit exists, `/usr/local/sbin/deploy-cinema-namayesh` creates an isolated
Git worktree, installs the locked dependencies, generates Prisma Client, applies
database migrations, builds both applications, switches the `current` symlink,
and restarts the services. A failed health check restores the previous release.
The failed revision is recorded in `/var/lib/cinema-namayesh/failed-revision`;
the timer skips it until a new commit arrives. An operator can retry explicitly
with `FORCE_DEPLOY=1 /usr/local/sbin/deploy-cinema-namayesh`.
Both `.next/server` (ISR pages) and `.next/cache` must be owned by `cinema`.
The `acl` package provides read-only access to each built release for the
restricted `cinema` service user; production secrets remain outside releases.

Useful commands:

```bash
systemctl status cinema-api cinema-web cinema-deploy.timer
journalctl -u cinema-deploy.service -n 100 --no-pager
systemctl start cinema-deploy.service
```

The automatic process intentionally does not run the seed. Seed is an explicit
initialization action because running it repeatedly can overwrite editorial
sample data or the administrator password.

The comments/likes migration `20260930100000_add_engagement` adds three new
tables without changing existing article rows. Promotion to `main` and publication
of both branches were authorized on 2026-09-30. The cloud instance is currently
powered off according to the owner, so production deployment is unverified.
When restoring the instance, take a fresh SQLite backup before applying the
migration, then check migration status and the public engagement endpoint.

## Advertising and article blocks rollout — 2026-10-02

The owner authorized committing and pushing the feature to both `v2` and `main`.
Production deployment and the live Nginx upload limit remain unverified.
Migration `20261002100000_add_ads_and_article_blocks` adds only
new tables and relations. Before rollout, back up the live SQLite file, run
`prisma migrate deploy` and generate the client; do not reseed or reset the database.
Images/GIFs are limited to 8 MiB and MP4/WebM ad videos to 30 MiB. The Next.js proxy
and example `deploy/nginx.conf` now allow a 32 MiB multipart request. On the live
server, update `client_max_body_size 32m` in the existing Nginx site with its TLS
configuration preserved, validate with `nginx -t`, then reload. Do not replace the
Certbot-managed HTTPS configuration with the plain-HTTP repository template.
Verify a video upload through HTTPS, ad activation/expiry, and a multi-image article.


## Backups

`cinema-backup.timer` creates a SQLite online backup and a compressed uploads
archive every day. Local backups are retained for 14 days under
`/var/backups/cinema-namayesh`. Verify ArvanCloud weekly backup on the new
customer account; its setting is not transferred by copying server files.
An off-server copy of daily application backups is still required before final launch.

Useful commands:

```bash
systemctl status cinema-backup.timer
systemctl start cinema-backup.service
ls -lh /var/backups/cinema-namayesh
```

## Network and domains

Only SSH, HTTP, and HTTPS are public. Application ports `3001` and `4001` bind
to loopback and must not be exposed by the cloud security group. The canonical
domain is `cinemanamayesh.ir`; `ecrannews.ir` has HTTPS and a permanent redirect
to it. The www variant still needs DNS and certificate expansion (see October 19).

UFW defaults to denying inbound traffic and allows only OpenSSH and Nginx Full.
SSH password and keyboard-interactive authentication are disabled; root access
is permitted only with an authorized key.

Nginx must overwrite `X-Forwarded-Proto` with `$scheme`. Authentication uses
this trusted proxy header to issue a non-Secure session cookie on the temporary
HTTP IP and a Secure cookie after HTTPS is enabled.

Create these DNS records before issuing certificates:

```text
cinemanamayesh.ir      A      95.38.160.189
www.cinemanamayesh.ir  A      95.38.160.189
ecrannews.ir           A      95.38.160.189
www.ecrannews.ir       CNAME  ecrannews.ir
```

Certbot and its renewal timer are installed. Main-domain and Ecran apex HTTPS
and canonical redirects are active. Ecran www DNS and TLS remain pending.

## Secrets

Production environment files are stored outside Git in
`/etc/cinema-namayesh`. They must be readable only by root and the `cinema`
group. Never commit the session secret, initial administrator password, private
SSH keys, database file, runtime uploads, or backup archives.
