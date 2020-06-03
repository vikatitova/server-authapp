const AuthService = require('../services/auth-service');
const AvatarService = require('../services/avatar-service');
const instanceAuthService = new AuthService();
const instanceAvatarService = new AvatarService();

class AuthController {
    signup = async (req, res) => {
        try {
            const { email, password } = req.body;
            await instanceAuthService.signup({ email, password });
            res.status(201).send({ message: 'User was created' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };
    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, customer } = await instanceAuthService.login({
                email,
                password,
            });
            const dataUrl = instanceAvatarService.getAvatar(
                customer.avatar_img
            );

            res.status(201).send({
                token,
                email,
                path: dataUrl,
                message: 'Successfully logged in',
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    };
}

module.exports = AuthController;
