create Database if not exists storedatabase;

create table if not exists storedatabase.USER(
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Email varchar(255),
Password varchar(255) NOT NULL,
FName varchar(255),
MName varchar(255),
LName varchar(255));

create table if not exists storedatabase.ADMIN (
ID int NOT NULL PRIMARY KEY,
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.PATIENT (
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

create table if not exists storedatabase.HEALTH_PROFILE (
ID int NOT NULL,
HealthNumber int NOT NULL PRIMARY KEY,
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.VACCINE (
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Name varchar(255),
Advisery varchar(255),
Description varchar(255),
URL varchar(255),
CreaterID int,
FOREIGN KEY (CreaterID) REFERENCES ADMIN(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.CLINIC (
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

create table if not exists storedatabase.CLINIC_PHONE_NUMBER (
CID int NOT NULL,
PhoneNumber varchar(255) NOT NULL PRIMARY KEY,
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.VACCINE_SUPPORT (
CID int NOT NULL,
VID int NOT NULL,
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (VID) REFERENCES VACCINE(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.REQUEST_APPOINTMENT (
ID int NOT NULL PRIMARY KEY,
Date varchar(255),
PID int,
VID int,
FOREIGN KEY (PID) REFERENCES PATIENT(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (VID) REFERENCES VACCINE(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

create table if not exists storedatabase.APPOINTMENT (
RID int NOT NULL,
Date varchar(255) PRIMARY KEY,
Status varchar(255),
CID int,
FOREIGN KEY (RID) REFERENCES REQUEST_APPOINTMENT(ID)
ON DELETE CASCADE
ON UPDATE CASCADE,
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

