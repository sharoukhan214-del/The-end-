// بيانات Firebase الخاصة بك
const firebaseConfig = {
    apiKey: "AIzaSyBp6XDnQj80f1B1c5hW",
    databaseURL: "https://snay3y-pro-default-rtdb.firebaseio.com",
    projectId: "snay3y-pro"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// بيانات القبطان (إدارة السيستم)
const ADMIN_CONF = {
    phone: "01020744825",
    pass: "Mohamed214@",
    instapay: "01020744825",
    commission: 20, // العمولة بالجنيه
    limit: 1000     // حد المديونية
};
