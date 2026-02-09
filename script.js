// Toastr Configuration
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

// DOM Elements
const hamburger = document.getElementById('hamburger');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const todayBtn = document.getElementById('todayBtn');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthHeader = document.getElementById('currentMonthHeader');
const eventsList = document.getElementById('eventsList');
const menuButtons = document.querySelectorAll('.menu-btn');
const calendarSwipeArea = document.getElementById('calendarSwipeArea');
const eventsSwipeArea = document.getElementById('eventsSwipeArea');
const eventsSection = document.getElementById('eventsSection');
const closeEvents = document.getElementById('closeEvents');
const eventsDate = document.getElementById('eventsDate');
const taskModal = document.getElementById('taskModal');
const taskList = document.getElementById('taskList');
const taskDate = document.getElementById('taskDate');
const closeTaskModal = document.getElementById('closeTaskModal');
const saveTasksBtn = document.getElementById('saveTasksBtn');
const addEventModal = document.getElementById('addEventModal');
const closeEventModal = document.getElementById('closeEventModal');
const saveEventBtn = document.getElementById('saveEventBtn');
const manageTasksModal = document.getElementById('manageTasksModal');
const closeManageTasksModal = document.getElementById('closeManageTasksModal');
const dailyTasksList = document.getElementById('dailyTasksList');
const newDailyTask = document.getElementById('newDailyTask');
const addDailyTaskBtn = document.getElementById('addDailyTaskBtn');
const reportCardView = document.getElementById('reportCardView');
const closeReportView = document.getElementById('closeReportView');
const reportCards = document.getElementById('reportCards');
const reportMonth = document.getElementById('reportMonth');
const settingsView = document.getElementById('settingsView');
const closeSettingsView = document.getElementById('closeSettingsView');
const modalOverlay = document.getElementById('modalOverlay');
const fileImport = document.getElementById('fileImport');
const githubInfoModal = document.getElementById('githubInfoModal');
const closeInfoModal = document.getElementById('closeInfoModal');
const taskDetailsModal = document.getElementById('taskDetailsModal');
const closeTaskDetailsModal = document.getElementById('closeTaskDetailsModal');
const detailsDate = document.getElementById('detailsDate');
const detailsTaskList = document.getElementById('detailsTaskList');

// GitHub Gist Elements
const githubToken = document.getElementById('githubToken');
const gistId = document.getElementById('gistId');
const syncToGist = document.getElementById('syncToGist');
const importFromGist = document.getElementById('importFromGist');
const exportData = document.getElementById('exportData');
const importData = document.getElementById('importData');
const clearData = document.getElementById('clearData');
const syncStatus = document.getElementById('syncStatus');
const statusText = document.getElementById('statusText');
const lastSync = document.getElementById('lastSync');
const infoButtons = document.querySelectorAll('.info-btn');

// Calendar State
const today = new Date();
let currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today);
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const swipeThreshold = 50;

// Data Storage Keys
const STORAGE_KEYS = {
    EVENTS: 'smartCalendar_events_v3',
    DAILY_TASKS: 'smartCalendar_daily_tasks_v3',
    TASK_COMPLETIONS: 'smartCalendar_task_completions_v3',
    REPORTS: 'smartCalendar_reports_v3',
    SETTINGS: 'smartCalendar_settings_v3',
    GIST_INFO: 'smartCalendar_gist_info_v3'
};

// Data Manager
class DataManager {
    constructor() {
        this.events = this.loadData(STORAGE_KEYS.EVENTS) || {};
        this.dailyTasks = this.loadData(STORAGE_KEYS.DAILY_TASKS) || [];
        this.taskCompletions = this.loadData(STORAGE_KEYS.TASK_COMPLETIONS) || {};
        this.reports = this.loadData(STORAGE_KEYS.REPORTS) || {};
        this.settings = this.loadData(STORAGE_KEYS.SETTINGS) || {};
        this.gistInfo = this.loadData(STORAGE_KEYS.GIST_INFO) || {};
        
        // Initialize with sample events for current month if empty
        this.initializeSampleEvents();
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    saveAll() {
        this.saveData(STORAGE_KEYS.EVENTS, this.events);
        this.saveData(STORAGE_KEYS.DAILY_TASKS, this.dailyTasks);
        this.saveData(STORAGE_KEYS.TASK_COMPLETIONS, this.taskCompletions);
        this.saveData(STORAGE_KEYS.REPORTS, this.reports);
        this.saveData(STORAGE_KEYS.SETTINGS, this.settings);
        this.saveData(STORAGE_KEYS.GIST_INFO, this.gistInfo);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    initializeSampleEvents() {
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        const dateKey = this.formatDate(today);
        
        if (!this.events[dateKey]) {
            this.events[dateKey] = [
                {
                    id: this.generateId(),
                    title: 'Today\'s Event',
                    type: 'ME',
                    time: '10:00 AM',
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveData(STORAGE_KEYS.EVENTS, this.events);
        }
    }

    // Daily Tasks Management
    addDailyTask(title) {
        const task = {
            id: this.generateId(),
            title: title.trim(),
            createdAt: new Date().toISOString(),
            active: true
        };
        
        this.dailyTasks.push(task);
        this.saveData(STORAGE_KEYS.DAILY_TASKS, this.dailyTasks);
        return task;
    }

    deleteDailyTask(taskId) {
        const index = this.dailyTasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            this.dailyTasks.splice(index, 1);
            this.saveData(STORAGE_KEYS.DAILY_TASKS, this.dailyTasks);
            return true;
        }
        return false;
    }

    getDailyTasksForDate(date) {
        const dateKey = this.formatDate(date);
        const completions = this.taskCompletions[dateKey] || {};
        
        return this.dailyTasks.map(task => ({
            ...task,
            completed: completions[task.id] || false
        }));
    }

    saveTaskCompletions(date, completions) {
        const dateKey = this.formatDate(date);
        this.taskCompletions[dateKey] = completions;
        this.saveData(STORAGE_KEYS.TASK_COMPLETIONS, this.taskCompletions);
        
        // Update report
        this.updateReportForDate(date);
    }

    updateReportForDate(date) {
        const dateKey = this.formatDate(date);
        const tasks = this.getDailyTasksForDate(date);
        const completions = this.taskCompletions[dateKey] || {};
        
        const totalTasks = tasks.length;
        const completedTasks = Object.values(completions).filter(v => v).length;
        const allCompleted = totalTasks > 0 && completedTasks === totalTasks;
        
        this.reports[dateKey] = {
            date: dateKey,
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            allCompleted: allCompleted,
            updatedAt: new Date().toISOString()
        };
        
        this.saveData(STORAGE_KEYS.REPORTS, this.reports);
        return this.reports[dateKey];
    }

    getReportForDate(date) {
        const dateKey = this.formatDate(date);
        return this.reports[dateKey] || null;
    }

    // Events Management
    addEvent(eventData) {
        const dateKey = eventData.date;
        if (!this.events[dateKey]) {
            this.events[dateKey] = [];
        }
        
        const event = {
            id: this.generateId(),
            title: eventData.title,
            type: eventData.type || 'OT',
            time: eventData.time || 'All Day',
            createdAt: new Date().toISOString()
        };
        
        this.events[dateKey].push(event);
        this.saveData(STORAGE_KEYS.EVENTS, this.events);
        return event;
    }

    deleteEvent(dateKey, eventId) {
        if (this.events[dateKey]) {
            const index = this.events[dateKey].findIndex(event => event.id === eventId);
            if (index !== -1) {
                this.events[dateKey].splice(index, 1);
                // If no events left for this date, delete the date key
                if (this.events[dateKey].length === 0) {
                    delete this.events[dateKey];
                }
                this.saveData(STORAGE_KEYS.EVENTS, this.events);
                return true;
            }
        }
        return false;
    }

    getAllEventsForMonth(month, year) {
        const result = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = this.formatDate(date);
            
            if (this.events[dateKey]) {
                this.events[dateKey].forEach(event => {
                    result.push({
                        date: dateKey,
                        data: event
                    });
                });
            }
        }
        
        return result;
    }

    // Export/Import
    exportAllData() {
        return {
            events: this.events,
            dailyTasks: this.dailyTasks,
            taskCompletions: this.taskCompletions,
            reports: this.reports,
            settings: this.settings,
            gistInfo: this.gistInfo,
            exportedAt: new Date().toISOString(),
            version: '3.0'
        };
    }

    importData(data) {
        if (data.events) this.events = data.events;
        if (data.dailyTasks) this.dailyTasks = data.dailyTasks;
        if (data.taskCompletions) this.taskCompletions = data.taskCompletions;
        if (data.reports) this.reports = data.reports;
        if (data.settings) this.settings = data.settings;
        if (data.gistInfo) this.gistInfo = data.gistInfo;
        
        this.saveAll();
        return true;
    }

    clearAllData() {
        this.events = {};
        this.dailyTasks = [];
        this.taskCompletions = {};
        this.reports = {};
        this.settings = {};
        this.gistInfo = {};
        this.saveAll();
    }

    // GitHub Gist Sync
    async syncToGitHubGist(token, gistId = null) {
        try {
            const data = this.exportAllData();
            const filename = 'daily-planner-data.json';
            const content = JSON.stringify(data, null, 2);
            
            const gistData = {
                files: {
                    [filename]: {
                        content: content
                    }
                },
                description: `Daily Planner Data - ${new Date().toLocaleDateString()}`,
                public: false
            };
            
            let url = 'https://api.github.com/gists';
            let method = 'POST';
            
            if (gistId) {
                url = `https://api.github.com/gists/${gistId}`;
                method = 'PATCH';
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `GitHub API error: ${response.status}`);
            }
            
            const result = await response.json();
            this.gistInfo = {
                id: result.id,
                url: result.html_url,
                lastSynced: new Date().toISOString(),
                token: token.substring(0, 4) + '...' + token.substring(token.length - 4)
            };
            
            this.saveData(STORAGE_KEYS.GIST_INFO, this.gistInfo);
            return result;
            
        } catch (error) {
            console.error('GitHub sync error:', error);
            throw error;
        }
    }

    async importFromGitHubGist(token, gistId) {
        try {
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `GitHub API error: ${response.status}`);
            }
            
            const gist = await response.json();
            const files = Object.values(gist.files);
            
            if (files.length > 0) {
                const file = files[0];
                const data = JSON.parse(file.content);
                
                if (data.version !== '3.0') {
                    throw new Error('Invalid data format. Please use data exported from version 3.0');
                }
                
                this.importData(data);
                
                this.gistInfo = {
                    id: gist.id,
                    url: gist.html_url,
                    lastSynced: new Date().toISOString(),
                    token: token.substring(0, 4) + '...' + token.substring(token.length - 4)
                };
                
                this.saveData(STORAGE_KEYS.GIST_INFO, this.gistInfo);
                return data;
            } else {
                throw new Error('No files found in Gist');
            }
            
        } catch (error) {
            console.error('GitHub import error:', error);
            throw error;
        }
    }
}

// Initialize Data Manager
const dataManager = new DataManager();

// Initialize the calendar
function initCalendar() {
    renderCalendar();
    setupEventListeners();
    updateSyncStatus();
    populateMonthSelect();
}

// Render the calendar for current month
function renderCalendar() {
    calendarGrid.innerHTML = '';
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    
    currentMonthHeader.textContent = `${currentMonth} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentDate.getMonth(), 1);
    const lastDay = new Date(currentYear, currentDate.getMonth() + 1, 0);
    const totalDays = lastDay.getDate();
    
    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const prevMonthLastDay = new Date(currentYear, currentDate.getMonth(), 0).getDate();
    
    let currentDay = 0;
    
    for (let week = 0; week < 6; week++) {
        const weekRow = document.createElement('div');
        weekRow.className = 'week-row';
        
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            let dayNumber;
            let isOtherMonth = false;
            let dayDate;
            
            if (week === 0 && dayOfWeek < firstDayIndex) {
                dayNumber = prevMonthLastDay - firstDayIndex + dayOfWeek + 1;
                isOtherMonth = true;
                dayDate = new Date(currentYear, currentDate.getMonth() - 1, dayNumber);
            } else if (currentDay < totalDays) {
                currentDay++;
                dayNumber = currentDay;
                dayDate = new Date(currentYear, currentDate.getMonth(), dayNumber);
            } else {
                dayNumber = currentDay - totalDays + 1;
                currentDay++;
                isOtherMonth = true;
                dayDate = new Date(currentYear, currentDate.getMonth() + 1, dayNumber);
            }
            
            if (isOtherMonth) {
                dayElement.classList.add('other-month');
            }
            
            // Check if it's today
            const isToday = !isOtherMonth && 
                           dayDate.getDate() === today.getDate() && 
                           dayDate.getMonth() === today.getMonth() && 
                           dayDate.getFullYear() === today.getFullYear();
            
            // Check if it has events
            const dateKey = dataManager.formatDate(dayDate);
            const hasEvent = dataManager.events[dateKey] && dataManager.events[dateKey].length > 0;
            
            // Check if it has tasks (only for today)
            const hasTask = isToday && dataManager.dailyTasks.length > 0;
            
            if (isToday) {
                dayElement.classList.add('today');
            }
            
            if (hasEvent) {
                dayElement.classList.add('has-event');
            }
            
            if (hasTask) {
                dayElement.classList.add('has-task');
            }
            
            // Only make today clickable
            if (isToday) {
                dayElement.addEventListener('click', () => {
                    showTaskModal(dayDate);
                });
            }
            
            dayElement.innerHTML = `<div class="day-number">${dayNumber}</div>`;
            weekRow.appendChild(dayElement);
        }
        
        calendarGrid.appendChild(weekRow);
        
        if (currentDay >= totalDays && week > 3) {
            break;
        }
    }
}

// Show all events for month
function showAllEventsForMonth() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const allEvents = dataManager.getAllEventsForMonth(month, year);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    eventsDate.textContent = `${monthNames[month]} ${year} - All Events`;
    eventsList.innerHTML = '';
    
    if (allEvents.length === 0) {
        eventsList.innerHTML = `
            <div class="no-events">
                <i class="far fa-calendar-times"></i>
                <p>No events for this month</p>
            </div>
        `;
    } else {
        const groupedByDate = {};
        allEvents.forEach(item => {
            if (!groupedByDate[item.date]) {
                groupedByDate[item.date] = [];
            }
            groupedByDate[item.date].push(item);
        });
        
        const sortedDates = Object.keys(groupedByDate).sort();
        
        sortedDates.forEach(dateKey => {
            const date = new Date(dateKey);
            const dateHeader = document.createElement('div');
            dateHeader.className = 'date-header';
            dateHeader.innerHTML = `
                <div class="events-date">
                    <i class="fas fa-calendar-day"></i>
                    ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}
                </div>
            `;
            eventsList.appendChild(dateHeader);
            
            groupedByDate[dateKey].forEach(item => {
                const event = item.data;
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-icon ${event.type.toLowerCase()}">${event.type}</div>
                    <div class="event-details">
                        <div class="event-title">${event.title}</div>
                        <div class="event-time">
                            <i class="far fa-clock"></i> ${event.time}
                        </div>
                    </div>
                    <button class="delete-event-btn" data-date="${dateKey}" data-event-id="${event.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                // Add delete event listener
                const deleteBtn = eventItem.querySelector('.delete-event-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteEvent(dateKey, event.id);
                });
                
                eventsList.appendChild(eventItem);
            });
        });
    }
    
    showEventsSection();
}

// Delete event function
function deleteEvent(dateKey, eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const success = dataManager.deleteEvent(dateKey, eventId);
        if (success) {
            toastr.success('Event deleted successfully!');
            // Refresh events list
            showAllEventsForMonth();
            // Re-render calendar to update event markers
            renderCalendar();
        } else {
            toastr.error('Failed to delete event');
        }
    }
}

// Show events section
function showEventsSection() {
    eventsSection.classList.add('active');
    overlay.classList.add('active');
}

// Hide events section
function hideEventsSection() {
    eventsSection.classList.remove('active');
    overlay.classList.remove('active');
}

// Show task modal (only for today)
function showTaskModal(date) {
    const dateKey = dataManager.formatDate(date);
    const todayKey = dataManager.formatDate(today);
    
    if (dateKey !== todayKey) {
        toastr.info('Task checklist is only available for today.');
        return;
    }
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    taskDate.textContent = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    loadTasksForDate(date);
    
    taskModal.classList.add('active');
    modalOverlay.classList.add('active');
}

// Load tasks for date
function loadTasksForDate(date) {
    const tasks = dataManager.getDailyTasksForDate(date);
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-tasks"></i>
                <p>No daily tasks set. Add tasks from Manage Tasks menu!</p>
            </div>
        `;
    } else {
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                </div>
            `;
            
            const checkbox = taskItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => {
                taskItem.classList.toggle('task-completed', checkbox.checked);
            });
            
            taskList.appendChild(taskItem);
        });
    }
}

// Save tasks completion with animation and feedback
function saveTasksCompletion() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const completions = {};
    
    checkboxes.forEach(checkbox => {
        const taskId = checkbox.getAttribute('data-task-id');
        completions[taskId] = checkbox.checked;
    });
    
    // Save button animation
    const saveBtn = document.getElementById('saveTasksBtn');
    saveBtn.classList.add('saving');
    saveBtn.innerHTML = '<i class="fas fa-check-circle"></i> Saving...';
    
    setTimeout(() => {
        dataManager.saveTaskCompletions(today, completions);
        
        saveBtn.classList.remove('saving');
        saveBtn.classList.add('saved');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Saved Successfully!';
        
        // Show success message
        showSaveSuccessMessage();
        
        // Reset button after 2 seconds
        setTimeout(() => {
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Tasks';
            hideTaskModal();
        }, 2000);
        
    }, 500);
}

// Show save success message
function showSaveSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'tasks-saved-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Tasks saved successfully!</span>
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

// Hide task modal
function hideTaskModal() {
    taskModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Show task details modal
function showTaskDetailsModal(date) {
    const dateKey = dataManager.formatDate(date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    detailsDate.textContent = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    loadTaskDetailsForDate(date);
    
    taskDetailsModal.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide task details modal
function hideTaskDetailsModal() {
    taskDetailsModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Load task details for date
function loadTaskDetailsForDate(date) {
    const tasks = dataManager.getDailyTasksForDate(date);
    const dateKey = dataManager.formatDate(date);
    const completions = dataManager.taskCompletions[dateKey] || {};
    
    detailsTaskList.innerHTML = '';
    
    if (tasks.length === 0) {
        detailsTaskList.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-tasks"></i>
                <p>No tasks for this day</p>
            </div>
        `;
    } else {
        tasks.forEach(task => {
            const isCompleted = completions[task.id] || false;
            const taskItem = document.createElement('div');
            taskItem.className = `details-task-item ${isCompleted ? 'completed' : 'pending'}`;
            taskItem.innerHTML = `
                <div class="details-task-title">${task.title}</div>
                <div class="details-task-status ${isCompleted ? 'completed' : 'pending'}">
                    ${isCompleted ? 'Completed' : 'Pending'}
                </div>
            `;
            detailsTaskList.appendChild(taskItem);
        });
    }
}

// Show add event modal
function showAddEventModal() {
    document.getElementById('eventDate').value = dataManager.formatDate(today);
    addEventModal.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide add event modal
function hideAddEventModal() {
    addEventModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Save new event
function saveNewEvent() {
    const eventTitle = document.getElementById('eventTitle').value.trim();
    const eventDate = document.getElementById('eventDate').value;
    const eventType = document.getElementById('eventType').value;
    const eventTime = document.getElementById('eventTime').value.trim() || 'All Day';
    
    if (!eventTitle) {
        toastr.error('Please enter event title');
        return;
    }
    
    if (!eventDate) {
        toastr.error('Please select date');
        return;
    }
    
    const eventData = {
        title: eventTitle,
        date: eventDate,
        type: eventType,
        time: eventTime
    };
    
    dataManager.addEvent(eventData);
    renderCalendar();
    hideAddEventModal();
    
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTime').value = '';
    
    toastr.success('Event added successfully!');
}

// Show manage tasks modal
function showManageTasksModal() {
    loadDailyTasks();
    manageTasksModal.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide manage tasks modal
function hideManageTasksModal() {
    manageTasksModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Load daily tasks
function loadDailyTasks() {
    dailyTasksList.innerHTML = '';
    
    if (dataManager.dailyTasks.length === 0) {
        dailyTasksList.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-tasks"></i>
                <p>No daily tasks yet. Add your first task below!</p>
            </div>
        `;
    } else {
        dataManager.dailyTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'daily-task-item';
            taskItem.innerHTML = `
                <div class="daily-task-content">${task.title}</div>
                <button class="delete-task-btn" data-task-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            const deleteBtn = taskItem.querySelector('.delete-task-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Delete this task from all days?')) {
                    dataManager.deleteDailyTask(task.id);
                    loadDailyTasks();
                    toastr.success('Task deleted!');
                }
            });
            
            dailyTasksList.appendChild(taskItem);
        });
    }
}

// Add new daily task
function addNewDailyTask() {
    const title = newDailyTask.value.trim();
    if (!title) {
        toastr.error('Please enter task title');
        return;
    }
    
    dataManager.addDailyTask(title);
    loadDailyTasks();
    newDailyTask.value = '';
    toastr.success('Daily task added!');
}

// Show report card view
function showReportCardView() {
    loadReportCards();
    reportCardView.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide report card view
function hideReportCardView() {
    reportCardView.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Populate month select
function populateMonthSelect() {
    const months = [];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Add current and previous 3 months
    for (let i = 3; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const value = `${date.getFullYear()}-${date.getMonth() + 1}`;
        months.push({ name: monthName, value: value });
    }
    
    reportMonth.innerHTML = months.map(m => 
        `<option value="${m.value}">${m.name}</option>`
    ).join('');
    
    // Set current month as default
    reportMonth.value = `${currentYear}-${currentMonth + 1}`;
}

// Load report cards
function loadReportCards() {
    const [year, month] = reportMonth.value.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    
    reportCards.innerHTML = '';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateKey = dataManager.formatDate(date);
        const report = dataManager.getReportForDate(date);
        
        // Don't show future dates
        if (date > today) continue;
        
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card';
        
        if (!report || report.totalTasks === 0) {
            reportCard.classList.add('red-mark');
            reportCard.innerHTML = `
                <div class="report-card-header">
                    <div class="report-date">${day} ${monthNames[month - 1]}</div>
                    <div class="report-status missed">No Tasks</div>
                </div>
                <div class="report-tasks">
                    <div class="report-task">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>No tasks were set for this day</span>
                    </div>
                </div>
            `;
        } else {
            const cardClass = report.allCompleted ? 'green-mark' : 'red-mark';
            const statusClass = report.allCompleted ? 'completed' : 'pending';
            const statusText = report.allCompleted ? 'Completed' : 'Pending';
            
            reportCard.className = `report-card ${cardClass}`;
            reportCard.innerHTML = `
                <div class="report-card-header">
                    <div class="report-date">${day} ${monthNames[month - 1]}</div>
                    <div class="report-status ${statusClass}">${statusText}</div>
                </div>
                <div class="report-tasks">
                    <div class="report-task ${report.allCompleted ? 'completed' : ''}">
                        <i class="fas ${report.allCompleted ? 'fa-check-circle' : 'fa-tasks'}"></i>
                        <span>Tasks: ${report.completedTasks}/${report.totalTasks} completed</span>
                    </div>
                    <div class="report-task">
                        <i class="fas fa-info-circle"></i>
                        <span>Click to view task details</span>
                    </div>
                </div>
            `;
            
            // Add click event to show task details
            reportCard.addEventListener('click', () => {
                showTaskDetailsModal(date);
            });
        }
        
        reportCards.appendChild(reportCard);
    }
}

// Show settings view
function showSettingsView() {
    updateSyncStatus();
    settingsView.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide settings view
function hideSettingsView() {
    settingsView.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Update sync status display with better visibility
function updateSyncStatus() {
    if (dataManager.gistInfo.id) {
        statusText.textContent = '✅ Connected to GitHub Gist';
        statusText.style.color = '#2ecc71';
        
        const lastSynced = new Date(dataManager.gistInfo.lastSynced);
        lastSync.textContent = `🕒 Last synced: ${lastSynced.toLocaleDateString()} ${lastSynced.toLocaleTimeString()}`;
        lastSync.style.color = '#3498db';
        
        // Show masked token
        if (githubToken) {
            githubToken.value = dataManager.gistInfo.token || '••••••••••';
        }
        if (gistId) {
            gistId.value = dataManager.gistInfo.id;
        }
    } else {
        statusText.textContent = '❌ Not connected to GitHub';
        statusText.style.color = '#e74c3c';
        lastSync.textContent = 'Click "Sync to Gist" to backup your data';
        lastSync.style.color = '#7f8c8d';
    }
}

// Show GitHub info modal
function showGitHubInfoModal() {
    githubInfoModal.classList.add('active');
    modalOverlay.classList.add('active');
}

// Hide GitHub info modal
function hideGitHubInfoModal() {
    githubInfoModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// Sync to GitHub Gist
async function syncToGitHub() {
    const token = githubToken.value.trim();
    const gistIdValue = gistId.value.trim();
    
    if (!token) {
        toastr.error('Please enter GitHub Personal Token');
        return;
    }
    
    if (token.includes('...')) {
        toastr.error('Please enter a new token. The masked token cannot be used.');
        return;
    }
    
    try {
        statusText.textContent = 'Syncing with GitHub...';
        statusText.style.color = '#3498db';
        
        await dataManager.syncToGitHubGist(token, gistIdValue || null);
        
        updateSyncStatus();
        toastr.success('Data synced to GitHub Gist successfully!');
        
    } catch (error) {
        statusText.textContent = 'Sync failed';
        statusText.style.color = '#e74c3c';
        toastr.error(`Sync failed: ${error.message}`);
    }
}

// Import from GitHub Gist
async function importFromGitHub() {
    const token = githubToken.value.trim();
    const gistIdValue = gistId.value.trim();
    
    if (!token) {
        toastr.error('Please enter GitHub Personal Token');
        return;
    }
    
    if (!gistIdValue) {
        toastr.error('Please enter Gist ID');
        return;
    }
    
    if (token.includes('...')) {
        toastr.error('Please enter a new token. The masked token cannot be used.');
        return;
    }
    
    try {
        statusText.textContent = 'Importing from GitHub...';
        statusText.style.color = '#3498db';
        
        await dataManager.importFromGitHubGist(token, gistIdValue);
        
        updateSyncStatus();
        renderCalendar();
        toastr.success('Data imported from GitHub Gist successfully!');
        
    } catch (error) {
        statusText.textContent = 'Import failed';
        statusText.style.color = '#e74c3c';
        toastr.error(`Import failed: ${error.message}`);
    }
}

// Export data
function exportDataToFile() {
    const data = dataManager.exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toastr.success('Data exported successfully!');
}

// Import data from file
function importDataFromFile() {
    fileImport.click();
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This includes events, tasks, and reports. This action cannot be undone.')) {
        dataManager.clearAllData();
        renderCalendar();
        updateSyncStatus();
        toastr.success('All data cleared successfully!');
    }
}

// Navigation functions
function goToToday() {
    currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedDate = new Date(today);
    renderCalendar();
    
    hideEventsSection();
    hideTaskModal();
    hideAddEventModal();
    hideManageTasksModal();
    hideReportCardView();
    hideSettingsView();
    hideTaskDetailsModal();
    
    toastr.success('Returned to today');
}

function goToPrevMonth() {
    calendarGrid.classList.add('month-transition');
    
    setTimeout(() => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        renderCalendar();
        
        calendarGrid.classList.remove('month-transition');
        calendarGrid.classList.add('month-transition-in');
        
        setTimeout(() => {
            calendarGrid.classList.remove('month-transition-in');
        }, 300);
    }, 300);
}

function goToNextMonth() {
    calendarGrid.classList.add('month-transition');
    
    setTimeout(() => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        renderCalendar();
        
        calendarGrid.classList.remove('month-transition');
        calendarGrid.classList.add('month-transition-in');
        
        setTimeout(() => {
            calendarGrid.classList.remove('month-transition-in');
        }, 300);
    }, 300);
}

// Handle swipe gestures
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
            goToPrevMonth();
        } else {
            goToNextMonth();
        }
    }
    
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > swipeThreshold) {
        if (deltaY < 0 && touchStartY > window.innerHeight * 0.7) {
            showAllEventsForMonth();
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    hamburger.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        if (eventsSection.classList.contains('active')) {
            hideEventsSection();
        } else {
            overlay.classList.remove('active');
        }
    });
    
    modalOverlay.addEventListener('click', () => {
        hideTaskModal();
        hideAddEventModal();
        hideManageTasksModal();
        hideReportCardView();
        hideSettingsView();
        hideGitHubInfoModal();
        hideTaskDetailsModal();
    });
    
    // Today button
    todayBtn.addEventListener('click', goToToday);
    
    // Close events
    closeEvents.addEventListener('click', hideEventsSection);
    
    // Menu buttons
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.getAttribute('data-view');
            
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            switch(view) {
                case 'calendar':
                    break;
                case 'report':
                    showReportCardView();
                    break;
                case 'add-event':
                    showAddEventModal();
                    break;
                case 'add-task':
                    showManageTasksModal();
                    break;
                case 'settings':
                    showSettingsView();
                    break;
            }
        });
    });
    
    // Task modal
    closeTaskModal.addEventListener('click', hideTaskModal);
    saveTasksBtn.addEventListener('click', saveTasksCompletion);
    
    // Task details modal
    closeTaskDetailsModal.addEventListener('click', hideTaskDetailsModal);
    
    // Event modal
    closeEventModal.addEventListener('click', hideAddEventModal);
    saveEventBtn.addEventListener('click', saveNewEvent);
    
    // Manage tasks modal
    closeManageTasksModal.addEventListener('click', hideManageTasksModal);
    addDailyTaskBtn.addEventListener('click', addNewDailyTask);
    
    newDailyTask.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewDailyTask();
        }
    });
    
    // Report card
    closeReportView.addEventListener('click', hideReportCardView);
    reportMonth.addEventListener('change', loadReportCards);
    
    // Settings
    closeSettingsView.addEventListener('click', hideSettingsView);
    
    // GitHub info buttons
    infoButtons.forEach(btn => {
        btn.addEventListener('click', showGitHubInfoModal);
    });
    
    closeInfoModal.addEventListener('click', hideGitHubInfoModal);
    
    // GitHub sync buttons
    syncToGist.addEventListener('click', syncToGitHub);
    importFromGist.addEventListener('click', importFromGitHub);
    
    // Data management buttons
    exportData.addEventListener('click', exportDataToFile);
    importData.addEventListener('click', importDataFromFile);
    clearData.addEventListener('click', clearAllData);
    
    // File import
    fileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.version !== '3.0') {
                    toastr.error('Invalid backup file. Please use backup from version 3.0');
                    return;
                }
                
                dataManager.importData(data);
                renderCalendar();
                updateSyncStatus();
                toastr.success('Data imported successfully!');
            } catch (error) {
                toastr.error('Invalid JSON file');
            }
        };
        reader.readAsText(file);
        fileImport.value = '';
    });
    
    // Swipe gestures
    calendarSwipeArea.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    calendarSwipeArea.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    // Mouse swipe simulation
    let mouseDownX = 0;
    let mouseDownY = 0;
    let isMouseDown = false;
    
    calendarSwipeArea.addEventListener('mousedown', e => {
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        isMouseDown = true;
    });
    
    calendarSwipeArea.addEventListener('mouseup', e => {
        if (!isMouseDown) return;
        
        const mouseUpX = e.clientX;
        const mouseUpY = e.clientY;
        const deltaX = mouseUpX - mouseDownX;
        const deltaY = mouseUpY - mouseDownY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                goToPrevMonth();
            } else {
                goToNextMonth();
            }
        }
        
        isMouseDown = false;
    });
    
    calendarSwipeArea.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
    
    // Events swipe area
    eventsSwipeArea.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    eventsSwipeArea.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const deltaY = touchEndY - touchStartY;
        if (deltaY < -swipeThreshold) {
            showAllEventsForMonth();
        }
    }, { passive: true });
    
    eventsSwipeArea.addEventListener('mousedown', e => {
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        isMouseDown = true;
    });
    
    eventsSwipeArea.addEventListener('mouseup', e => {
        if (!isMouseDown) return;
        
        const mouseUpX = e.clientX;
        const mouseUpY = e.clientY;
        const deltaY = mouseUpY - mouseDownY;
        
        if (deltaY < -50) {
            showAllEventsForMonth();
        }
        
        isMouseDown = false;
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 't', 'T', 'Escape'].includes(e.key)) {
            if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                e.preventDefault();
            }
        }
        
        if (e.key === 'ArrowLeft') goToPrevMonth();
        else if (e.key === 'ArrowRight') goToNextMonth();
        else if (e.key === 'ArrowUp') showAllEventsForMonth();
        else if (e.key === 'ArrowDown') hideEventsSection();
        else if (e.key === 't' || e.key === 'T') goToToday();
        else if (e.key === 'Escape') {
            sidebar.classList.remove('active');
            hideEventsSection();
            hideTaskModal();
            hideAddEventModal();
            hideManageTasksModal();
            hideReportCardView();
            hideSettingsView();
            hideGitHubInfoModal();
            hideTaskDetailsModal();
            overlay.classList.remove('active');
            modalOverlay.classList.remove('active');
        }
    });
    
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.calendar-section') || e.target.closest('.swipe-indicator-container')) {
            e.preventDefault();
        }
    });
    
    // Window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderCalendar();
        }, 250);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initCalendar);
