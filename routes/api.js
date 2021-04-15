const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router();

router.use(express.json());

// Login
router.post('/login', (req, res) => {
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (results.length == 0) {
            res.status(404).send('User could not be found.');
        } else 
        if (results[0].Password == req.body.password) {
            res.status(200).send(results);
        } else {
            res.status(404).send('Password Incorrect');
        }
    });
});

// Register New User
router.post("/register", async (req, res) => {
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (error) {
            console.log("Select user with email: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            connection.query('INSERT INTO USER SET ?', {Email: req.body.username, Password: req.body.password, FName: req.body.firstname, Mname: req.body.middlename, LName: req.body.lastname}, function (error, results, fields) {
                if (error) {
                    console.log("user creation: " + error.message);
                    return res.status(404).send(error.message);
                }
        
                let UserID = results.insertId;
        
                connection.query('INSERT INTO PATIENT SET ?', {ID: UserID, Age: req.body.age, PhoneNumber: req.body.phone, Address: req.body.address, PostalCode: req.body.postal, Country: req.body.country, Province: req.body.province, City: req.body.city.toUpperCase()}, function (error, results, fields) {
                    if (error) {
                        console.log("Patient creation: " + error.message);
                        return res.status(404).send(error.message);
                    }

                    connection.query('INSERT INTO HEALTH_PROFILE SET ?', {ID: UserID, HealthNumber: req.body.healthcard}, function (error, results, fields) {
                        if (error) {
                            console.log("Health Card creation: " + error.message);
                            return res.status(404).send(error.message);
                        }
                        res.status(200).send(results); // successful register
                    });
                });
            });
        } else {
            return res.status(404).send('Email already Taken!');
        }
    });
});

// Get Appointments
router.get('/appointments/:id', (req, res) => {
    connection.query('SELECT r.ID, v.Name as VName, c.Name as CName, a.Date, a.Status FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID JOIN CLINIC c ON c.ID = a.CID JOIN VACCINE v ON v.ID = r.VID WHERE r.PID = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Select appointments with user ID: " + error.message);
            return res.status(404).send(error.message);
        }
        //console.log(results);
        res.status(200).send(results);
    });
});

//UPDATE Appointment Status
router.put("/appointments/:id/:status", (req, res) => {

    connection.query('SELECT r.PID FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID WHERE a.RID = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Find Patient ID of appointment: " + error.message);
            return res.status(404).send(error.message);
        }

        if (results.length == 0) {
            return res.status(404).send(error.message);           
        } else {
            let status = "waiting";

            if (req.params.status === "accept") {
                status = "Accepted";
            } else if (req.params.status === "reject") {
                status = "Rejected";
            } else {
                return res.status(404).send("Error Status Change");
            }

            connection.query('UPDATE APPOINTMENT SET Status = ? WHERE RID = ?', [status, req.params.id], function (error, results, fields) {
                if (error) {
                    console.log("Update appointment to accept: " + error.message);
                    return res.status(404).send(error.message);
                }
                res.status(200).send("Appointment Status Changed.");
            });
        }
    });
});

// Show Vaccines
router.get('/vaccines', (req, res) => {
    connection.query("SELECT * FROM VACCINE", function (error, result, fields) {
        if (error) {
            console.log("Get vaccine list: " + error.message);
            return res.status(404).send(error.message);
        }
        // console.log(result);
        res.status(200).send(result);
    });
});

// Create Vaccine
router.post("/vaccines/create/:id", (req, res) => {
    connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            //console.log("Search Admin: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("User is not Admin!");
        }
        connection.query('SELECT * FROM `VACCINE` WHERE `Name` = ?', [req.body.vaccinename], function (error, results, fields) {
            if (error) {
                console.log("Select vaccine with name: " + error.message);
                return res.status(404).send(error.message);
            }
            if (results.length == 0) {
                connection.query('INSERT INTO VACCINE SET ?', {Name: req.body.vaccinename, Advisery: req.body.advisory, URL: req.body.URL, Description: req.body.description, CreaterID: req.params.id}, function (error, results, fields) {
                    if (error) {
                        console.log("Vaccine creation: " + error.message);
                        return res.status(404).send(error.message);
                    }
                    res.status(200).send("Vaccine Added");
                });
            } else {
                // res.status(404).send('Email already Taken');
                return res.status(404).send('Name already Taken');
            }
        });
    });
});

// Remove Offered Vaccine
router.delete("/vaccines/delete/:id/:userID", async(req, res) => {

    connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.params.userID], function (error, results, fields) {
        if (error) {
            console.log("Search Admin: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("User is not Admin!");
        }

        connection.query('DELETE FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, result, fields) {
            if (error) {
                console.log("DELETE vaccine with ID: " + error.message);
                return res.status(404).send(error.message);
            }
            if (result.affectedRows >= 1) {
                res.status(200).send("Vaccine Deleted");
            } else {
                return res.status(404).send(error.message);
            }
        });
    });
});

// Edit Vaccine
router.put("/vaccines/edit/:id",(req, res) => {
    connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Search Admin: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("User is not Admin!");
        }

        connection.query('UPDATE VACCINE SET Name = ?, Advisery = ?, Description = ?, URL = ? WHERE ID = ?', [req.body.vaccinename, req.body.advisory, req.body.description, req.body.URL, req.body.id], function (error, results, fields) {
            if (error) {
                console.log("Update vaccine with new information: " + error.message);
                return res.status(404).send(error.message);
            }
            res.status(200).send("Vaccine Updated");
        });
    });
});

// Request Appointment 
router.post("/appointments/request/:v_id/:userID", (req, res) => {
    connection.query('SELECT * FROM `PATIENT` WHERE `ID` = ?', [req.params.userID], function (error, results, fields) {
        if (error) {
            console.log("Search User: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("Can't find user");
        }
        const user = results[0];

        // Get the clinic ID of clinics that offer the vacine and are on the same city as user
        connection.query('SELECT c.ID FROM VACCINE v JOIN VACCINE_SUPPORT s ON v.ID = s.VID JOIN CLINIC c ON c.ID = s.CID WHERE v.ID = ? AND c.City = ?', [req.params.v_id, user.City], function (error, results, fields) {
            if (error) {
                console.log("Select vaccine ID of all conditions: " + error.message);
                return res.status(404).send(error.message);
            }

            // If no clinic serve this
            if (results.length == 0) {
                return res.status(404).send("No clinic that serve this");
            }

            let selectClinicIndex = Math.floor((Math.random() * (results.length)) + 0);

            let c_id = results[selectClinicIndex].ID;

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();

            today = mm + '/' + dd + '/' + yyyy;
            
            connection.query('INSERT INTO REQUEST_APPOINTMENT SET ?', {Date: today, PID: user.ID, VID: req.params.v_id}, function (error, results, fields) {
                if (error) {
                    console.log("Request appointment creation: " + error.message);
                    return res.status(404).send(error.message);
                }

                let requestID = results.insertId;
                
                // 5 days in future
                let appointment_date = new Date();
                appointment_date.setDate(appointment_date.getDate() + 5);
                
                let d = String(appointment_date.getDate()).padStart(2, '0');
                let y = appointment_date.getFullYear();
                
                let month = new Array();
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";
                var m = month[appointment_date.getMonth()];

                let newDate = m + " " + d + ", " + y;

                // console.log(newDate);

                connection.query('INSERT INTO APPOINTMENT SET ?', {RID: requestID, Date: newDate, Status: "waiting", CID: c_id}, function (error, results, fields) {
                    if (error) {
                        console.log("Appointment creation: " + error.message);
                        return res.status(404).send(error.message);
                    }
                    res.status(200).send("Appointment created!");
                });
            });
        });
    });
});

module.exports = router;