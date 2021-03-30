# Nuggetnova (blogging/sharing website)

* *Dude, there are like a million off the shelf blogging ready templates that you could use man, why even bother with creating a blogging website from scratch?*
  * **In short because I wanted to do something myself and have a deep understanding of its flaws and potential benefits. I have always wanted to build a website using the Nodejs framework. I do realize that there are probably better alternatives for blogging such as Wordpress and others. This is a personal project that I have been wanting to do for a long time.**
* So far this has been a huge and fun learning experience. By no means is the code in this repository perfect and neither do I advertise this! This website is currently deployed using Heroku [nuggetnova(heroku)](https://nuggetnova.herokuapp.com/)


## Nuggetnova is a blogging/sharing website project developed using Nodejs, express, the vash template engine, and the PostgreSQL database. The purpose of this website is to allow blogging/sharing. 

* Key components:
  * authentication/login which allows access to the publishing of new blog posts
  * editing, adding, and deleting of published blog posts
  * archive area which allows the quick lookup of past blog posts
  * fully editable about page
  * categorized posts
  * admin area with events, messages and application customizable settings

## Getting Started

* **Warning: presently this project is not in user friendly state, it is definitely not pick off the shelf and use state but I will continue to improve the documentation and the user friendliness of the code base**
* install postgresql on your local Linux computer
  * $ sudo apt-get install postgresql-12
  * $ sudo -u postgres psql
      * make sure your pg_hba.conf is local all postgres peer
      * ALTER USER postgres PASSWORD 'thepassword';
  * run this SQL script to get your database set up
  
<pre><code>
-- Database: "nuggetnova-db"

-- DROP DATABASE "nuggetnova-db";

CREATE DATABASE "nuggetnova-db"
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;

       -- Schema: nn

-- DROP SCHEMA nn;

CREATE SCHEMA nn
  AUTHORIZATION postgres;

COMMENT ON SCHEMA nn
  IS 'this schema is for nuggetnova';

  -- Table: nn."Event"

-- DROP TABLE nn."Event";

CREATE TABLE nn."Event"
(
  id uuid NOT NULL,
  ip_address character varying(80) NOT NULL,
  category character varying(20) NOT NULL,
  description text NOT NULL,
  createtimestamp timestamp with time zone NOT NULL,
  CONSTRAINT "Event_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nn."Event"
  OWNER TO postgres;

  -- Table: nn."Message"

-- DROP TABLE nn."Message";

CREATE TABLE nn."Message"
(
  id uuid NOT NULL,
  ip_address character varying(80) NOT NULL,
  body character varying(512) NOT NULL,
  createtimestamp timestamp with time zone NOT NULL,
  createdby character varying(100),
  CONSTRAINT "Message_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nn."Message"
  OWNER TO postgres;

  -- Table: nn."Post"

-- DROP TABLE nn."Post";

CREATE TABLE nn."Post"
(
  id uuid NOT NULL,
  header character varying(150) NOT NULL,
  createtimestamp timestamp with time zone NOT NULL,
  modifytimestamp timestamp with time zone,
  ispublished boolean NOT NULL,
  description character varying(250) NOT NULL,
  name character varying(50) NOT NULL,
  category character varying(50),
  body text NOT NULL DEFAULT ''::text,
  CONSTRAINT "Post_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nn."Post"
  OWNER TO postgres;

  -- Table: nn."Settings"

-- DROP TABLE nn."Settings";

CREATE TABLE nn."Settings"
(
  id uuid NOT NULL,
  archive_view character varying(30) NOT NULL,
  about_section text NOT NULL,
  CONSTRAINT "Settings_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nn."Settings"
  OWNER TO postgres;

-- Table: nn."Supersecretpassword"

-- DROP TABLE nn."Supersecretpassword";

CREATE TABLE nn."Supersecretpassword"
(
  key character varying(512) NOT NULL,
  salt character varying(256),
  id uuid NOT NULL,
  CONSTRAINT "Supersecretpassword_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE nn."Supersecretpassword"
  OWNER TO postgres;
</code></pre>

  * check out this project
  * set the *dev.index.js* file to the correct local credentials of your PostgreSQL primary account
  * run this command to start the application
    * $ cd ~/Documents/nuggetnova
    * $ DEBUG=/:* npm start
    * the project should start if not it most likely is a database or missing dependency not installed
  * accessing the administrative area in nuggetnova
    * a password must be created
    * TODO: the application still needs intial setup for password


## Prerequisites

* mid to deep level understanding of JavaScript
* basic SQL understanding
* basic MVC concepts/routing

## Future plans

* better user friendliness with publishing new articles
* better setup and a more templated version for others who wish to use this
* better documentation
* more customizablity for the application settings

## Built With
* [Visual Studio Code](https://code.visualstudio.com/)
* [Nodejs](https://nodejs.org/en/)
* [PostgreSQL](https://www.postgresql.org/)
* [vash template engine](https://github.com/kirbysayshi/vash)
* [expressjs](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Heroku](https://heroku.com)

## Authors

* **Thomas Reese** - *Initial work* - [tomjar](https://github.com/tomjar)

## License

* MIT

## Acknowledgments

* [basic authentication encryption](https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/)
* [express-example](https://shapeshed.com/creating-a-basic-site-with-node-and-express/)
* [vash template engine](https://github.com/kirbysayshi/vash)
* [node-postgres documentation](https://node-postgres.com/guides/project-structure)
