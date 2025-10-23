import * as EmployeeDb from './employeeDbModule.js';

export function calculateNetSalary(employee) {
    return employee.salary + employee.bonus - employee.deduction;
}

export function generatePayrollReport() {
    const employees = EmployeeDb.getAllEmployees();
    return employees.map(emp => ({
        ...emp,
        netSalary: calculateNetSalary(emp)
    }));
}

export function init(content) {
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>ID</th><th>Tên</th><th>Lương</th><th>Thưởng</th><th>Khấu trừ</th><th>Lương ròng</th><th>Hành động</th></tr></thead><tbody></tbody>';
    const tbody = table.querySelector('tbody');
    refreshTable();

    function refreshTable() {
        tbody.innerHTML = '';
        const report = generatePayrollReport();
        report.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${emp.id}</td><td>${emp.name}</td><td>${emp.salary}</td><td>${emp.bonus}</td><td>${emp.deduction}</td><td>${emp.netSalary}</td><td></td>`;
            const actions = row.querySelector('td:last-child');

            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Cập nhật Thưởng/Khấu trừ';
            updateBtn.addEventListener('click', () => {
                const bonus = parseFloat(prompt('Thưởng mới', emp.bonus));
                const deduction = parseFloat(prompt('Khấu trừ mới', emp.deduction));
                if (!isNaN(bonus) && !isNaN(deduction)) {
                    const updated = { ...emp, bonus, deduction };
                    EmployeeDb.updateEmployee(updated);
                    refreshTable();
                }
            });

            actions.appendChild(updateBtn);
            tbody.appendChild(row);
        });
    }

    content.appendChild(table);
}