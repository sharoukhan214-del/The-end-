let clickCount = 0;
let currentUser = null;

// 1. ميزة إظهار لوحة التحكم (3 ضغطات على اللوجو)
function handleLogoClick() {
    clickCount++;
    if (clickCount === 3) {
        clickCount = 0;
        openAdminLogin();
    }
    setTimeout(() => { clickCount = 0; }, 2000); // يصفر العداد لو مكملش الـ 3 ضغطات في ثانيتين
}

function openAdminLogin() {
    const phone = prompt("رقم المدير:");
    const pass = prompt("كلمة السر:");
    if (phone === ADMIN_DATA.phone && pass === ADMIN_DATA.pass) {
        showView('admin-panel');
        loadAdminStats();
    } else {
        alert("⚠️ دخول غير مصرح!");
    }
}

// 2. نظام التفاوض (إضافة طلب مع سعر مقترح)
function postOrder() {
    const order = {
        name: currentUser.name,
        phone: currentUser.phone,
        service: document.getElementById('c-service').value,
        desc: document.getElementById('c-desc').value,
        budget: document.getElementById('c-budget').value, // السعر اللي العميل عارضه
        status: 'open',
        timestamp: Date.now()
    };
    db.ref('orders').push(order).then(() => alert("تم نشر طلبك وبدء استقبال العروض!"));
}

// 3. الرادار وفحص المديونية (القفل التلقائي)
function loadRadar() {
    db.ref('users/' + currentUser.phone).on('value', snap => {
        const userData = snap.val();
        const debt = userData.debt || 0;
        
        if (debt >= ADMIN_DATA.max_debt) {
            document.getElementById('radar-content').innerHTML = `
                <div class="lock-screen">
                    <h2>🚫 الحساب محظور</h2>
                    <p>مديونيتك تخطت 1000 ج.م</p>
                    <p>يرجى تحويل المبلغ عبر InstaPay إلى:</p>
                    <h3 class="gold-text">${ADMIN_DATA.instapay_phone}</h3>
                </div>`;
        } else {
            // كود تحميل الطلبات وعروض الأسعار
        }
    });
    }
