async function saveNote() {
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();
  if (!title || !content) {
    alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
    return;
  }
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  if (res.ok) {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    loadNotes();
  } else {
    alert('Lưu ghi chú thất bại!');
  }
}

async function loadNotes() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  const list = document.getElementById('note-list');
  list.innerHTML = '';
  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content}</div>
      <div class="note-actions">
        <span class="share-link" onclick="shareNote('${note._id}')">Share</span>
        <span style="margin-left:10px;cursor:pointer;color:red" onclick="deleteNote('${note._id}')">Delete</span>
      </div>
    `;
    list.appendChild(div);
  });
}

async function deleteNote(id) {
  if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
  await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

async function shareNote(id) {
  const res = await fetch(`/api/notes/share/${id}`);
  const data = await res.json();
  prompt('Link chia sẻ:', data.link);
}

window.onload = loadNotes;
