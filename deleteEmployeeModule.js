import * as EmployeeDb from './employeeDbModule.js';

export function init(content) {
    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Xóa Nhân Viên</h2>
        <input type="number" id="deleteId" placeholder="ID Nhân Viên" required>
        <button type="submit">Xóa</button>
    `;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('deleteId').value);
        const emp = EmployeeDb.getEmployeeById(id);
        if (emp && confirm(`Xóa ${emp.name}?`)) {
            EmployeeDb.deleteEmployee(id);
            alert('Đã xóa nhân viên');
            form.reset();
        } else {
            alert('Không tìm thấy nhân viên hoặc đã hủy');
        }
    });

    content.appendChild(form);
}