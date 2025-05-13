export const adminRequired = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        console.log("usuario en el middleware admin", req.user)
        return res.status(403).json(["Access denied: Admins only"]);
    }
    next();
};
