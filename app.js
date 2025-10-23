import * as Auth from './authModule.js';
import * as EmployeeDb from './employeeDbModule.js';
import * as AddEmployee from './addEmployeeModule.js';
import * as EditEmployee from './editEmployeeModule.js';
import * as DeleteEmployee from './deleteEmployeeModule.js';
import * as SearchEmployee from './searchEmployeeModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';
import * as Salary from './salaryModule.js';
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

    console.log('Elements:', { loginForm, registerForm, registerDiv, switchToLogin }); // Debug elements

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

    // Listener cho login form
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

    // Listener cho registerBtn (từ login → register) - THÊM MỚI
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            console.log('Switch to register clicked!');
            showRegister();
        });
    }

    // Listener cho logout
    if (logout) {
        logout.addEventListener('click', () => {
            Auth.logout();
            showLogin();
        });
    }

    // Listener cho menu
    if (menu) {
        menu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.module) {
                e.preventDefault();
                const moduleName = e.target.dataset.module;
                content.innerHTML = '';
                modules[moduleName].init(content);
            }
        });
    }

    // Listener cho register form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            console.log('Register form submit fired!'); // Debug
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
    }

    // Listener cho switchToLogin (từ register → login)
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => {
            console.log('Switch to login clicked!');
            showLogin();
        });
    }

    // Init default data
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
        if (loginDiv) loginDiv.style.display = 'none';
        if (registerDiv) registerDiv.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';  // Hiển thị dashboard
        if (content) content.innerHTML = '';  // Clear trước khi load
        if (modules['searchEmployee']) modules['searchEmployee'].init(content);  // Load nội dung
    }

    function showLogin() {
        console.log('Calling showLogin'); // Debug thêm
        if (dashboard) dashboard.style.display = 'none';  // Ẩn dashboard
        if (content) content.innerHTML = '';  // Clear content
        if (loginDiv) loginDiv.style.display = 'block';
        if (registerDiv) registerDiv.style.display = 'none';
        if (loginError) loginError.textContent = '';
    }

    function showRegister() {
        console.log('Calling showRegister');
        if (dashboard) dashboard.style.display = 'none';  // Ẩn dashboard
        if (content) content.innerHTML = '';  // Clear content
        if (loginDiv) loginDiv.style.display = 'none';
        if (registerDiv) registerDiv.style.display = 'block';
        if (regError) regError.textContent = '';
    }

    // Hàm ẩn menu trên trang đăng ký (giữ nguyên, nhưng check selector đúng nếu có .sidebar)
    function hideMenuOnRegister() {
        const currentPath = window.location.pathname; // Lấy path hiện tại, ví dụ '/register'
        const menu = document.querySelector('#menu'); // Sửa selector thành #menu (thay vì .sidebar)
        
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

document.addEventListener('DOMContentLoaded', initApp);
