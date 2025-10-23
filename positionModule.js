export function initDefaultData() {
    if (!localStorage.getItem('positions')) {
        const defaults = [
            { id: 1, title: 'Nhà phát triển', description: 'Phát triển phần mềm', salaryBase: 50000 },
            { id: 2, title: 'Quản lý', description: 'Quản lý đội nhóm', salaryBase: 60000 },
            { id: 3, title: 'Phân tích viên', description: 'Phân tích dữ liệu', salaryBase: 55000 }
        ];
        localStorage.setItem('positions', JSON.stringify(defaults));
    }
}

export function getAllPositions() {
    return JSON.parse(localStorage.getItem('positions')) || [];
}

export function getPositionById(id) {
    return getAllPositions().find(p => p.id === id);
}

export async function addPosition(title, desc) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const positions = getAllPositions();
    const id = Math.max(...positions.map(p => p.id), 0) + 1;
    positions.push({ id, title, description: desc, salaryBase: 0 });
    savePositions(positions);
}

export async function editPosition(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    let positions = getAllPositions();
    positions = positions.map(p => p.id === id ? { ...p, ...updates } : p);
    savePositions(positions);
}

export async function deletePosition(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    let positions = getAllPositions();
    positions = positions.filter(p => p.id !== id);
    savePositions(positions);
}

function savePositions(positions) {
    localStorage.setItem('positions', JSON.stringify(positions));
}

export function init(content) {
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>ID</th><th>Tiêu đề</th><th>Mô tả</th><th>Hành động</th></tr></thead><tbody></tbody>';
    const tbody = table.querySelector('tbody');
    refreshTable();

    const addForm = document.createElement('form');
    addForm.innerHTML = `
        <h2>Quản lý Vị trí</h2>
        <input type="text" id="posTitle" placeholder="Tiêu đề" required>
        <input type="text" id="posDesc" placeholder="Mô tả" required>
        <button type="submit">Thêm</button>
    `;

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('posTitle').value.trim();
        const desc = document.getElementById('posDesc').value.trim();
        if (title && desc) {
            await addPosition(title, desc);
            refreshTable();
            addForm.reset();
        }
    });

    function refreshTable() {
        tbody.innerHTML = '';
        getAllPositions().forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${p.id}</td><td>${p.title}</td><td>${p.description}</td><td></td>`;
            const actions = row.querySelector('td:last-child');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Sửa';
            editBtn.addEventListener('click', async () => {
                const newTitle = prompt('Tiêu đề mới', p.title);
                const newDesc = prompt('Mô tả mới', p.description);
                if (newTitle && newDesc) {
                    await editPosition(p.id, { title: newTitle, description: newDesc });
                    refreshTable();
                }
            });

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Xóa';
            delBtn.addEventListener('click', async () => {
                if (confirm('Xóa vị trí?')) {
                    await deletePosition(p.id);
                    refreshTable();
                }
            });

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);
            tbody.appendChild(row);
        });
    }

    content.appendChild(addForm);
    content.appendChild(table);
}