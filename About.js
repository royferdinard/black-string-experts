window.addEventListener('scroll',function () {
    const btn = this.document.getElementById('back-to-top');
    btn.style.display = (window.scrollY > 200) ? "flex" : "none"; 
});
document.getElementById('back-to-top').onclick = function () {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
};