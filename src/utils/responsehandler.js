class ResponseHandler {
    constructor(req) {
        this.req = req;
    }

    buildResponse(code, status, message, data = null, error = null, meta = {}) {
        const response = {
            code,
            status,
            message,
            data,
            error,
            meta: {
                timestamp: new Date().toISOString(),
                path: this.req ? this.req.originalUrl : null,
                ...meta
            }
        };

        if (data === null) delete response.data;
        if (error === null) delete response.error;

        return response;
    }

    success(res, message, data = null, meta = {}) {
        const response = this.buildResponse(200, 'success', message, data, null, meta);
        return res.status(200).json(response);
    }

    created(res, message, data = null, meta = {}) {
        const response = this.buildResponse(201, 'success', message, data, null, meta);
        return res.status(201).json(response);
    }

    badRequest(res, message = 'Bad request', error = null, meta = {}) {
        const response = this.buildResponse(400, 'error', message, null, error, meta);
        return res.status(400).json(response);
    }

    unauthorized(res, message = 'Unauthorized', error = null, meta = {}) {
        const response = this.buildResponse(401, 'error', message, null, error, meta);
        return res.status(401).json(response);
    }

    forbidden(res, message = 'Forbidden', error = null, meta = {}) {
        const response = this.buildResponse(403, 'error', message, null, error, meta);
        return res.status(403).json(response);
    }

    notFound(res, message = 'Not found', error = null, meta = {}) {
        const response = this.buildResponse(404, 'error', message, null, error, meta);
        return res.status(404).json(response);
    }

    serverError(res, message = 'Internal server error', error = null, meta = {}) {
        const safeError = process.env.NODE_ENV === 'development' ? error : null;
        const response = this.buildResponse(500, 'error', message, null, safeError, meta);
        return res.status(500).json(response);
    }

    loginSuccess(res, token, user, message = 'Login successful') {
        return this.success(res, message, {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
}

// Middleware para inyectar ResponseHandler
export const responseMiddleware = (req, res, next) => {
    res.response = new ResponseHandler(req);
    next();
};

// Exportar la clase también por si se necesita directamente
export { ResponseHandler };

// Export default para importaciones por defecto
export default { ResponseHandler, responseMiddleware };