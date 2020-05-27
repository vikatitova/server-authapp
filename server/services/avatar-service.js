const fs = require('fs');
const path = require('path');

module.exports = class UserService {
    saveAvatar = async (filename, customer) => {
        customer.avatar_img = filename;
        customer.save();
    };

    getAvatar = (avatar_img) => {
        if (avatar_img) {
            const avatarPath = path.join(
                __dirname,
                `../../avatars/${avatar_img}`
            );
            try {
                const base64Image = fs.readFileSync(avatarPath, 'base64');
                return `data:image/jpeg;base64, ${base64Image}`;
            } catch (err) {
                return '';
            }
        }
        return '';
    };
};
