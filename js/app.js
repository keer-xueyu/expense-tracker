(function() {
    'use strict';

    // ============ 配置 ============
    const CATEGORY_CONFIG = {
        '住': { icon: 'home', color: '#E8F5E9', bgColor: '#4CAF50', name: '住', iconColor: '#4CAF50', morandiColor: '#A8C5B5' },
        '食': { icon: 'food', color: '#FFF3E0', bgColor: '#FF9800', name: '餐饮美食', iconColor: '#FF9800', morandiColor: '#E0C4A8' },
        '衣饰': { icon: 'shopping', color: '#E3F2FD', bgColor: '#2196F3', name: '日用购物', iconColor: '#2196F3', morandiColor: '#9BB5CE' },
        '行': { icon: 'transport', color: '#FFF3E0', bgColor: '#FF9800', name: '交通出行', iconColor: '#FF9800', morandiColor: '#D5C9A8' },
        '美妆护肤': { icon: 'beauty', color: '#FCE4EC', bgColor: '#E91E63', name: '美妆护肤', iconColor: '#E91E63', morandiColor: '#D4A5A5' },
        '健康及学习': { icon: 'book', color: '#F3E5F5', bgColor: '#9C27B0', name: '学习健康', iconColor: '#9C27B0', morandiColor: '#B8A9C9' },
        '日用': { icon: 'daily', color: '#E3F2FD', bgColor: '#03A9F4', name: '日用品', iconColor: '#03A9F4', morandiColor: '#A5C4C4' },
        '家人及社交': { icon: 'social', color: '#FFEBEE', bgColor: '#F44336', name: '社交', iconColor: '#F44336', morandiColor: '#C9A9A9' }
    };

    const BUDGET = 10000;
    let expenseData = null;
    let categoryBarChart = null;
    let currentCalendarDate = new Date();
    let selectedStartDate = null;
    let selectedEndDate = null;
    let editingRecordId = null;
    let currentPeriodStart = null;
    let currentPeriodEnd = null;

    // ============ 用户认证系统 ============
    const DEFAULT_USER = {
        nickname: '记账用户',
        avatar: null
    };

    let currentUsername = null;
    let userInfo = { ...DEFAULT_USER };
    let isLoggedIn = false;
    let budget = 10000;

    function getLoginState() {
        try {
            const state = localStorage.getItem('loginState');
            if (state) return JSON.parse(state);
            return null;
        } catch (e) {
            return null;
        }
    }

    function setLoginState(username) {
        if (username) {
            localStorage.setItem('loginState', JSON.stringify({ username }));
        } else {
            localStorage.removeItem('loginState');
        }
    }

    function loadUserInfo() {
        try {
            const saved = localStorage.getItem(`account_${currentUsername}`);
            return saved ? JSON.parse(saved) : { ...DEFAULT_USER };
        } catch (e) {
            return { ...DEFAULT_USER };
        }
    }

    function saveUserInfo() {
        try {
            if (currentUsername) {
                const existing = localStorage.getItem(`account_${currentUsername}`);
                const account = existing ? JSON.parse(existing) : {};
                account.nickname = userInfo.nickname;
                account.avatar = userInfo.avatar;
                localStorage.setItem(`account_${currentUsername}`, JSON.stringify(account));
            }
        } catch (e) {
            console.error('Save user info failed:', e);
        }
    }

    function loadBudget() {
        try {
            const saved = localStorage.getItem(`budget_${currentUsername}`);
            return saved ? parseFloat(saved) : 10000;
        } catch (e) {
            return 10000;
        }
    }

    function saveBudget(amount) {
        try {
            if (currentUsername) {
                localStorage.setItem(`budget_${currentUsername}`, String(amount));
            }
        } catch (e) {
            console.error('Save budget failed:', e);
        }
    }

    function loadExpenseData() {
        try {
            const saved = localStorage.getItem(`expenseData_${currentUsername}`);
            if (saved) return JSON.parse(saved);
            return null;
        } catch (e) {
            return null;
        }
    }

    function saveExpenseData() {
        try {
            if (expenseData && currentUsername) {
                localStorage.setItem(`expenseData_${currentUsername}`, JSON.stringify(expenseData));
            }
        } catch (e) {
            console.error('Save expense data failed:', e);
        }
    }

    function createEmptyExpenseData() {
        return {
            records: [],
            category_totals: {},
            daily_totals: {},
            total_expense: 0,
            total_income: 0,
            avg_daily: 0,
            active_days: 0
        };
    }

    function login(username) {
        currentUsername = username;
        isLoggedIn = true;
        setLoginState(username);
        const account = loadUserInfo();
        userInfo = {
            nickname: account.nickname || account.username || '记账用户',
            avatar: account.avatar || null
        };
        budget = loadBudget();
        expenseData = loadExpenseData();
    }

    function logout() {
        currentUsername = null;
        isLoggedIn = false;
        budget = 10000;
        setLoginState(null);
        userInfo = { ...DEFAULT_USER };
        expenseData = null;
        showAuthModal();
    }

    function register(username, password) {
        const accountKey = `account_${username}`;
        if (localStorage.getItem(accountKey)) {
            return { success: false, message: '用户名已存在' };
        }
        const now = new Date();
        const registerDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const account = {
            username,
            password,
            nickname: username,
            avatar: null,
            registerDate
        };
        localStorage.setItem(accountKey, JSON.stringify(account));
        localStorage.setItem(`expenseData_${username}`, JSON.stringify(createEmptyExpenseData()));
        localStorage.setItem(`budget_${username}`, '10000');
        return { success: true, message: '注册成功' };
    }

    function verifyLogin(username, password) {
        try {
            const saved = localStorage.getItem(`account_${username}`);
            if (!saved) return false;
            const account = JSON.parse(saved);
            return account.password === password;
        } catch (e) {
            return false;
        }
    }

    // 兼容旧数据迁移
    function migrateLegacyData() {
        const legacyUserInfo = localStorage.getItem('userInfo');
        const legacyExpenseData = localStorage.getItem('expenseData');
        if (legacyUserInfo || legacyExpenseData) {
            const defaultUsername = 'default_user';
            if (!localStorage.getItem(`account_${defaultUsername}`)) {
                const info = legacyUserInfo ? JSON.parse(legacyUserInfo) : { ...DEFAULT_USER };
                const now = new Date();
                const registerDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                localStorage.setItem(`account_${defaultUsername}`, JSON.stringify({
                    username: defaultUsername,
                    password: '123456',
                    nickname: info.nickname || '记账用户',
                    avatar: info.avatar || null,
                    registerDate
                }));
                if (legacyExpenseData) {
                    localStorage.setItem(`expenseData_${defaultUsername}`, legacyExpenseData);
                }
                localStorage.setItem(`budget_${defaultUsername}`, '10000');
            }
            localStorage.removeItem('userInfo');
            localStorage.removeItem('expenseData');
            return defaultUsername;
        }
        return null;
    }

    // ============ 工具函数 ============
    function formatMoney(amount) {
        return parseFloat(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDateStr(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function formatDateTime(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dStr = date.toISOString().split('T')[0];
        const tStr = today.toISOString().split('T')[0];
        const yStr = yesterday.toISOString().split('T')[0];
        let datePart;
        if (dStr === tStr) datePart = '今天';
        else if (dStr === yStr) datePart = '昨天';
        else datePart = `${date.getMonth() + 1}-${date.getDate()}`;
        return `${datePart} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    function showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    // 注入 SVG 图标
    function injectIcons() {
        const iconMap = {
            'icon-calendar-header': 'calendar',
            'icon-arrow-header': 'arrowDown',
            'icon-eye': 'eye',
            'icon-mascot': 'heart',
            'icon-income': 'money',
            'icon-budget': 'budget',
            'icon-remaining': 'piggyBank',
            'icon-arrow-down': 'arrowDown',
            'icon-filter': 'filter',
            'icon-page-stats': 'chart',
            'icon-page-calendar': 'calendar',
            'icon-page-mine': 'user',
            'icon-chevron-left': 'chevronLeft',
            'icon-chevron-right': 'chevronRight',
            'icon-arrow-right': 'arrowRight',
            'icon-back-add': 'chevronLeft',
            'icon-save': 'check',
            'icon-info-calendar': 'calendar',
            'icon-info-note': 'note',
            'icon-camera': 'camera',
            'icon-edit': 'edit',
            'icon-acc-mail': 'mail',
            'icon-acc-phone': 'phone',
            'icon-acc-calendar': 'calendar',
            'icon-acc-chart': 'chart',
            'icon-acc-note': 'note',
            'icon-modal-close': 'close',
            'icon-modal-close-user': 'close',
            'icon-modal-close-new': 'close',
            'icon-modal-close-budget': 'close',
            'icon-nav-home': 'home',
            'icon-nav-stats': 'chart',
            'icon-nav-calendar': 'calendar',
            'icon-nav-mine': 'user',
            'icon-set-arrow-1': 'chevronRight',
            'icon-set-arrow-2': 'chevronRight',
            'icon-set-arrow-3': 'chevronRight',
            'icon-set-arrow-4': 'chevronRight'
        };
        
        for (const [id, iconName] of Object.entries(iconMap)) {
            const el = document.getElementById(id);
            if (el) el.innerHTML = getIcon(iconName, parseInt(getComputedStyle(el).width) || 20);
        }
    }

    // ============ 页面切换 ============
    function switchPage(pageName) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
        
        const page = document.getElementById(`page-${pageName}`);
        if (page) {
            page.classList.add('active');
            const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
            if (navItem) navItem.classList.add('active');
        }
    }

    // ============ 周期相关 ============
    function getDefaultPeriod() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        
        let startYear, startMonth, endYear, endMonth;
        if (day >= 16) {
            startYear = year;
            startMonth = month;
            endYear = month === 11 ? year + 1 : year;
            endMonth = month === 11 ? 0 : month + 1;
        } else {
            startYear = month === 0 ? year - 1 : year;
            startMonth = month === 0 ? 11 : month - 1;
            endYear = year;
            endMonth = month;
        }
        
        return {
            start: formatDateStr(new Date(startYear, startMonth, 16)),
            end: formatDateStr(new Date(endYear, endMonth, 15))
        };
    }

    function initCurrentPeriod() {
        const defaultPeriod = getDefaultPeriod();
        currentPeriodStart = defaultPeriod.start;
        currentPeriodEnd = defaultPeriod.end;
    }

    function getFilteredData(data) {
        if (!currentPeriodStart || !currentPeriodEnd) return data;
        
        const filteredRecords = data.records.filter(r => 
            r.date >= currentPeriodStart && r.date <= currentPeriodEnd
        );
        
        const category_totals = {};
        const daily_totals = {};
        let total_expense = 0;
        let total_income = 0;
        
        filteredRecords.forEach(record => {
            const amount = Math.abs(record.amount);
            if (record.amount < 0) {
                if (!category_totals[record.category]) category_totals[record.category] = 0;
                category_totals[record.category] += amount;
                if (!daily_totals[record.date]) daily_totals[record.date] = 0;
                daily_totals[record.date] += amount;
                total_expense += amount;
            } else {
                total_income += amount;
            }
        });
        
        const active_days = Object.keys(daily_totals).length;
        const avg_daily = active_days > 0 ? total_expense / active_days : 0;
        
        return {
            records: filteredRecords,
            category_totals,
            daily_totals,
            total_expense,
            total_income,
            avg_daily,
            active_days
        };
    }

    function formatPeriodDisplay(start, end) {
        const s = new Date(start);
        const e = new Date(end);
        return `${s.getMonth() + 1}月${s.getDate()}日 - ${e.getMonth() + 1}月${e.getDate()}日`;
    }

    function applyPeriod(start, end) {
        currentPeriodStart = start;
        currentPeriodEnd = end;
        if (expenseData) {
            const filtered = getFilteredData(expenseData);
            renderHomePage(filtered);
            renderStatsPage(filtered);
            renderMinePage(filtered);
        }
    }

    // ============ 首页渲染 ============
    function renderHomePage(data) {
        document.getElementById('totalExpense').textContent = formatMoney(data.total_expense);
        document.getElementById('monthIncome').textContent = '0';
        document.getElementById('monthBudget').textContent = budget.toLocaleString();
        
        const remaining = budget - data.total_expense;
        document.getElementById('remainingBudget').textContent = remaining.toLocaleString();

        if (currentPeriodStart && currentPeriodEnd) {
            document.getElementById('cycleText').textContent = formatPeriodDisplay(currentPeriodStart, currentPeriodEnd);
        }

        // 分类入口
        const categoryList = document.getElementById('categoryList');
        const categories = Object.entries(data.category_totals).sort((a, b) => b[1] - a[1]);
        categoryList.innerHTML = categories.map(([cat, amount]) => {
            const config = CATEGORY_CONFIG[cat] || { icon: 'wallet', color: '#E3F2FD', iconColor: '#2196F3', name: cat };
            return `
                <div class="category-item">
                    <div class="category-icon-wrap" style="background: ${config.color};">${getIcon(config.icon, 28, config.iconColor)}</div>
                    <div class="category-name">${config.name}</div>
                    <div class="category-amount">-${Math.round(amount)}</div>
                </div>
            `;
        }).join('');

        // 记账明细
        const detailList = document.getElementById('detailList');
        const records = data.records.slice(0, 10);
        detailList.innerHTML = records.map(record => {
            const config = CATEGORY_CONFIG[record.category] || { icon: 'wallet', color: '#E3F2FD', iconColor: '#2196F3', name: record.category };
            const isIncome = record.amount >= 0;
            return `
                <div class="detail-item" data-record-id="${record.id}">
                    <div class="detail-icon-wrap" style="background: ${config.color};">${getIcon(config.icon, 24, config.iconColor)}</div>
                    <div class="detail-info">
                        <div class="detail-title">${config.name}</div>
                        <div class="detail-time">${formatDateTime(record.date)}</div>
                    </div>
                    <div class="detail-amount ${isIncome ? 'income' : 'expense'}">
                        ${isIncome ? '+' : '-'}${formatMoney(Math.abs(record.amount))}
                    </div>
                    <span class="detail-arrow-wrap" style="width:16px;height:16px;color:#BDBDBD;">${getIcon('chevronRight', 16, '#BDBDBD')}</span>
                </div>
            `;
        }).join('');

        detailList.querySelectorAll('.detail-item').forEach(item => {
            item.addEventListener('click', () => {
                const recordId = parseInt(item.dataset.recordId);
                openEditRecord(recordId);
            });
        });
    }

    // ============ 统计页面 ============
    function renderStatsPage(data) {
        document.getElementById('statsTotalExpense').textContent = '¥' + formatMoney(data.total_expense);
        document.getElementById('statsDailyAvg').textContent = '¥' + formatMoney(data.avg_daily);
        document.getElementById('statsRecordCount').textContent = data.records.length + '笔';

        const ctx = document.getElementById('categoryBarChart').getContext('2d');
        const categories = Object.entries(data.category_totals).sort((a, b) => b[1] - a[1]);
        const labels = categories.map(([cat]) => CATEGORY_CONFIG[cat]?.name || cat);
        const values = categories.map(([, amount]) => Math.round(amount));
        const colors = categories.map(([cat]) => CATEGORY_CONFIG[cat]?.color || '#E3F2FD');

        if (categoryBarChart) categoryBarChart.destroy();
        
        categoryBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '消费金额',
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8,
                    barThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        grid: { display: false }, 
                        ticks: { 
                            font: { size: 11 }, 
                            color: '#212121',
                            maxRotation: 0,
                            minRotation: 0,
                            maxLines: 2
                        },
                        border: { display: false }
                    },
                    y: { 
                        grid: { color: '#E0F7FA' }, 
                        ticks: { 
                            display: true,
                            callback: v => v >= 1000 ? (v/1000) + 'k' : v,
                            color: '#757575',
                            font: { size: 11 }
                        },
                        border: { display: false }
                    }
                }
            }
        });

        const breakdownList = document.getElementById('breakdownList');
        breakdownList.innerHTML = categories.map(([cat, amount]) => {
            const config = CATEGORY_CONFIG[cat] || { icon: 'wallet', name: cat, color: '#F5F5F5', iconColor: '#757575', morandiColor: '#A5C4C4' };
            const percent = ((amount / data.total_expense) * 100).toFixed(1);
            return `
                <div class="breakdown-item" style="background:${config.color};">
                    <div class="breakdown-info">
                        <span class="breakdown-icon" style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">${getIcon(config.icon, 18, config.iconColor)}</span>
                        <span class="breakdown-name">${config.name}</span>
                    </div>
                    <div class="breakdown-amount">¥${Math.round(amount)} (${percent}%)</div>
                </div>
            `;
        }).join('');
    }

    // ============ 日历页面 ============
    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthDisplay = document.getElementById('calendarMonth');
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        monthDisplay.textContent = `${year}年${month + 1}月`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const today = new Date();
        const todayStr = formatDateStr(today);
        
        let html = '';
        for (let i = 0; i < startDay; i++) {
            html += '<div class="calendar-day other-month"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDateStr(date);
            const isToday = dateStr === todayStr;
            const isSelected = (selectedStartDate && dateStr === selectedStartDate) || 
                               (selectedEndDate && dateStr === selectedEndDate);
            const isInRange = selectedStartDate && selectedEndDate && 
                              dateStr >= selectedStartDate && dateStr <= selectedEndDate;
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (isInRange) classes += ' in-range';
            
            html += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
        }
        
        grid.innerHTML = html;
        updateRangeDisplay();
    }

    function updateRangeDisplay() {
        document.getElementById('startDate').textContent = selectedStartDate || '点击选择';
        document.getElementById('endDate').textContent = selectedEndDate || '点击选择';
        
        if (selectedStartDate && selectedEndDate) {
            const start = new Date(selectedStartDate);
            const end = new Date(selectedEndDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            document.getElementById('rangeDays').textContent = `共 ${days} 天`;
            
            if (expenseData) {
                const dailyTotals = expenseData.daily_totals;
                let totalExpense = 0;
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const ds = formatDateStr(d);
                    if (dailyTotals[ds]) totalExpense += dailyTotals[ds];
                }
                document.getElementById('rangeExpense').textContent = `消费 ¥${formatMoney(totalExpense)}`;
            }
        } else {
            document.getElementById('rangeDays').textContent = '共 0 天';
            document.getElementById('rangeExpense').textContent = '消费 ¥0.00';
        }
    }

    // ============ 我的页面 ============
    function renderMinePage(data) {
        document.getElementById('accountDays').textContent = data.active_days + '天';
        document.getElementById('accountRecords').textContent = data.records.length + '笔';
        // 注册时间
        const account = loadUserInfo();
        const registerDateEl = document.getElementById('registerDate');
        if (registerDateEl && account.registerDate) {
            registerDateEl.textContent = account.registerDate;
        }
        // 预算显示
        const budgetValueEl = document.getElementById('budgetValue');
        if (budgetValueEl) {
            budgetValueEl.textContent = '¥' + budget.toLocaleString() + '/月';
        }
        renderUserInfo();
    }

    function renderUserInfo() {
        const avatar = document.getElementById('profileAvatar');
        const avatarText = document.getElementById('avatarText');
        const name = document.getElementById('profileName');

        // 清除已存在的img
        const existingImg = avatar.querySelector('img');
        if (existingImg) existingImg.remove();

        if (userInfo.avatar) {
            const img = document.createElement('img');
            img.src = userInfo.avatar;
            avatar.appendChild(img);
            avatarText.style.display = 'none';
        } else {
            avatarText.style.display = 'flex';
            avatarText.textContent = userInfo.nickname.charAt(0).toUpperCase();
        }
        name.textContent = userInfo.nickname;
        // 在昵称下方显示用户名
        let idEl = name.parentNode.querySelector('.profile-user-id');
        if (!idEl) {
            idEl = document.createElement('div');
            idEl.className = 'profile-user-id';
            name.parentNode.appendChild(idEl);
        }
        idEl.textContent = `用户名: ${currentUsername || ''}`;
    }

    // ============ 记账页面 ============
    function renderAddPage() {
        const grid = document.getElementById('addCategoryGrid');
        const categories = Object.keys(CATEGORY_CONFIG);
        grid.innerHTML = categories.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            return `
                <div class="category-grid-item" data-category="${cat}">
                    <div class="category-grid-icon" style="background: ${config.color};">${getIcon(config.icon, 26, config.iconColor)}</div>
                    <div class="category-grid-name">${config.name}</div>
                </div>
            `;
        }).join('');

        document.getElementById('addDate').value = formatDateStr(new Date());
    }

    function openEditRecord(recordId) {
        if (!expenseData || !expenseData.records) return;
        const record = expenseData.records.find(r => r.id === recordId);
        if (!record) {
            showToast('记录不存在');
            return;
        }
        editingRecordId = recordId;

        const amountInput = document.getElementById('amountInput');
        const addDate = document.getElementById('addDate');
        const addRemark = document.getElementById('addRemark');

        amountInput.value = Math.abs(record.amount);
        addDate.value = record.date;
        addRemark.value = record.remark || '';

        const isExpense = record.amount < 0;
        document.querySelectorAll('.type-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.type === (isExpense ? 'expense' : 'income'));
        });

        document.querySelectorAll('.category-grid-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.category === record.category);
        });

        document.getElementById('confirmAdd').textContent = '保存修改';

        switchPage('add');
    }

    function resetAddPage() {
        editingRecordId = null;
        document.getElementById('amountInput').value = '';
        document.getElementById('addDate').value = formatDateStr(new Date());
        document.getElementById('addRemark').value = '';
        document.querySelectorAll('.category-grid-item').forEach(i => i.classList.remove('selected'));
        document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.type-tab[data-type="expense"]').classList.add('active');
        document.getElementById('confirmAdd').textContent = '确认记账';
    }

    // ============ 头像上传 ============
    function handleAvatarUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast('请选择图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 压缩图片到 200x200
                const canvas = document.createElement('canvas');
                const size = 200;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // 计算居中裁剪
                const scale = Math.max(size / img.width, size / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const x = (size - w) / 2;
                const y = (size - h) / 2;
                
                ctx.drawImage(img, x, y, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                
                userInfo.avatar = dataUrl;
                saveUserInfo();
                renderUserInfo();
                showToast('头像更新成功');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ============ 昵称编辑 ============
    function openEditModal() {
        const modal = document.getElementById('editModal');
        const input = document.getElementById('nicknameInput');
        input.value = userInfo.nickname;
        modal.style.display = 'flex';
        setTimeout(() => input.focus(), 100);
    }

    function closeEditModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    function confirmEdit() {
        const input = document.getElementById('nicknameInput');
        const newName = input.value.trim();
        if (!newName) {
            showToast('昵称不能为空');
            return;
        }
        if (newName.length > 20) {
            showToast('昵称最多20个字符');
            return;
        }
        userInfo.nickname = newName;
        saveUserInfo();
        renderUserInfo();
        closeEditModal();
        showToast('昵称已更新');
    }

    // ============ 初始化 ============
    async function init() {
        try {
            // 注入所有图标
            injectIcons();

            // 绑定登录/注册相关事件（无论登录状态都需要绑定，登录成功后再刷新）
            bindAuthEvents();
            bindCommonEvents();

            // 检查登录状态
            const loginState = getLoginState();
            const migrated = migrateLegacyData();

            if (loginState && loginState.username) {
                currentUsername = loginState.username;
                isLoggedIn = true;
                const account = loadUserInfo();
                userInfo = {
                    nickname: account.nickname || account.username || '记账用户',
                    avatar: account.avatar || null
                };
                expenseData = loadExpenseData();
            } else if (migrated) {
                currentUsername = migrated;
                isLoggedIn = true;
                setLoginState(migrated);
                const account = loadUserInfo();
                userInfo = {
                    nickname: account.nickname || account.username || '记账用户',
                    avatar: account.avatar || null
                };
                expenseData = loadExpenseData();
                showToast('已自动迁移旧数据，默认密码为 123456');
            } else {
                // 未登录，显示登录弹窗
                showAuthModal();
                return;
            }

            if (!expenseData) {
                const response = await fetch('data/expenses.json');
                if (!response.ok) throw new Error('Failed to load data');
                expenseData = await response.json();
                saveExpenseData();
            }

            initCurrentPeriod();
            const filteredData = getFilteredData(expenseData);
            renderHomePage(filteredData);
            renderStatsPage(filteredData);
            renderMinePage(filteredData);
            renderCalendar();
            renderAddPage();

            // 记账页面返回
            document.getElementById('backFromAdd').addEventListener('click', () => {
                resetAddPage();
                switchPage('home');
            });
            document.getElementById('cancelAdd').addEventListener('click', () => {
                resetAddPage();
                switchPage('home');
            });

            // 确认记账（两个按钮绑定同一个处理函数）
            const handleSaveRecord = () => {
                const amountInput = document.getElementById('amountInput');
                const amount = parseFloat(amountInput.value);
                const type = document.querySelector('.type-tab.active').dataset.type;
                const selectedCategory = document.querySelector('.category-grid-item.selected');
                const dateInput = document.getElementById('addDate');
                const date = dateInput.value;
                const remarkInput = document.getElementById('addRemark');
                const remark = remarkInput.value;

                if (!amount || amount <= 0) {
                    showToast('请输入有效金额');
                    amountInput.focus();
                    return;
                }

                if (!selectedCategory) {
                    showToast('请选择分类');
                    return;
                }

                const category = selectedCategory.dataset.category;
                const isExpense = type === 'expense';

                if (editingRecordId) {
                    const oldRecord = expenseData.records.find(r => r.id === editingRecordId);
                    if (!oldRecord) {
                        showToast('记录不存在');
                        return;
                    }
                    const oldIsExpense = oldRecord.amount < 0;
                    const oldAmount = Math.abs(oldRecord.amount);
                    if (oldIsExpense) {
                        expenseData.category_totals[oldRecord.category] -= oldAmount;
                        expenseData.daily_totals[oldRecord.date] -= oldAmount;
                    }
                    oldRecord.date = date || formatDateStr(new Date());
                    oldRecord.category = category;
                    oldRecord.amount = isExpense ? -amount : amount;
                    oldRecord.remark = remark || CATEGORY_CONFIG[category]?.name || category;
                    oldRecord.type = type;
                    if (isExpense) {
                        if (!expenseData.category_totals[category]) expenseData.category_totals[category] = 0;
                        expenseData.category_totals[category] += amount;
                        const dateKey = oldRecord.date;
                        if (!expenseData.daily_totals[dateKey]) expenseData.daily_totals[dateKey] = 0;
                        expenseData.daily_totals[dateKey] += amount;
                    }
                    showToast('修改成功！');
                    editingRecordId = null;
                    document.getElementById('confirmAdd').textContent = '确认记账';
                } else {
                    const record = {
                        id: Date.now(),
                        date: date || formatDateStr(new Date()),
                        category: category,
                        amount: isExpense ? -amount : amount,
                        remark: remark || CATEGORY_CONFIG[category]?.name || category,
                        type: type
                    };

                    if (!expenseData) {
                        expenseData = {
                            records: [],
                            category_totals: {},
                            daily_totals: {},
                            total_expense: 0,
                            total_income: 0,
                            avg_daily: 0,
                            active_days: 0
                        };
                    }

                    expenseData.records.unshift(record);

                    if (isExpense) {
                        if (!expenseData.category_totals[category]) expenseData.category_totals[category] = 0;
                        expenseData.category_totals[category] += amount;

                        const dateKey = record.date;
                        if (!expenseData.daily_totals[dateKey]) expenseData.daily_totals[dateKey] = 0;
                        expenseData.daily_totals[dateKey] += amount;
                    }
                    showToast('记账成功！');
                }

                expenseData.total_expense = Object.values(expenseData.category_totals).reduce((a, b) => a + b, 0);
                expenseData.active_days = Object.keys(expenseData.daily_totals).length;
                expenseData.avg_daily = expenseData.active_days > 0 ? expenseData.total_expense / expenseData.active_days : 0;

                saveExpenseData();

                amountInput.value = '';
                document.querySelectorAll('.category-grid-item').forEach(i => i.classList.remove('selected'));
                remarkInput.value = '';

                const filtered = getFilteredData(expenseData);
                renderHomePage(filtered);
                renderStatsPage(filtered);
                renderMinePage(filtered);

                switchPage('home');
            };

            document.getElementById('confirmAdd').addEventListener('click', handleSaveRecord);
            document.getElementById('saveRecord').addEventListener('click', handleSaveRecord);

            // 收支类型切换
            document.querySelectorAll('.type-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                });
            });

            // 分类选择
            document.getElementById('addCategoryGrid').addEventListener('click', (e) => {
                const item = e.target.closest('.category-grid-item');
                if (item) {
                    document.querySelectorAll('.category-grid-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                }
            });

            // 日历导航
            document.getElementById('prevMonth').addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
                renderCalendar();
            });

            document.getElementById('nextMonth').addEventListener('click', () => {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
                renderCalendar();
            });

            document.getElementById('calendarGrid').addEventListener('click', (e) => {
                const day = e.target.closest('.calendar-day');
                if (day && day.dataset.date) {
                    const date = day.dataset.date;
                    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                        selectedStartDate = date;
                        selectedEndDate = null;
                    } else if (date >= selectedStartDate) {
                        selectedEndDate = date;
                    } else {
                        selectedStartDate = date;
                    }
                    renderCalendar();
                }
            });

            document.getElementById('clearRange').addEventListener('click', () => {
                selectedStartDate = null;
                selectedEndDate = null;
                renderCalendar();
            });

            document.getElementById('applyRange').addEventListener('click', () => {
                if (!selectedStartDate || !selectedEndDate) {
                    showToast('请先选择周期范围');
                    return;
                }
                applyPeriod(selectedStartDate, selectedEndDate);
                showToast('周期已应用');
                switchPage('home');
            });

            // 头像上传
            const avatar = document.getElementById('profileAvatar');
            const avatarInput = document.getElementById('avatarInput');

            avatar.addEventListener('click', () => {
                avatarInput.click();
            });

            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) handleAvatarUpload(file);
                e.target.value = '';
            });

            // 昵称编辑
            document.getElementById('editProfile').addEventListener('click', openEditModal);
            document.getElementById('closeModal').addEventListener('click', closeEditModal);
            document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
            document.getElementById('confirmEdit').addEventListener('click', confirmEdit);
            document.getElementById('nicknameInput').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') confirmEdit();
                if (e.key === 'Escape') closeEditModal();
            });

            // 点击遮罩关闭弹窗
            document.getElementById('editModal').addEventListener('click', (e) => {
                if (e.target.id === 'editModal') closeEditModal();
            });

            // 预算设置
            document.getElementById('budgetItem').addEventListener('click', openBudgetModal);
            document.getElementById('closeBudgetModal').addEventListener('click', closeBudgetModal);
            document.getElementById('cancelBudget').addEventListener('click', closeBudgetModal);
            document.getElementById('confirmBudget').addEventListener('click', confirmBudget);
            document.getElementById('budgetInput').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') confirmBudget();
                if (e.key === 'Escape') closeBudgetModal();
            });
            document.getElementById('budgetModal').addEventListener('click', (e) => {
                if (e.target.id === 'budgetModal') closeBudgetModal();
            });

            // 退出登录
            document.getElementById('logoutItem').addEventListener('click', () => {
                if (confirm('确定要退出登录吗？')) {
                    logout();
                }
            });

        } catch (err) {
            console.error('Init error:', err);
        }
    }

    // ============ 登录/注册事件绑定 ============
    function bindAuthEvents() {
        const loginTab = document.getElementById('loginTab');
        const registerTab = document.getElementById('registerTab');
        const confirmAuth = document.getElementById('confirmAuth');

        if (loginTab) {
            loginTab.addEventListener('click', (e) => {
                e.preventDefault();
                switchAuthTab('login');
            });
        }
        if (registerTab) {
            registerTab.addEventListener('click', (e) => {
                e.preventDefault();
                switchAuthTab('register');
            });
        }
        if (confirmAuth) {
            confirmAuth.addEventListener('click', (e) => {
                e.preventDefault();
                handleAuthConfirm();
            });
        }

        const loginUsername = document.getElementById('loginUsername');
        const loginPassword = document.getElementById('loginPassword');
        const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');

        if (loginUsername) {
            loginUsername.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') loginPassword && loginPassword.focus();
            });
        }
        if (loginPassword) {
            loginPassword.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleAuthConfirm();
            });
        }
        if (registerPasswordConfirm) {
            registerPasswordConfirm.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleAuthConfirm();
            });
        }
    }

    function bindCommonEvents() {
        // 导航点击
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                switchPage(item.dataset.page);
            });
        });

        // 首页日历选择器点击跳转日历页
        document.getElementById('cycleSelector').addEventListener('click', () => {
            switchPage('calendar');
        });

        // 记账按钮
        const navAdd = document.querySelector('.nav-add');
        if (navAdd) {
            navAdd.addEventListener('click', (e) => {
                e.preventDefault();
                switchPage('add');
            });
        }
    }

    // ============ 登录/注册弹窗 ============
    let currentAuthTab = 'login';

    function showAuthModal() {
        document.getElementById('authModal').style.display = 'flex';
        switchAuthTab('login');
        setTimeout(() => document.getElementById('loginUsername').focus(), 100);
    }

    function switchAuthTab(tab) {
        currentAuthTab = tab;
        document.getElementById('loginTab').classList.toggle('active', tab === 'login');
        document.getElementById('registerTab').classList.toggle('active', tab === 'register');
        document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
        document.getElementById('confirmAuth').textContent = tab === 'login' ? '登录' : '注册';
    }

    function handleAuthConfirm() {
        if (currentAuthTab === 'login') {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            if (!username || !password) {
                showToast('请输入用户名和密码');
                return;
            }
            if (verifyLogin(username, password)) {
                login(username);
                document.getElementById('authModal').style.display = 'none';
                // 重新初始化页面
                location.reload();
            } else {
                showToast('用户名或密码错误');
            }
        } else {
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            if (!username || !password) {
                showToast('请输入用户名和密码');
                return;
            }
            if (password !== passwordConfirm) {
                showToast('两次输入的密码不一致');
                return;
            }
            if (username.length > 20) {
                showToast('用户名最多20个字符');
                return;
            }
            const result = register(username, password);
            if (result.success) {
                login(username);
                document.getElementById('authModal').style.display = 'none';
                showToast('注册成功！');
                location.reload();
            } else {
                showToast(result.message);
            }
        }
    }

    // ============ 预算设置弹窗 ============
    function openBudgetModal() {
        document.getElementById('budgetInput').value = budget;
        document.getElementById('budgetModal').style.display = 'flex';
        setTimeout(() => document.getElementById('budgetInput').focus(), 100);
    }

    function closeBudgetModal() {
        document.getElementById('budgetModal').style.display = 'none';
    }

    function confirmBudget() {
        const input = document.getElementById('budgetInput');
        const val = parseFloat(input.value);
        if (isNaN(val) || val < 0) {
            showToast('请输入有效金额');
            return;
        }
        budget = val;
        saveBudget(budget);
        // 重新渲染相关页面
        if (expenseData) {
            const filtered = getFilteredData(expenseData);
            renderHomePage(filtered);
            renderMinePage(filtered);
        }
        closeBudgetModal();
        showToast('预算已更新');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();