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
  * run the nuggetnova-db.psql script file to get your database set up
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
