// privacy.js
document.addEventListener("DOMContentLoaded", function() {
    // 修改：同时检查用户是否已经“接受”或“拒绝”了 cookies
    // 只要有任意一个记录存在，就不再显示 banner
    if (!localStorage.getItem("cookiesAccepted") && !localStorage.getItem("cookiesDeclined")) {
        document.getElementById("cookie-banner").style.display = "block";
    }

    // To accept cookies, add an event listener to the Accept button
    document.getElementById("accept-cookies").addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        document.getElementById("cookie-banner").style.display = "none";
    });

    // 新增：为拒绝按钮添加点击事件监听器
    document.getElementById("decline-cookies").addEventListener("click", function() {
        // 在 LocalStorage 中记录用户已拒绝
        localStorage.setItem("cookiesDeclined", "true"); 
        // 隐藏 banner
        document.getElementById("cookie-banner").style.display = "none";
        
        // 可选：如果你有其他的 cookie 清除逻辑或阻止某些脚本运行的逻辑，可以写在这里
    });
});