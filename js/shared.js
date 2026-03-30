let currentUser = 'default';
let currentGender = 'female';
let familyMembers = [{ id: 'default', name: '我', contribution: 0, level: 1, experience: 0 }];
let cleaningHistory = [];
let praiseRecords = [];
let praises = [];
let roomBestPhotos = {};
let equipment = {
    head: null,
    body: null,
    hands: null,
    feet: null
};
let achievements = [
    { id: 1, name: '初次清洁', description: '完成第一次清洁任务', unlocked: false, progress: 0, target: 1 },
    { id: 2, name: '清洁达人', description: '完成10次清洁任务', unlocked: false, progress: 0, target: 10 },
    { id: 3, name: '完美清洁', description: '获得10次AI满分评价', unlocked: false, progress: 0, target: 10 },
    { id: 4, name: '家庭卫士', description: '所有家庭成员完成清洁任务', unlocked: false, progress: 0, target: 1 }
];
let skills = [
    { id: 1, name: '快速清洁', description: '清洁速度 +10%', unlocked: true, level: 1, maxLevel: 5 },
    { id: 2, name: '深度清洁', description: '清洁效果 +15%', unlocked: false, level: 0, maxLevel: 5 },
    { id: 3, name: '经验提升', description: '经验获取 +20%', unlocked: false, level: 0, maxLevel: 5 }
];

function loadFromLocalStorage() {
    const savedMembers = localStorage.getItem('familyMembers');
    const savedHistory = localStorage.getItem('cleaningHistory');
    const savedPraise = localStorage.getItem('praiseRecords');
    const savedPraises = localStorage.getItem('praises');
    const savedBestPhotos = localStorage.getItem('roomBestPhotos');
    const savedEquipment = localStorage.getItem('equipment');
    const savedAchievements = localStorage.getItem('achievements');
    const savedSkills = localStorage.getItem('skills');

    if (savedMembers) {
        familyMembers = JSON.parse(savedMembers);
    }

    if (savedHistory) {
        cleaningHistory = JSON.parse(savedHistory);
    }

    if (savedPraise) {
        praiseRecords = JSON.parse(savedPraise);
    }

    if (savedPraises) {
        praises = JSON.parse(savedPraises);
    }

    if (savedBestPhotos) {
        roomBestPhotos = JSON.parse(savedBestPhotos);
    }

    if (savedEquipment) {
        equipment = JSON.parse(savedEquipment);
    }

    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    }

    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    localStorage.setItem('cleaningHistory', JSON.stringify(cleaningHistory));
    localStorage.setItem('praiseRecords', JSON.stringify(praiseRecords));
    localStorage.setItem('praises', JSON.stringify(praises));
    localStorage.setItem('roomBestPhotos', JSON.stringify(roomBestPhotos));
    localStorage.setItem('equipment', JSON.stringify(equipment));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('skills', JSON.stringify(skills));
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function showLevelUpAnimation() {
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('level-up-animation');
        setTimeout(() => {
            header.classList.remove('level-up-animation');
        }, 1000);
    }
}

function updateAchievements() {
    const firstCleanAchievement = achievements.find(a => a.id === 1);
    if (firstCleanAchievement && !firstCleanAchievement.unlocked) {
        firstCleanAchievement.progress = 1;
        firstCleanAchievement.unlocked = true;
    }

    const cleaningMasterAchievement = achievements.find(a => a.id === 2);
    if (cleaningMasterAchievement) {
        const user = familyMembers.find(m => m.id === currentUser);
        if (user) {
            cleaningMasterAchievement.progress = user.contribution;
            if (cleaningMasterAchievement.progress >= cleaningMasterAchievement.target) {
                cleaningMasterAchievement.unlocked = true;
            }
        }
    }
}

function completeTask(taskName) {
    const userIndex = familyMembers.findIndex(m => m.id === currentUser);
    if (userIndex !== -1) {
        const user = familyMembers[userIndex];
        user.contribution += 1;
        user.experience += 10;

        if (user.experience >= 100) {
            user.level += 1;
            user.experience -= 100;
            showLevelUpAnimation();
        }

        updateAchievements();

        const record = {
            id: Date.now(),
            user: user.id,
            task: taskName,
            date: new Date().toISOString(),
            duration: Math.floor(Math.random() * 30) + 10,
            score: Math.floor(Math.random() * 20) + 80
        };
        cleaningHistory.push(record);

        saveToLocalStorage();

        alert(`任务完成！获得10经验值`);
    }
}

function navigateTo(page, params = {}) {
    let url = page;
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
    }
    if (searchParams.toString()) {
        url += '?' + searchParams.toString();
    }
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
});
