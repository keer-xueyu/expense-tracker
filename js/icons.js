// SVG 扁平化图标库 - 类似 iconfont.cn 风格
const ICONS = {
    // 顶部图标
    calendar: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    eye: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42001 13.98 8.42001 12C8.42001 10.02 10.02 8.42001 12 8.42001C13.98 8.42001 15.58 10.02 15.58 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C18.82 5.8 15.53 3.72 12 3.72C8.46997 3.72 5.17997 5.8 2.88997 9.4C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    arrowDown: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.92 8.94995L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.07996 8.94995" stroke="currentColor" stroke-width="1.8" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.08002" stroke="currentColor" stroke-width="1.8" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.09 19.92L8.57 13.4C7.8 12.63 7.8 11.37 8.57 10.6L15.09 4.08002" stroke="currentColor" stroke-width="1.8" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    chevronLeft: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    filter: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.35 2H20.65C21.48 2 22 2.84 21.61 3.55L14.99 13.55C14.83 13.8 14.74 14.1 14.74 14.4V20.5C14.74 21.23 13.95 21.66 13.32 21.29L10.02 19.36C9.66 19.16 9.44001 18.78 9.44001 18.38V14.4C9.44001 14.1 9.36 13.8 9.19 13.55L2.39 3.55C2 2.84 2.52 2 3.35 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    // 统计/财务
    chart: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 22H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 22V14M10 22V8M15 22V11M20 22V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    
    wallet: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.56 14.5V8.5C20.56 6.5 19.56 4.5 16.56 4.5H6.56C3.56 4.5 2.56 6.5 2.56 8.5V15.5C2.56 17.5 3.56 19.5 6.56 19.5H16.56C19.56 19.5 20.56 17.5 20.56 15.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 8.5H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/><path d="M22 11.5V12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    money: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 8H22V18C22 20 20 22 18 22H6C4 22 2 20 2 18V8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M22 8C22 6 20 4 18 4H6C4 4 2 6 2 8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="15" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    
    budget: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 22H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.6001 8.38H18.4001C19.3701 8.38 20.1601 9.17 20.1601 10.14V12.65C20.1601 13.62 19.3701 14.41 18.4001 14.41H5.6001C4.6301 14.41 3.84009 13.62 3.84009 12.65V10.14C3.84009 9.17 4.6301 8.38 5.6001 8.38Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.95 8.38V6.25C7.95 4.86 9.06 3.75 10.45 3.75H13.54C14.93 3.75 16.04 4.86 16.04 6.25V8.38" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    piggyBank: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.5 11.48C19.5 14.99 16.57 17.97 12.49 17.97C11.23 17.97 10.05 17.66 9 17.13L5 18.47V14.96C4.07 14.05 3.5 12.83 3.5 11.48C3.5 7.97 6.43 5 10.5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="9.5" r="1.5" fill="currentColor"/><path d="M19.5 8V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    // 分类图标
    home: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15C14.45 21 14 20.55 14 20V15C14 14.45 13.55 14 13 14H11C10.45 14 10 14.45 10 15V20C10 20.55 9.55 21 9 21H4C3.45 21 3 20.55 3 20V9.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    food: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11L4 18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18L21 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11V8C9 6 7 4 7 4M15 11V8C15 6 17 4 17 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    shopping: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7V5C6 3.34 7.34 2 9 2H15C16.66 2 18 3.34 18 5V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7H21L20 20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20L3 7Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11V17M15 11V17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    transport: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="14" rx="3" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 11H20" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="14.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.2" fill="currentColor"/><path d="M6 17L4 21M18 17L20 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    beauty: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4H15L13 11H11L9 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><rect x="7" y="11" width="10" height="6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 17V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M9 21H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    book: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H8C9.1 4 10 4.9 10 6V20C10 18.9 9.1 18 8 18H4V4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M20 4H16C14.9 4 14 4.9 14 6V20C14 18.9 14.9 18 16 18H20V4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    
    daily: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.8"/><path d="M8 4V7M16 4V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    social: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M3 20C3 16.5 5.5 14 9 14C12.5 14 15 16.5 15 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M15 20C15 17.5 17 16 19 16C21 16 22 17.5 22 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    // 用户相关
    user: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21C4 16.58 7.58 13 12 13C16.42 13 20 16.58 20 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    edit: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.26 3.6L5.05 11.81C4.65 12.21 4.25 12.92 4.15 13.43L3.45 17.33C3.25 18.43 4.05 19.23 5.15 19.03L9.05 18.33C9.55 18.23 10.26 17.83 10.67 17.43L18.87 9.22C20.17 7.92 20.77 6.42 18.87 4.52C16.97 2.62 15.47 3.22 14.17 4.52L13.26 3.6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.89 5.05L18.87 12.03" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    camera: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 4H7C4.24 4 2 6.24 2 9V15C2 17.76 4.24 20 7 20H17C19.76 20 22 17.76 22 15V9C22 6.24 19.76 4 17 4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="8" r="0.8" fill="currentColor"/></svg>',
    
    phone: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 18.43H13.5C9.5 18.43 5.5 14.43 5.5 10.43V6.93C5.5 5.86 6.36 5 7.43 5H9.5C10.05 5 10.57 5.3 10.83 5.78L11.97 8.06C12.24 8.56 12.13 9.15 11.71 9.55L10.66 10.55C11.62 12.23 12.93 13.54 14.61 14.5L15.61 13.45C16.01 13.04 16.6 12.92 17.1 13.19L19.38 14.33C19.86 14.6 20.16 15.11 20.16 15.67V17.5C20.17 18.57 19.31 19.43 18.24 19.43" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    mail: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 4H7C4.24 4 2 6.24 2 9V15C2 17.76 4.24 20 7 20H17C19.76 20 22 17.76 22 15V9C22 6.24 19.76 4 17 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 7L12 13L21 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    add: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    
    plus: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    
    check: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5L10 17.5L20 7.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    close: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    
    // 装饰用
    heart: '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"/></svg>',
    
    smile: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="currentColor"/><path d="M9 10C9 10.55 8.55 11 8 11C7.45 11 7 10.55 7 10C7 9.45 7.45 9 8 9C8.55 9 9 9.45 9 10Z" fill="white"/><path d="M17 10C17 10.55 16.55 11 16 11C15.45 11 15 10.55 15 10C15 9.45 15.45 9 16 9C16.55 9 17 9.45 17 10Z" fill="white"/><path d="M8.5 14C9 15.2 10.4 16 12 16C13.6 16 15 15.2 15.5 14" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>',
    
    // 文本
    note: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 14H15M9 18H13M5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function getIcon(name, size = 20, color = 'currentColor') {
    const svg = ICONS[name] || '';
    return svg.replace('currentColor', color).replace('<svg ', `<svg width="${size}" height="${size}" `);
}