// ...existing code...
import * as Auth from './authModule.js';
import * as EmployeeDb from './employeeDbModule.js';
import * as AddEmployee from './addEmployeeModule.js';
import * as EditEmployee from './editEmployeeModule.js';
import * as DeleteEmployee from './deleteEmployeeModule.js';
import * as SearchEmployee from './SearchEmployeeModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';
import * as Salary from './SalaryModule.js';
import * as Attendance from './attendanceModule.js';
import * as Leave from './leaveModule.js';
import * as Performance from './performanceModule.js';

const modules = {
    addEmployee: AddEmployee,
    editEmployee: EditEmployee,
    deleteEmployee: DeleteEmployee,
    searchEmployee: SearchEmployee,
    department: Department,
    position: Position,
    salary: Salary,
    attendance: Attendance,
    leave: Leave,
    performance: Performance
};

function initApp() {
    console.log('initApp được gọi'); // Debug: Xem initApp có chạy không
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const logout = document.getElementById('logout');
    const menu = document.getElementById('menu');
    const content = document.getElementById('content');
    const loginDiv = document.getElementById('login-form');
    const dashboard = document.getElementById('dashboard');
    const registerForm = document.getElementById('registerForm');
    const registerDiv = document.getElementById('register-form');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginError = document.getElementById('login-error');
    const regError = document.getElementById('reg-error');

    console.log('Elements:', { loginForm, registerForm, registerDiv, switchToLogin }); // 
    if (dashboard) {
        dashboard.style.display = 'none';
        content.innerHTML = ''; // Clear bất kỳ nội dung nào nếu module load sớm
    }

    if (Auth.isLoggedIn()) {
        console.log('Đã login, show dashboard');
        showDashboard();
    } else {
        console.log('Chưa login, show register');
        showRegister();
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        loginError.textContent = '';
        try {
            await Auth.login(username, password);
            showDashboard();
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    registerBtn.style.display = 'none'; // Ẩn vì dùng form register riêng

    logout.addEventListener('click', () => {
        Auth.logout();
        showLogin();
    });

    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.module) {
            e.preventDefault();
            const moduleName = e.target.dataset.module;
            content.innerHTML = '';
            modules[moduleName].init(content);
        }
    });
    registerForm.addEventListener('submit', async (e) => {
        console.log('Register form submit fired!'); // Xem event có chạy không
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;
        regError.textContent = '';
        try {
            await Auth.register(username, password, confirmPassword);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            showLogin();
        } catch (error) {
            regError.textContent = error.message;
        }
    });

    switchToLogin.addEventListener('click', () => {
        console.log('Switch to login clicked!');
        showLogin();
    });

    EmployeeDb.initDefaultData();
    Department.initDefaultData();
    Position.initDefaultData();
    Attendance.initDefaultData();
    Leave.initDefaultData();
    Performance.initDefaultData();

    window.refreshDashboard = function () {
        const currentModule = content.querySelector('form') ? 'searchEmployee' : null; // Giả sử refresh search nếu đang ở dashboard
        if (currentModule) {
            content.innerHTML = '';
            modules[currentModule].init(content);
        } else {
            showDashboard(); // Default refresh full dashboard
        }
    };

    function showDashboard() {
        console.log('Calling showDashboard');
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'none';
        dashboard.style.display = 'block';  // Hiển thị dashboard
        content.innerHTML = '';  // Clear trước khi load
        modules['searchEmployee'].init(content);  // Load nội dung
    }
    function showLogin() {
        console.log('Calling showLogin');
        dashboard.style.display = 'none';  // Ẩn dashboard
        content.innerHTML = '';  // Clear content
        loginDiv.style.display = 'block';
        registerDiv.style.display = 'none';
        loginError.textContent = '';
    }
    function showRegister() {
        console.log('Calling showRegister');
        dashboard.style.display = 'none';  // Ẩn dashboard
        content.innerHTML = '';  // Clear content
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'block';
        regError.textContent = '';
    }
    // Hàm ẩn menu trên trang đăng ký
function hideMenuOnRegister() {
    const currentPath = window.location.pathname; // Lấy path hiện tại, ví dụ '/register'
    const menu = document.querySelector('.sidebar'); // Thay '.sidebar' bằng selector thực tế của menu
    
    if (currentPath.includes('/register') || document.body.classList.contains('register-page')) {
        if (menu) {
            menu.style.display = 'none';
        }
        // Thêm class để body full-width nếu cần
        document.body.classList.add('no-menu');
    } else {
        // Hiện menu lại nếu không phải trang đăng ký
        if (menu) {
            menu.style.display = 'block'; // Hoặc giá trị gốc
        }
        document.body.classList.remove('no-menu');
    }
}


document.addEventListener('DOMContentLoaded', hideMenuOnRegister);
}
// ...existing code...
document.addEventListener('DOMContentLoaded', initApp);

