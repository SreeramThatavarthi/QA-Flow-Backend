const db = require('../models/db');

exports.read = (req, res) => {
    const userId = req.query.userId;
    db.user.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json({
            success: true,
            user: user
        });
    });
};

exports.update = (req, res) => {
    const { name, password, role, id } = req.body;
    console.log(req.user)
    db.user.findOne({ _id: id }, (err, user) => {
        console.log(err, user)
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (name) {
            user.name = name;
        }

        if (role) {
            user.role = role === "admin" ? "admin" : "user";
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json({
                success: true,
                user: updatedUser
            });
        });
    });
};



exports.deleteUser = (req, res) => {
    db.user.findByIdAndDelete(req.query.id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    })
}

exports.getAll = (req, res) => {
    db.user.find({}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Users not found'
            });
        } else {
            res.json({
                success: true,
                users: user
            });
        }
    })
}