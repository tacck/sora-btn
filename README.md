sora-btn
===

[SORACOM LTE-M Button](https://soracom.jp/products/gadgets/) の簡易位置情報機能の確認用。

## 前提

* SORACOM LTE-M Button は SORACOM アカウントへ登録済み。
* SORACOM LTE-M Button の動作確認済み。
* 動作環境は [Dokku](http://dokku.viewdocs.io/dokku/) で構築。

## 構築

```shell
# at Dokku Server
## create app
$ dokku apps:create sora-btn
-----> Creating sora-btn... done
$ dokku config:set --no-restart sora-btn IMSI="YOUR_BUTTON_IMSI"
-----> Setting config vars
       IMSI:  YOUR_BUTTON_IMSI

## create mysql 8.0 
$ export MYSQL_IMAGE="mysql"
$ export MYSQL_IMAGE_VERSION="8.0"
$ dokku mysql:create sora-btn-db
       Waiting for container to be ready
=====> MySQL container created: sora-btn-db
=====> Container Information
       Config dir:          /var/lib/dokku/services/mysql/sora-btn-db/config
       Data dir:            /var/lib/dokku/services/mysql/sora-btn-db/data
       Dsn:                 mysql://mysql:YOUR_MYSQL_PASSWORD@dokku-mysql-sora-btn-db:3306/sora_btn_db
       Exposed ports:       -                        
       Id:                  XXXXXXXXXX
       Internal ip:         172.17.0.7               
       Links:               -                        
       Service root:        /var/lib/dokku/services/mysql/sora-btn-db
       Status:              running                  
       Version:             mysql:8.0 
$ dokku mysql:link sora-btn-db sora-btn
-----> Setting config vars
       DATABASE_URL:  mysql://mysql:YOUR_MYSQL_PASSWORD@dokku-mysql-sora-btn-db:3306/sora_btn_db
-----> Restarting app sora-btn
 !     App sora-btn has not been deployed
$

## update password
$ dokku mysql:enter sora-btn-db
-----> Filesystem changes may not persist after container restarts
root@3232d33603c5:/# mysql -u root -p
Enter password: <Input root password from /var/lib/dokku/services/mysql/sora-btn-db/ROOTPASSWORD>
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 8.0.17 MySQL Community Server - GPL

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> ALTER USER 'mysql'@'%' IDENTIFIED WITH mysql_native_password BY 'YOUR_MYSQL_PASSWORD';
Query OK, 0 rows affected (0.00 sec)

mysql> ^DBye
root@3232d33603c5:/# exit

## set db info
$ dokku config:set --no-restart sora-btn DB="dokku-mysql-sora-btn-db"
-----> Setting config vars
       DB:  dokku-mysql-sora-btn-db
$ dokku config:set --no-restart sora-btn DB_NAME="sora_btn_db"
-----> Setting config vars
       DB_NAME:  sora-btn-db
$ dokku config:set --no-restart sora-btn DB_USER="mysql"
-----> Setting config vars
       DB_USER:  mysql
$ dokku config:set --no-restart sora-btn DB_PASSWORD="YOUR_MYSQL_PASSWORD"
-----> Setting config vars
       DB_PASSWORD:  YOUR_MYSQL_PASSWORD

## create table
$ cat db.sql
DROP TABLE IF EXISTS current_position;
CREATE TABLE current_position (
    `id` int UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY
,   `latlng` GEOMETRY NOT NULL
,   `created_at` TIMESTAMP NOT NULL
,    SPATIAL KEY (latlng)
)
ENGINE=InnoDB CHARSET=utf8

$ dokku mysql:import sora-btn-db < db.sql
mysql: [Warning] Using a password on the command line interface can be insecure.


```

### デプロイ

```
# at Loca PC
% git remote add dokku dokku@your-dokku-server.example.com:sora-btn
% git add .
% git commit -m "your commit message"
% git push dokku master
```

### SSL対応

```
## ssl
$ dokku config:set --no-restart sora-btn DOKKU_LETSENCRYPT_EMAIL="YOUR@MAIL.ADDRESS"
-----> Setting config vars
       DOKKU_LETSENCRYPT_EMAIL:  YOUR@MAIL.ADDRESS
$ dokku letsencrypt sora-btn
=====> Let's Encrypt sora-btn
-----> Updating letsencrypt docker image...
latest: Pulling from dokkupaas/letsencrypt-simp_le
Digest: sha256:95681f7cd659f23f451738121df9efe42ffc919e93a969781c40e936258fea72
Status: Image is up to date for dokkupaas/letsencrypt-simp_le:latest
       done updating
-----> Enabling ACME proxy for sora-btn...
-----> Getting letsencrypt certificate for sora-btn...
        - Domain 'sora-btn.your-dokku-server.example.com'
darkhttpd/1.12, copyright (c) 2003-2016 Emil Mikulic.
listening on: http://0.0.0.0:80/
2019-08-05 09:35:23,426:INFO:__main__:1211: Generating new account key
2019-08-05 09:35:25,872:INFO:__main__:1305: sora-btn.your-dokku-server.example.com was successfully self-verified
2019-08-05 09:35:26,187:INFO:__main__:1313: Generating new certificate private key
2019-08-05 09:35:28,395:INFO:__main__:391: Saving account_key.json
2019-08-05 09:35:28,396:INFO:__main__:391: Saving fullchain.pem
2019-08-05 09:35:28,396:INFO:__main__:391: Saving chain.pem
2019-08-05 09:35:28,397:INFO:__main__:391: Saving cert.pem
2019-08-05 09:35:28,397:INFO:__main__:391: Saving key.pem
-----> Certificate retrieved successfully.
-----> Installing let's encrypt certificates
-----> Configuring sora-btn.your-dokku-server.example.com...(using built-in template)
-----> Creating https nginx.conf
-----> Running nginx-pre-reload
       Reloading nginx
-----> Configuring sora-btn.your-dokku-server.example.com...(using built-in template)
-----> Creating https nginx.conf
-----> Running nginx-pre-reload
       Reloading nginx
-----> Disabling ACME proxy for sora-btn...
       done
$ dokku letsencrypt:auto-renew sora-btn
       sora-btn still has 59d, 22h, 59m, 24s days left before renewal
```

### 再起動

```
$ dokku mysql:restart sora-btn-db
=====> Stopping container
       Container stopped
=====> Starting container
=====> Container started
-----> Please call dokku ps:restart on all linked apps
$ dokku ps:restart sora-btn
-----> Releasing sora-btn (dokku/sora-btn:latest)...
-----> Deploying sora-btn (dokku/sora-btn:latest)...
-----> App Procfile file found (/home/dokku/sora-btn/DOKKU_PROCFILE)
       DOKKU_SCALE declares scale -> web=1
-----> Attempting pre-flight checks
       For more efficient zero downtime deployments, create a file CHECKS.
       See http://dokku.viewdocs.io/dokku/deployment/zero-downtime-deploys/ for examples
       CHECKS file not found in container: Running simple container check...
-----> Waiting for 10 seconds ...
-----> Default container check successful!
-----> Running post-deploy
-----> Configuring sora-btn.your-dokku-server.example.com...(using built-in template)
-----> Creating https nginx.conf
-----> Running nginx-pre-reload
       Reloading nginx
-----> Found previous container(s) (25ee6aa4a435) named sora-btn.web.1
=====> Renaming container (25ee6aa4a435) sora-btn.web.1 to sora-btn.web.1.1564987970
=====> Renaming container (642ca6619260) loving_villani to sora-btn.web.1
-----> Shutting down old containers in 60 seconds
=====> 25ee6aa4a4352a342f9d6fdd1e43010c683263a949e6eb3d7ca22db7225164f6
=====> Application deployed:
       http://sora-btn.your-dokku-server.example.com
       https://sora-btn.your-dokku-server.example.com

```
TODO: DB_PASSWORDなどの情報伏せ

## アクセス

SORACOM

WEB

