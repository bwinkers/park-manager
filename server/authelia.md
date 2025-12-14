# Authelia Configuration

This configures the default bare metal Authelia installation.

## Configure in YAML

The base configuration and defining domain, ip, etc specific is done here.

```yaml

```

## Store users in Postgres

The user data is stored in Postgres for scaling.

example:

```sh

```

### Postgres Config

Authelia uses it's own Postgres database, that may or may not be on the same hardware as the API server.

The application software users the provided user.puid as the key for its records.

#### Create Database User

#### Create Database and tables



