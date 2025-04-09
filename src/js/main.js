async function fetchTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
  
    const incompleteContainer = document.getElementById('incomplete-tasks');
    const completeContainer = document.getElementById('completed-tasks');
    incompleteContainer.innerHTML = '<h2>Nepabeigts Tasks</h2>';
    completeContainer.innerHTML = '<h2>Pabeigts Tasks</h2>';
  
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task-item');
      taskElement.classList.add(task.status === 'pabeigts' ? 'complete' : 'incomplete');
  
      taskElement.innerHTML = `
        <div class="task-content">
          <strong>${task.title}</strong><br>
          ${task.description}<br>
          <small>
            Izveidots: ${new Date(task.createdAt).toLocaleString()}<br>
            Atjaunots: ${new Date(task.updatedAt).toLocaleString()}
          </small>
        </div>
        <div class="task-buttons">
          ${task.status === 'nepabeigts' ? `<button class="complete-btn" data-id="${task._id}">Pabeigt</button>` : ''}
          <button class="delete-btn" data-id="${task._id}">Dzēst</button>
        </div>
      `;
  
      if (task.status === 'nepabeigts') {
        incompleteContainer.appendChild(taskElement);
      } else {
        completeContainer.appendChild(taskElement);
      }
    });
  
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        await fetch(`/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
      });
    });
  
    document.querySelectorAll('.complete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        await fetch(`/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'pabeigts' })
        });
        fetchTasks();
      });
    });
}
  

async function addTask() {
  const title = document.getElementById('task-title').value.trim();
  const description = document.getElementById('task-description').value.trim();
  const status = document.getElementById('task-status').value;

  if (!title || !description) {
    alert('Lūdzu, aizpildiet visus laukus.');
    return;
  }

  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, status })
  });

  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-status').value = 'nepabeigts';

  fetchTasks();
}

document.getElementById('submit-task').addEventListener('click', addTask);


fetchTasks();
  