// 回頂端
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.goTop').fadeIn();
    } else {
        $('.goTop').fadeOut();
    }
});
$('.scroll').click(function (event) {
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 50
    }, 1000);
    event.preventDefault();
});

// 下拉選單
var $dropbtn = $("[data-dropdown='btn']");
var dropcontent = "[data-dropdown='content']";
$dropbtn.click(function(){
    // event.preventDefault();
    $(this).next(dropcontent).slideToggle("300");
});
$dropbtn.blur(function(){
    $(this).next(dropcontent).slideUp("300");
});

// 縮放特效
var $collapse = $("[data-toggle='collapse']");
var fall = '.collapse-content';

$collapse.click(function () {
    $(this).next(fall).slideToggle();
    $(this).parent().siblings().children().next().slideUp(150);
    // $(this).siblings().next(fall).slideUp();
    $(this).toggleClass("current"),
            $collapse.not(this).removeClass("current");
    return false;
});

// 行動裝置的主選單
$menuLeft = $('#menu');
$trigger = $('.menu-trigger');

$trigger.click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('overlay');
    $(fall).slideUp();
    $collapse.removeClass("current");
});
// $('.toggle').click(function() {
//     $('body').removeClass('overlay');
// });

// 行動裝置的產品分類選單
$(".pro-menu").click(function() {
    $(this).toggleClass("active");
    // $('aside nav').slideToggle(750);
    $('.sidebar').slideToggle(170);
    $(fall).slideUp();
    $collapse.removeClass("current");
});

// 搜尋框縮放
// var submitIcon = $("[data-expand='icon']");
// var inputBox = $("[data-expand='input']");
// var searchBox = $("[data-expand='box']");
// var isOpen = false;
// submitIcon.click(function(){
//     if(isOpen == false){
//         searchBox.addClass('search-open');
//         inputBox.focus();
//         isOpen = true;
//     } else {
//         searchBox.removeClass('search-open');
//         inputBox.focusout().val('');
//         $("[data-expand='btn']").removeClass('enter');
//         isOpen = false;
//     }
// });
// submitIcon.mouseup(function(){
//     return false;
// });
// searchBox.mouseup(function(){
//     return false;
// });
// $(document).mouseup(function(){
//     if(isOpen == true){
//         $("[data-expand='icon']").css('display','block');
//         submitIcon.click();
//     }
// });

// function buttonUp(){
//     var inputVal = $("[data-expand='input']").val();
//     inputVal = $.trim(inputVal).length;
//     if( inputVal !== 0){
//         $("[data-expand='icon']").css('display','none');
//         $("[data-expand='btn']").addClass('enter');
//     } else {
//         $("[data-expand='input']").val('');
//         $("[data-expand='icon']").css('display','block');
//         $("[data-expand='btn']").removeClass('enter');
//     }
// }
