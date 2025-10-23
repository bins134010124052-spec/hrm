const generateSalt = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const createHasher = (salt) => {
    return (password) => {
        return btoa(password + salt);
    };
};

const validatePassword = (password) => {
    if (password.length < 6) {
        throw new Error('Password phải có ít nhất 6 ký tự');
    }
    if (password.includes(' ')) {
        throw new Error('Password không được chứa khoảng trắng');
    }
    return true;
};

export function register(username, password, confirmPassword) {
    if (!username || username.trim() === '') {
        throw new Error('Username không được rỗng');
    }
    if (password !== confirmPassword) {
        throw new Error('Password xác nhận không khớp');
    }
    validatePassword(password);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        throw new Error('Username đã tồn tại');
    }

    const salt = generateSalt();
    const hashed = createHasher(salt)(password);
    users.push({ username, password: hashed, salt });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công');
}

export async function login(username, password) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Delay 1.5 giây
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    if (!user) {
        throw new Error('Username hoặc password sai');
    }
    const hashed = createHasher(user.salt)(password);
    if (user.password !== hashed) {
        throw new Error('Username hoặc password sai');
    }
    const expiry = Date.now() + 3600000; // 1 giờ
    localStorage.setItem('session', JSON.stringify({ username, expiry }));
    return true;
}

export function logout() {
    localStorage.removeItem('session');
}

export function isLoggedIn() {
    const session = localStorage.getItem('session');
    if (!session) return false;
    const { expiry } = JSON.parse(session);
    return Date.now() < expiry;
}