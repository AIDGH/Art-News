# Cinema Namayesh Deployment

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
domain is `cinemanamayesh.ir`; `ecrannews.ir` will receive a permanent redirect
after both domains point to the server and TLS certificates are issued.

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

Certbot and its renewal timer are installed. Main-domain HTTPS and canonical
redirects are active. Certificate issuance and permanent redirects for the two
Ecran News hostnames remain pending until their DNS is connected.

## Secrets

Production environment files are stored outside Git in
`/etc/cinema-namayesh`. They must be readable only by root and the `cinema`
group. Never commit the session secret, initial administrator password, private
SSH keys, database file, runtime uploads, or backup archives.
