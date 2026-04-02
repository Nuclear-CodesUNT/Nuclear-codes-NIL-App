import User from '../models/User.js';

const getAllUsers = async () => {

    return await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
};

const getUserById = async(id: string) => {
    return await User.findById(id).select('-password');
}

export { getAllUsers, getUserById };

