let currentUser = null;
let logoClicks = 0;

// 1. الدخول السري للأدمن (3 ضغطات)
function handleLogoClick() {
    logoClicks++;
    if(logoClicks === 3) {
        logoClicks = 0;
        const p = prompt("رقم المدير:");
        const s = prompt("كلمة السر:");
        if(p === ADMIN_CONF.phone && s === ADMIN_CONF.pass) {
            showScreen('admin-screen');
            loadAdminPanel();
        } else { alert("⚠️ دخول غير مصرح!"); }
    }
    setTimeout(() => logoClicks = 0, 2000);
}

// 2. نظام المديونية والقفل
function checkDebtAndAction(callback) {
    db.ref('users/' + currentUser.phone).once('value', snap => {
        const debt = snap.val().debt || 0;
        if(debt >= ADMIN_CONF.limit) {
            alert(`🚫 حسابك محظور لتخطي المديونية (1000ج). حول لانستا باي ${ADMIN_CONF.instapay} وفعل حسابك.`);
        } else {
            callback(debt);
        }
    });
}

// 3. خصم العمولة (عند الاتصال)
function chargeAndCall(clientPhone) {
    checkDebtAndAction((currentDebt) => {
        db.ref('users/' + currentUser.phone).update({ debt: currentDebt + ADMIN_CONF.commission });
        window.location.href = "tel:" + clientPhone;
    });
}

// 4. تحميل الرادار (مع السعر المتفاوض عليه)
function loadRadar() {
    db.ref('orders').orderByChild('status').equalTo('open').on('value', snap => {
        const list = document.getElementById('radar-list');
        list.innerHTML = "";
        snap.forEach(order => {
            const d = order.val();
            list.innerHTML += `
            <div class="glass p-5 rounded-3xl mb-4 border-r-4 border-amber-500">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-amber-500">${d.service}</span>
                    <div class="pulse"></div>
                </div>
                <h4 class="font-bold">${d.name}</h4>
                <p class="text-xs text-gray-400 my-2">${d.desc}</p>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs text-green-400 font-bold">الميزانية: ${d.budget} ج.م</span>
                    <span class="text-[10px] text-gray-500 italic">قابل للتفاوض</span>
                </div>
                <button onclick="chargeAndCall('${d.phone}')" class="btn-gold w-full py-2 text-sm">اتصال وقبول العرض</button>
            </div>`;
        });
    });
}

// تبديل الشاشات
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
