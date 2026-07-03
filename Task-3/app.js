/* ==========================================================================
   TaskFlow Application Logic & State Management
   ========================================================================== */

// --- Application State ---
const state = {
  tasks: [],
  filter: 'all',      // 'all' | 'active' | 'completed'
  searchQuery: '',
  sortBy: 'createdAt' // 'createdAt' | 'dueDate' | 'priority'
};

// Cache for deleted tasks to allow "Undo" action
let deletedTaskCache = null;

// --- DOM Elements ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');

const searchInput = document.getElementById('search-input');
const filterTabsContainer = document.querySelector('.filter-tabs');
const filterTabs = document.querySelectorAll('.filter-tab');
const sortBySelect = document.getElementById('sort-by');

const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const itemsLeftSpan = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const toastContainer = document.getElementById('toast-container');

// --- Helper Functions ---

/**
 * Save current tasks to LocalStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(state.tasks));
}

/**
 * Load tasks from LocalStorage or initialize with samples
 */
function loadFromLocalStorage() {
  const storedTasks = localStorage.getItem('taskflow_tasks');
  if (storedTasks) {
    try {
      state.tasks = JSON.parse(storedTasks);
    } catch (e) {
      console.error('Error parsing stored tasks', e);
      state.tasks = [];
    }
  } else {
    // Default welcome/sample tasks
    const today = new Date().toISOString().split('T')[0];
    state.tasks = [
      {
        id: 'sample-1',
        text: '💼 Complete the Thrinex Task-3 logic and styling',
        category: 'Work',
        priority: 'High',
        dueDate: today,
        completed: false,
        createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: 'sample-2',
        text: '💡 Double-click on any task text to edit it in place',
        category: 'Ideas',
        priority: 'Medium',
        dueDate: '',
        completed: false,
        createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
      },
      {
        id: 'sample-3',
        text: '🛒 Get coffee beans and groceries',
        category: 'Shopping',
        priority: 'Low',
        dueDate: '',
        completed: true,
        createdAt: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
      }
    ];
    saveToLocalStorage();
  }
}

/**
 * Custom Toast Notifications with optional action callbacks
 */
function showToast(message, type = 'info', action = null) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSVG = '';
  if (type === 'success') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
  } else if (type === 'warning') {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`;
  } else {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.984l-.04.02-2.24 1.43a.75.75 0 11-.777-1.28l2.24-1.43zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${iconSVG}</span>
      <span class="toast-msg">${message}</span>
    </div>
  `;

  if (action) {
    const actionBtn = document.createElement('button');
    actionBtn.className = 'toast-action-btn';
    actionBtn.textContent = action.text;
    actionBtn.addEventListener('click', () => {
      action.callback();
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    });
    toast.appendChild(actionBtn);
  }

  toastContainer.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }
  }, 4500);
}

/**
 * Map priority names to numeric weights for sorting
 */
function getPriorityWeight(priority) {
  switch (priority) {
    case 'High': return 3;
    case 'Medium': return 2;
    case 'Low': return 1;
    default: return 0;
  }
}

/**
 * Format category name with an emoji
 */
function getCategoryEmoji(category) {
  switch (category) {
    case 'Work': return '💼';
    case 'Personal': return '👤';
    case 'Shopping': return '🛒';
    case 'Ideas': return '💡';
    default: return '📝';
  }
}

/**
 * Filter & Sort tasks based on state values
 */
function getFilteredAndSortedTasks() {
  let filtered = state.tasks.filter(task => {
    // 1. Status Filter
    if (state.filter === 'active' && task.completed) return false;
    if (state.filter === 'completed' && !task.completed) return false;

    // 2. Search query filter (case insensitive)
    if (state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase();
      const textMatch = task.text.toLowerCase().includes(query);
      const categoryMatch = task.category.toLowerCase().includes(query);
      return textMatch || categoryMatch;
    }

    return true;
  });

  // 3. Sorting
  filtered.sort((a, b) => {
    if (state.sortBy === 'createdAt') {
      // Newest tasks first
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (state.sortBy === 'dueDate') {
      // Tasks with due dates first, sorted ascending; no due date pushed to bottom
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (state.sortBy === 'priority') {
      // High priority first
      const weightA = getPriorityWeight(a.priority);
      const weightB = getPriorityWeight(b.priority);
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      // If priority is same, sort by created date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return filtered;
}

/**
 * Render the Task List in UI
 */
function render() {
  const filteredTasks = getFilteredAndSortedTasks();
  
  // Clear current elements
  taskList.innerHTML = '';

  // Toggle Empty State Visibility
  if (filteredTasks.length === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Populate list dynamically
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    
    // Setup classes
    li.className = `task-item ${task.priority.toLowerCase()}-priority`;
    if (task.completed) li.classList.add('completed');
    
    // Set custom data ID attribute
    li.setAttribute('data-id', task.id);

    // Format due date indicator
    let dueDateHTML = '';
    if (task.dueDate) {
      const isOverdue = !task.completed && (task.dueDate < todayStr);
      dueDateHTML = `
        <span class="task-date ${isOverdue ? 'overdue' : ''}">
          📅 ${task.dueDate} ${isOverdue ? '(Overdue)' : ''}
        </span>
      `;
    }

    li.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" data-action="toggle-complete" ${task.completed ? 'checked' : ''}>
        <span class="checkmark"></span>
      </label>
      <div class="task-details">
        <span class="task-text" data-action="edit-text">${escapeHTML(task.text)}</span>
        <div class="task-meta">
          <span class="badge badge-${task.category.toLowerCase()}">${getCategoryEmoji(task.category)} ${task.category}</span>
          <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
          ${dueDateHTML}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-icon btn-edit" data-action="edit" aria-label="Edit Task">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.08a4.5 4.5 0 0 1-2.052 1.238l-3.955 1.079 1.079-3.955a4.5 4.5 0 0 1 1.238-2.052l12.2-12.201ZM16.862 4.487 19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
        <button class="btn-icon btn-delete" data-action="delete" aria-label="Delete Task">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  // Update Footer Stats
  const activeTasksCount = state.tasks.filter(t => !t.completed).length;
  itemsLeftSpan.textContent = `${activeTasksCount} task${activeTasksCount === 1 ? '' : 's'} remaining`;

  // Disable clear completed button if no completed tasks exist
  const hasCompletedTasks = state.tasks.some(t => t.completed);
  clearCompletedBtn.disabled = !hasCompletedTasks;
  clearCompletedBtn.style.opacity = hasCompletedTasks ? '1' : '0.4';
  clearCompletedBtn.style.cursor = hasCompletedTasks ? 'pointer' : 'not-allowed';
}

/**
 * Escapes HTML characters to prevent XSS vulnerability
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// --- CRUD & State Modifiers ---

/**
 * Create a new task
 */
function addTask(text, category, priority, dueDate) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    category,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.push(newTask);
  saveToLocalStorage();
  render();
  showToast('Task added successfully', 'success');
}

/**
 * Toggle Completion Status of a task
 */
function toggleTaskCompletion(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveToLocalStorage();
    render();
    
    if (task.completed) {
      showToast('Task marked as completed', 'success');
    } else {
      showToast('Task marked as active', 'info');
    }
  }
}

/**
 * Enter inline editing mode for a task text element
 */
function startInlineEditing(taskItem, taskId) {
  const taskTextSpan = taskItem.querySelector('.task-text');
  if (!taskTextSpan || taskItem.classList.contains('editing')) return;

  taskItem.classList.add('editing');
  const currentText = taskTextSpan.textContent;

  // Create editing input element
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = currentText;
  input.maxLength = 120;
  
  // Replace span with input field
  taskTextSpan.replaceWith(input);
  input.focus();
  input.select();

  let committed = false;

  const commitEdit = (save) => {
    if (committed) return;
    committed = true;
    
    taskItem.classList.remove('editing');
    
    if (save) {
      const newText = input.value.trim();
      if (newText && newText !== currentText) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.text = newText;
          saveToLocalStorage();
          showToast('Task updated', 'success');
        }
      }
    }
    render();
  };

  // Save on blur
  input.addEventListener('blur', () => {
    commitEdit(true);
  });

  // Handle enter and escape keys
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      commitEdit(false); // cancel
    }
  });
}

/**
 * Delete a specific task, caching it for "Undo" functionality
 */
function deleteTask(id) {
  const index = state.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    const deletedTask = state.tasks[index];
    
    // Save to Cache
    deletedTaskCache = {
      task: deletedTask,
      index: index
    };

    // Remove from state
    state.tasks.splice(index, 1);
    saveToLocalStorage();
    render();

    // Show toast with Undo callback
    showToast('Task deleted', 'warning', {
      text: 'Undo',
      callback: () => {
        if (deletedTaskCache) {
          // Re-insert at original position
          state.tasks.splice(deletedTaskCache.index, 0, deletedTaskCache.task);
          saveToLocalStorage();
          render();
          deletedTaskCache = null;
          showToast('Deletion undone', 'success');
        }
      }
    });
  }
}

/**
 * Clear all completed tasks
 */
function clearCompleted() {
  const initialCount = state.tasks.length;
  state.tasks = state.tasks.filter(t => !t.completed);
  const clearedCount = initialCount - state.tasks.length;
  
  if (clearedCount > 0) {
    saveToLocalStorage();
    render();
    showToast(`Cleared ${clearedCount} completed task${clearedCount === 1 ? '' : 's'}`, 'info');
  }
}

// --- Event Listeners ---

// Form Submission listener
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const text = taskInput.value;
  const category = taskCategory.value;
  const priority = taskPriority.value;
  const dueDate = taskDueDate.value;

  if (text.trim() !== '') {
    addTask(text, category, priority, dueDate);
    
    // Reset Form Input text and Due Date selector (retain category/priority defaults)
    taskInput.value = '';
    taskDueDate.value = '';
  }
});

// Search input listener
searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  render();
});

// Sorting filter listener
sortBySelect.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  render();
});

// Filter Tabs delegation listener
filterTabsContainer.addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (tab) {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    state.filter = tab.getAttribute('data-filter');
    render();
  }
});

// Clear Completed button listener
clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

// --- Delegated Event Listeners on the Task List Container ---

// 1. Delegated Clicks (Complete Checkbox, Delete Button, Edit Button)
taskList.addEventListener('click', (e) => {
  const target = e.target;
  const taskItem = target.closest('.task-item');
  if (!taskItem) return;
  
  const id = taskItem.getAttribute('data-id');

  // Complete toggle click (triggered on the input checkbox or action wrapper)
  if (target.closest('[data-action="toggle-complete"]')) {
    toggleTaskCompletion(id);
    return;
  }

  // Delete task click
  if (target.closest('[data-action="delete"]')) {
    deleteTask(id);
    return;
  }

  // Edit task click
  if (target.closest('[data-action="edit"]')) {
    startInlineEditing(taskItem, id);
    return;
  }
});

// 2. Delegated Double-Clicks (Double click on task text enters inline editing mode)
taskList.addEventListener('dblclick', (e) => {
  const target = e.target;
  if (target.closest('[data-action="edit-text"]')) {
    const taskItem = target.closest('.task-item');
    if (taskItem) {
      const id = taskItem.getAttribute('data-id');
      startInlineEditing(taskItem, id);
    }
  }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  render();
});
