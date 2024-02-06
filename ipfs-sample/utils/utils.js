const bcrypt = require('bcryptjs');

const encrypt = async (key) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(key, salt);
}

// const decrypt = async () => {
//     return bcrypt.compare()
// }

module.exports = {
    encrypt,
};
