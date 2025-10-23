import * as EmployeeDb from './employeeDbModule.js';
import * as Department from './departmentModule.js';
import * as Position from './positionModule.js';

export function init(content) {
  content.innerHTML = '';

  const depts = Department.getAllDepartments() || [];
  const positions = Position.getAllPositions() || [];
  console.log('Departments loaded:', depts); // Debug: Kiểm tra data trong console
  console.log('Positions loaded:', positions);

  const form = document.createElement('form');
  form.innerHTML = `
    <h2>Thêm Nhân Viên</h2>
    <label for="ten">Tên nhân viên:</label>
    <input type="text" id="ten" placeholder="Tên" required>
    <div id="nameError" style="color: red; font-size: 0.9em;"></div>
    
    <label for="MaPhongBan">Phòng ban:</label>
    <select id="MaPhongBan" required>
      <option value="">-- Chọn phòng ban --</option>
      ${depts.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
    </select>
    <div id="deptError" style="color: red; font-size: 0.9em;"></div>
    
    <label for="positionId">Chức vụ:</label>
    <select id="positionId" required>
      <option value="">-- Chọn chức vụ --</option>
      ${positions.map(p => `<option value="${p.id}">${p.title || p.name}</option>`).join('')}
    </select>
    <div id="posError" style="color: red; font-size: 0.9em;"></div>
    
    <label for="luong">Lương:</label>
    <input type="number" id="luong" placeholder="Lương" required min="1" step="0.01">
    <div id="salaryError" style="color: red; font-size: 0.9em;"></div>
    
    <label for="hireDate">Ngày vào làm:</label>
    <input type="date" id="hireDate" required>
    <div id="dateError" style="color: red; font-size: 0.9em;"></div>
    
    <button type="submit">Thêm Nhân Viên</button>
  `;

  content.appendChild(form);

  const nameInput = document.getElementById('ten');
  const deptSelect = document.getElementById('MaPhongBan');
  const posSelect = document.getElementById('positionId');
  const salaryInput = document.getElementById('luong');
  const dateInput = document.getElementById('hireDate');

  nameInput.addEventListener('input', validateName);
  deptSelect.addEventListener('change', validateDept);
  posSelect.addEventListener('change', validatePos);
  salaryInput.addEventListener('input', validateSalary);
  dateInput.addEventListener('change', validateDate);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Submit triggered'); // Debug

    if (!validateName() || !validateDept() || !validatePos() || !validateSalary() || !validateDate()) {
      alert('Vui lòng sửa các lỗi hiển thị dưới mỗi trường nhập!');
      return;
    }

    const name = nameInput.value.trim();
    const departmentId = parseInt(deptSelect.value);
    const positionId = parseInt(posSelect.value);
    const salary = parseFloat(salaryInput.value);
    const hireDate = dateInput.value;

    console.log('Employee data:', { name, departmentId, positionId, salary, hireDate }); // Debug

    const employee = { name, departmentId, positionId, salary, hireDate, bonus: 0, deduction: 0 };
    try {
      EmployeeDb.addEmployee(employee);
      alert('Thêm nhân viên thành công!');
      if (window.refreshDashboard) {
        window.refreshDashboard();
      }
      form.reset();
      clearAllErrors();
    } catch (error) {
      console.error('Add employee error:', error); // Debug
      alert('Thêm thất bại: ' + error.message);
    }
  });

  function clearAllErrors() {
    ['nameError', 'deptError', 'posError', 'salaryError', 'dateError'].forEach(id => {
      const errorEl = document.getElementById(id);
      if (errorEl) errorEl.textContent = '';
    });
  }

  function validateName() {
    const value = nameInput.value.trim();
    const error = document.getElementById('nameError');
    if (!value) {
      error.textContent = 'Tên không được để trống!';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function validateDept() {
    const value = deptSelect.value;
    const error = document.getElementById('deptError');
    if (!value) {
      error.textContent = 'Vui lòng chọn phòng ban!';
      return false;
    }
    const depts = Department.getAllDepartments() || [];
    if (!depts.find(d => d.id == value)) {
      error.textContent = 'Phòng ban không hợp lệ!';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function validatePos() {
    const value = posSelect.value;
    const error = document.getElementById('posError');
    if (!value) {
      error.textContent = 'Vui lòng chọn chức vụ!';
      return false;
    }
    const positions = Position.getAllPositions() || [];
    if (!positions.find(p => p.id == value)) {
      error.textContent = 'Chức vụ không hợp lệ!';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function validateSalary() {
    const value = parseFloat(salaryInput.value);
    const error = document.getElementById('salaryError');
    if (isNaN(value) || value <= 0) {
      error.textContent = 'Lương phải là số lớn hơn 0!';
      return false;
    }
    error.textContent = '';
    return true;
  }

  function validateDate() {
    const value = dateInput.value;
    const error = document.getElementById('dateError');
    if (!value || isNaN(Date.parse(value))) {
      error.textContent = 'Ngày vào làm không hợp lệ!';
      return false;
    }
    error.textContent = '';
    return true;
  }
}