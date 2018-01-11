/**
 * Created by admin on 09.01.2018.
 */
(function() {
    'use strict';

    window.addEventListener('load', function() {
        var form = document.getElementById('needs-validation');
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

jQuery( document ).ready( function( $ ) {
    $( document.body ).on( 'click', '.move-to-form', function( e ) {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $("#callback").offset().top
        }, 2000);
    });
    $( '.service-list' ).slick({
        slide:'.service-list__item',
        variableWidth:true,
        prevArrow:'<div class="banner-head__carousel-control banner-head__carousel-control--prev slick-prev"><span class="angle"></span></div>',
        nextArrow:'<div class="banner-head__carousel-control banner-head__carousel-control--next slick-next"><span class="angle"></span></div>',
        slidesToShow:2,
        slidesToScroll:2,
        useCSS:true,
        appendArrows:$('.services-nav')
    });
    $( '.reviews-list').slick({
        slide:'.reviews-list__item',
        slidesToShow:1,
        slidesToScroll:1,
        fade:true,
        prevArrow:'<div class="banner-head__carousel-control banner-head__carousel-control--prev slick-prev"><span class="angle"></span></div>',
        nextArrow:'<div class="banner-head__carousel-control banner-head__carousel-control--next slick-next"><span class="angle"></span></div>',
        appendArrows:$('.reviews-nav')
    });
    $( '#needs-validation').on( 'submit', function( e ){
        e.preventDefault();
        var $self = this;
        var $form = $( $self );
        $.ajax({
            url:$form.attr('action'),
            method:$form.attr( 'method' ),
            dataType: 'json',
            data:{
                phone:$form.find('input[name=phone]').val(),
                name:$form.find('input[name=name]').val()
            },
            beforeSend:function(){
                $form.find('input[type=submit]').prop( 'disabled', true );
            },
            success: function( data ) {
                //console.log( data );
                var popup = $( '<div />', {
                    class:'form-result-popup',
                    text: data.text
                });
                $( 'body' ).append( popup );

                $( document.body ).on( 'click', function(){
                    popup.remove();
                });
            }
        });
    });
});
