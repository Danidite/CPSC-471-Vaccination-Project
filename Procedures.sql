USE heroku_efc788d1dc18da4;

DELIMITER $$
USE heroku_efc788d1dc18da4 $$
CREATE PROCEDURE SelectClinicIDFromCity (
	IN I int, 
	IN C varchar(255)
)
BEGIN
	SELECT c.ID 
    FROM VACCINE v JOIN VACCINE_SUPPORT s ON v.ID = s.VID JOIN CLINIC c ON c.ID = s.CID 
    WHERE v.ID = I AND c.City = C;
END
$$

DELIMITER //
USE heroku_efc788d1dc18da4 //
CREATE PROCEDURE UpdateVaccine (
	IN N varchar(255), 
	IN A varchar(255),
	IN D varchar(255), 
	IN U varchar(255),
	IN I int
)
BEGIN
	UPDATE VACCINE 
	SET Name = N, Advisery = A, Description = D, URL = U 
	WHERE ID = I;
END
//

DELIMITER !!
USE heroku_efc788d1dc18da4 !!
CREATE PROCEDURE GetAppointments (
	IN I int
)
BEGIN
	SELECT r.ID, v.Name as VName, c.Name as CName, a.Date, a.Status 
	FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID JOIN CLINIC c ON c.ID = a.CID JOIN VACCINE v ON v.ID = r.VID 
	WHERE r.PID = I;
END
!!

DELIMITER ;;
USE heroku_efc788d1dc18da4 ;;
CREATE PROCEDURE GetPatientIDFromRequestID (
	IN I int
)
BEGIN
	SELECT r.PID 
    FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID 
    WHERE a.RID = I;
END
;;

DELIMITER %%
USE heroku_efc788d1dc18da4 %%
CREATE PROCEDURE UpdateAppointment (
	IN S varchar(255),
    IN I int
)
BEGIN
	UPDATE APPOINTMENT 
    SET Status = S 
    WHERE RID = I;
END
%%

DELIMITER **
USE heroku_efc788d1dc18da4 **
CREATE PROCEDURE GetAllScores()
BEGIN
	SELECT u.FName, u.MName, u.LName, p.Age, h.HealthNumber 
    FROM USER u JOIN PATIENT p ON u.ID = p.ID JOIN HEALTH_PROFILE h ON p.ID = h.ID;
END
**

DELIMITER ++
USE heroku_efc788d1dc18da4 ++
CREATE PROCEDURE GetAllAppointments ()
BEGIN
	SELECT u.ID, u.FName, u.MName, u.LName, v.Name as VName, c.Name as CName, a.Date, a.Status 
    FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID JOIN CLINIC c ON c.ID = a.CID JOIN VACCINE v ON v.ID = r.VID JOIN USER u ON u.ID = r.PID;
END
++
