# Cinema Namayesh Deployment

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

## Automatic deployment

`cinema-deploy.timer` checks `origin/main` approximately once per minute. When a
new commit exists, `/usr/local/sbin/deploy-cinema-namayesh` creates an isolated
Git worktree, installs the locked dependencies, generates Prisma Client, applies
database migrations, builds both applications, switches the `current` symlink,
and restarts the services. A failed health check restores the previous release.

Useful commands:

```bash
systemctl status cinema-api cinema-web cinema-deploy.timer
journalctl -u cinema-deploy.service -n 100 --no-pager
systemctl start cinema-deploy.service
```

The automatic process intentionally does not run the seed. Seed is an explicit
initialization action because running it repeatedly can overwrite editorial
sample data or the administrator password.

## Backups

`cinema-backup.timer` creates a SQLite online backup and a compressed uploads
archive every day. Local backups are retained for 14 days under
`/var/backups/cinema-namayesh`. ArvanCloud weekly backup is also enabled at the
infrastructure level, but an off-server copy of daily application backups is
still required before final launch.

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

## Secrets

Production environment files are stored outside Git in
`/etc/cinema-namayesh`. They must be readable only by root and the `cinema`
group. Never commit the session secret, initial administrator password, private
SSH keys, database file, runtime uploads, or backup archives.
