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

// 行動裝置的主選單
$menuLeft = $('#menu');
$trigger = $('.menu-trigger');

$trigger.click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('push');
});
$('.toggle').click(function() {
    $('body').removeClass('push');
});

// 行動裝置的產品分類選單
// $(".pro-menu").click(function() {
//     $(this).toggleClass("active");
//     // $('aside nav').slideToggle(750);
//     $('#sidebar nav').toggleClass('open');
// });

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

// 搜尋框縮放
var submitIcon = $('.search span');
var inputBox = $('.search input');
var searchBox = $('.search');
var isOpen = false;
submitIcon.click(function(){
    if(isOpen == false){
        searchBox.addClass('search-open');
        inputBox.focus();
        isOpen = true;
    } else {
        searchBox.removeClass('search-open');
        inputBox.focusout().val('');
        $('.search button').removeClass('enter');
        isOpen = false;
    }
});
submitIcon.mouseup(function(){
    return false;
});
searchBox.mouseup(function(){
    return false;
});
$(document).mouseup(function(){
    if(isOpen == true){
        $('.search span').css('display','block');
        submitIcon.click();
    }
});

function buttonUp(){
    var inputVal = $('.search input').val();
    inputVal = $.trim(inputVal).length;
    if( inputVal !== 0){
        $('.search span').css('display','none');
        $('.search button').addClass('enter');
    } else {
        $('.search input').val('');
        $('.search span').css('display','block');
        $('.search button').removeClass('enter');
    }
}
