create Database if not exists heroku_efc788d1dc18da4;

create table if not exists heroku_efc788d1dc18da4.USER(
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Email varchar(255),
Password varchar(255) NOT NULL,
FName varchar(255),
MName varchar(255),
LName varchar(255));

create table if not exists heroku_efc788d1dc18da4.ADMIN (
ID int NOT NULL PRIMARY KEY,
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.PATIENT (
ID int NOT NULL PRIMARY KEY,
Age int,
PhoneNumber varchar(255),
Address varchar(255),
PostalCode varchar(255),
Country varchar(255),
Province varchar(255),
City varchar(255),
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.HEALTH_PROFILE (
ID int NOT NULL,
HealthNumber int NOT NULL PRIMARY KEY,
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.VACCINE (
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Name varchar(255),
Advisery varchar(255),
Description varchar(255),
URL varchar(255),
CreaterID int,
FOREIGN KEY (CreaterID) REFERENCES ADMIN(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.CLINIC (
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Name varchar(255),
Address varchar(255),
PostalCode varchar(255),
Country varchar(255),
Province varchar(255),
City varchar(255),
URL varchar(255),
CreaterID int,
FOREIGN KEY (CreaterID) REFERENCES ADMIN(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.CLINIC_PHONE_NUMBER (
CID int NOT NULL,
PhoneNumber varchar(255) NOT NULL,
CONSTRAINT PK_PN PRIMARY KEY (CID,PhoneNumber),
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.VACCINE_SUPPORT (
CID int NOT NULL,
VID int NOT NULL,
CONSTRAINT PK_VS PRIMARY KEY (CID,VID),
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (VID) REFERENCES VACCINE(ID)
ON DELETE CASCADE
ON UPDATE CASCADE
);

create table if not exists heroku_efc788d1dc18da4.REQUEST_APPOINTMENT (
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Date varchar(255),
PID int,
VID int,
FOREIGN KEY (PID) REFERENCES PATIENT(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (VID) REFERENCES VACCINE(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists heroku_efc788d1dc18da4.APPOINTMENT (
RID int NOT NULL PRIMARY KEY,
Date varchar(255) NOT NULL,
Status varchar(255),
CID int,
FOREIGN KEY (RID) REFERENCES REQUEST_APPOINTMENT(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

