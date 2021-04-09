//All the middleware goes here
const middlewareObj = {
    isLoggedIn: (req, res, next) => {
        if(req.session.user) {
            return next();
        } 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    },
    isUser: (req, res, next) => {
        if(req.session.user) {
            if (req.session.user.Admin === false) {
                return next();
            } else {
                req.flash("error", "Only a user can access this, you are a admin");
                res.redirect("/");
            }
        } 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    },
    isAdmin: async (req, res, next) => {
        if (req.session.user) {
            if (req.session.user.Admin === true) {
                return next();
            } else {
                req.flash("error", "You need to be an admin to do that");
                res.redirect("/");
            }
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("/login");
        }
    }
};

module.exports = middlewareObj;