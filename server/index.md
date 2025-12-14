# Main Server

Hostname: vps-c75800d2.vps.ovh.us

``` sh
sudo apt update && sudo apt upgrade
sudo apt install -y ca-certificates curl gnupg
```

## Install Postgres

```sh
sudo apt install postgresql postgresql-contrib -y
```
## Install LDAP

```sh
sudo apt update && sudo apt install slapd ldap-utils
```

Configure LDAP server

```sh
sudo dpkg-reconfigure slapd
```

## Install Authelia

```sh
sudo apt install ca-certificates curl gnupg
sudo curl -fsSL https://www.authelia.com/keys/authelia-security.gpg -o /usr/share/keyrings/authelia-security.gpg
```

verify...

```sh
gpg --no-default-keyring --keyring /usr/share/keyrings/authelia-security.gpg --list-keys --with-subkey-fingerprint
```

add to sources

```sh
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/authelia-security.gpg] https://apt.authelia.com stable main" | \
  sudo tee /etc/apt/sources.list.d/authelia.list > /dev/null
```

install

```sh
sudo apt update && sudo apt install authelia
```

## Install Caddy

```sh
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg
chmod o+r /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## Install Node 

### Install nvm

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

### Install Node latest (25)

```sh
nvm install node
```
