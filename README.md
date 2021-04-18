# CPSC-471-Vaccination-Project

The postman API can be found in https://documenter.getpostman.com/view/15138632/TzJrDKXN#intro

If you wish to see the website, you can see it in https://cpsc-471-vaccination-project.herokuapp.com/ 

If you wish to run this website on your own, follow the following instructions. 

---

Here are the required sofwares needed to be installed before you are able to run this site.

1. MySql community - https://dev.mysql.com/downloads/

2. Node Js - https://nodejs.org/en/download/

---

1. Run the TableCreation.sql file

2. Run the Procedures.sql file

3. Run the following script where 'password' is the password of your root user.

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'

4. in the .env-example file, change the DB_PASSWORD to the password of your root user.

5. Rename the .env-example file to .env

6. Run 'npm install'

6. Run 'Nodemon' or 'node index.js'

