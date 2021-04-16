create Database if not exists heroku_efc788d1dc18da4;

create table if not exists heroku_efc788d1dc18da4.USER(
ID int NOT NULL PRIMARY KEY AUTO_INCREMENT,
Email varchar(255),
Password varchar(255) NOT NULL,
FName varchar(255),
MName varchar(255),
LName varchar(255));

INSERT INTO heroku_efc788d1dc18da4.USER (`ID`, `Email`, `Password`, `FName`, `MName`, `LName`) VALUES
(1, 'admin@gmail.com', 123, 'Admin', 'Aditos', 'Adminson');

create table if not exists heroku_efc788d1dc18da4.ADMIN (
ID int NOT NULL PRIMARY KEY,
FOREIGN KEY (ID) REFERENCES USER(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

USE heroku_efc788d1dc18da4;

INSERT INTO heroku_efc788d1dc18da4.ADMIN (`ID`) VALUES
(1);

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

USE heroku_efc788d1dc18da4;

INSERT INTO heroku_efc788d1dc18da4.VACCINE (`ID`, `Name`, `Advisery`, `Description`, `URL`, `CreaterID`) VALUES
(1, 'COVID 19 - Moderna', '2 doses, 1 after another', '95% efficacy rate against COVID-19', 'https://www.hopkinsmedicine.org/-/media/images/health/1_-conditions/coronavirus/vaccine-hero.ashx', 1),
(2, 'CPSC 471', '1 dose', 'Cures all depression.', 'https://s7280.pcdn.co/wp-content/uploads/2016/06/database-blue.png', 1),
(3, 'Jensusm - Long&Long', '3 doses, 2 days apart. Jens will give presents!', 'Jensusm, the ever lasting illness. This is a severe condition that must be solved as soon as detected. Failure to acquire treatment for this will summon Jensusm to give you presents. DO NOT accept those presents! DO NOT EVER Accept them! REPEAT!!! DO NOT!', 'https://media3.s-nbcnews.com/i/newscms/2020_19/3339206/200506-covid-19-virus-al-1213_d926b22a18280ebb7babc72b5dce8a02.jpg', 1),
(4, 'DNA obliterator', 'No doses, its lethal, never take!', 'This is NOT a vaccine! This is simply murder! This is design to literally melt your DNA and cause total organ failure! It is a painful form of euthanasia, some may even call it torture. YOUR CELLS WILL LITERALLY MELT IF YOU TAKE THIS!', 'https://www.paho.org/sites/default/files/card/2021-03/covid-19-dna-1500x765.jpg', 1),
(5, 'COVID 19 - AstraZeneca', '2 doses, 1 week apart', 'Vaccine for COVID-19, from AstraZeneca!', 'https://globalnews.ca/wp-content/uploads/2021/03/CP120562673-e1617145038750.jpg?quality=85&strip=all&w=720', 1);

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

USE heroku_efc788d1dc18da4;

INSERT INTO heroku_efc788d1dc18da4.CLINIC (`ID`, `Name`, `Address`, `PostalCode`, `Country`, `Province`, `City`, `URL`, `CreaterID`) VALUES
(1, 'Clinic of the Union Against Jensusm', '823 Jensus Rememberance Street NW', 'U0D 7N4', 'CANADA', 'AB', 'CALGARY', 'https://i.redd.it/y2p02vwo8vx31.png', 1),
(2, 'The Shrine of Reda Alhajj (Elhajj)', '300 Lovers St SW', 'Y3K U8B', 'CANADA', 'AB', 'CALGARY', 'https://i.kym-cdn.com/photos/images/original/001/230/083/d68.jpg', 1),
(3, 'The Mayo Clinic', '3319 26 Ave NE', 'T1Y 6L4', 'CANADA', 'AB', 'CALGARY', 'https://s.abcnews.com/images/Health/mayo-clinic-covid-03-gty-llr-201118_1605730703009_hpMain_16x9_992.jpg', 1),
(4, 'Legacy Medical Centre', '2419 Ave. SW', 'T3K 8F1', 'CANADA', 'AB', 'CALGARY', 'https://www.brockvillegeneralhospital.ca/en/resourcesGeneral/feature_01.jpg', 1),
(5, 'Universal Long&Long Clinic', '321 Longist St NW', 'L0L 0L0', 'CANADA', 'AB', 'CALGARY', 'https://images-na.ssl-images-amazon.com/images/I/71RwPUtQ-BL._AC_SL1500_.jpg', 1),
(6, 'University of Calgary Wellness Services', '2500 University Drive NW', 'T2N 1N4', 'CANADA', 'AB', 'CALGARY', 'https://www.ucalgary.ca/live-uc-ucalgary-site/sites/default/files/styles/ucws_hero_cta_desktop/public/2019-03/MacHall_011A8586_F.jpg', 1);

create table if not exists heroku_efc788d1dc18da4.CLINIC_PHONE_NUMBER (
CID int NOT NULL,
PhoneNumber varchar(255) NOT NULL,
CONSTRAINT PK_PN PRIMARY KEY (CID,PhoneNumber),
FOREIGN KEY (CID) REFERENCES CLINIC(ID)
ON DELETE CASCADE
ON UPDATE CASCADE);

USE heroku_efc788d1dc18da4;

INSERT INTO heroku_efc788d1dc18da4.CLINIC_PHONE_NUMBER (`CID`, `PhoneNumber`) VALUES
(1, '421-792-3712'),
(1, '456-327-3616'),
(2, '420-420-4200'),
(3, '214-513-4252'),
(4, '281-642-0131'),
(5, '123-862-1345'),
(5, '521-856-2199'),
(5, '531-612-3511'),
(6, '403-210-9355');

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

USE heroku_efc788d1dc18da4;

INSERT INTO heroku_efc788d1dc18da4.VACCINE_SUPPORT (`CID`, `VID`) VALUES
(1, 3),
(1, 2),
(2, 3),
(3, 1),
(3, 5),
(4, 1),
(4, 5),
(5, 3),
(5, 4),
(6, 2),
(6, 5);

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
