const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.response.unauthorized(res, 'Usuario no autenticado');
        }

        if (!roles.includes(req.user.role)) {
            return res.response.forbidden(res, 'Permisos insuficientes', {
                requiredRoles: roles,
                userRole: req.user.role
            });
        }
        next();
    };
};

export default checkRole;