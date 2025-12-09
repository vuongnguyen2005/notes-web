// API Base URL
const API_URL = '/api';

// State management
let authToken = localStorage.getItem('token') || null;
let currentNoteId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showNotesScreen();
        loadNotes();
    } else {
        showAuthScreen();
    }
});

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Show/Hide screens
function showAuthScreen() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('notesScreen').classList.add('hidden');
}

function showNotesScreen() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('notesScreen').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Authentication functions
async function register() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            showToast('✅ Đăng ký thành công! Hãy đăng nhập.', 'success');
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            showLogin();
        }
    } catch (err) {
        showToast('Lỗi kết nối server!', 'error');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            authToken = data.token;
            localStorage.setItem('token', authToken);
            localStorage.setItem('userEmail', email);

            showToast('✅ Đăng nhập thành công!', 'success');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';

            showNotesScreen();
            document.getElementById('userEmail').textContent = email;
            loadNotes();
        }
    } catch (err) {
        showToast('Lỗi kết nối server!', 'error');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    showToast('Đã đăng xuất!', 'success');
    showAuthScreen();
    showLogin();
}

// Notes CRUD operations
async function loadNotes() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        document.getElementById('userEmail').textContent = userEmail;
    }

    try {
        const res = await fetch(`${API_URL}/notes`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const notes = await res.json();

        if (notes.error) {
            showToast(notes.error, 'error');
            if (notes.error.includes('token')) {
                logout();
            }
            return;
        }

        displayNotes(notes);
    } catch (err) {
        showToast('Lỗi khi tải ghi chú!', 'error');
    }
}

function displayNotes(notes) {
    const notesList = document.getElementById('notesList');

    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-white/60 text-lg">📝 Chưa có ghi chú nào. Hãy tạo ghi chú đầu tiên!</p>
            </div>
        `;
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-card glass-dark rounded-2xl p-6 animate-fade-in">
            <h3 class="text-xl font-bold text-white mb-3">${escapeHtml(note.title)}</h3>
            <p class="text-white/80 mb-4 line-clamp-3">${escapeHtml(note.content)}</p>
            <div class="text-white/50 text-sm mb-4">
                📅 ${formatDate(note.createdAt)}
            </div>
            <div class="flex gap-2">
                <button onclick="editNote('${note._id}', '${escapeHtml(note.title)}', '${escapeHtml(note.content)}')" 
                    class="flex-1 bg-blue-500/30 hover:bg-blue-500/50 text-white py-2 rounded-lg font-medium transition">
                    ✏️ Sửa
                </button>
                <button onclick="shareNote('${note._id}')" 
                    class="flex-1 bg-green-500/30 hover:bg-green-500/50 text-white py-2 rounded-lg font-medium transition">
                    🔗 Share
                </button>
                <button onclick="deleteNote('${note._id}')" 
                    class="flex-1 bg-red-500/30 hover:bg-red-500/50 text-white py-2 rounded-lg font-medium transition">
                    🗑️ Xóa
                </button>
            </div>
        </div>
    `).join('');
}

async function createNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (!title || !content) {
        showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung!', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, content })
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            showToast('✅ Tạo ghi chú thành công!', 'success');
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            loadNotes();
        }
    } catch (err) {
        showToast('Lỗi khi tạo ghi chú!', 'error');
    }
}

function editNote(id, title, content) {
    currentNoteId = id;
    document.getElementById('editTitle').value = unescapeHtml(title);
    document.getElementById('editContent').value = unescapeHtml(content);
    document.getElementById('editModal').classList.add('active');
}

async function saveEdit() {
    const title = document.getElementById('editTitle').value.trim();
    const content = document.getElementById('editContent').value.trim();

    if (!title || !content) {
        showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung!', 'error');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/notes/${currentNoteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, content })
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            showToast('✅ Cập nhật ghi chú thành công!', 'success');
            closeEditModal();
            loadNotes();
        }
    } catch (err) {
        showToast('Lỗi khi cập nhật ghi chú!', 'error');
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentNoteId = null;
}

async function deleteNote(id) {
    if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            showToast('✅ Xóa ghi chú thành công!', 'success');
            loadNotes();
        }
    } catch (err) {
        showToast('Lỗi khi xóa ghi chú!', 'error');
    }
}

async function shareNote(id) {
    try {
        const res = await fetch(`${API_URL}/notes/share/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await res.json();

        if (data.error) {
            showToast(data.error, 'error');
        } else {
            // Copy link to clipboard
            navigator.clipboard.writeText(data.link).then(() => {
                showToast('🔗 Link chia sẻ đã được copy!', 'success');
            }).catch(() => {
                // Fallback: show link in prompt
                prompt('Link chia sẻ:', data.link);
            });
        }
    } catch (err) {
        showToast('Lỗi khi tạo link chia sẻ!', 'error');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Hôm nay';
    } else if (diffDays === 1) {
        return 'Hôm qua';
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        return date.toLocaleDateString('vi-VN');
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function unescapeHtml(text) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
}

// Close modal when clicking outside
document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target.id === 'editModal') {
        closeEditModal();
    }
});

// Handle Enter key for login/register
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

document.getElementById('registerPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') register();
});
