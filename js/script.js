$(document).ready(function(){
    
    // 1 - (TOTAL CART)
    
    $('.header-container').on('mousedown', 'a', function(){
        console.log(this); 
        $(this).toggleClass('total-cost-click');
        //$(this).parent().toggleClass('highlighted');//si la clase esta presente la quita pero sino la agrega
        $('.cartshop-container').toggleClass('cartshop-container-on');
    });

    

    // 2 - (ACTUALIZO EL STORE DESDE JSON)
    
    //Obteniendo JSON desde el servidor
    $.ajax('/json/destinations.json', {
        dataType: 'json',
        contentType: 'application/json',
        //para evitar enviar lo que tenia en el cache
        cache: false
    })
    .done(function(response){
        //obtengo en response el objeto json
        console.log(response);
        
        var html_json;

        //para cada elem del json realizo lo siguiente:
        $.each(response, function(index, element){
            //console.log(index);
            //console.log(element);
            
            //puedo usar librerias de plantillas tambien
            //agrego al html cada parte del codigo para armar otro bloque con los destinos turisticos
            html_json = '<div class="item-box" data-id="'+ element.id +'">';
                html_json += '<img src="https://cloudfour.com/examples/img-currentsrc/images/kitten-small.png" />';
                html_json += '<div class="item-title">'+ element.name +'</div>';
                html_json += '<p>'+ element.description +'</p>';
                html_json += '<div class="item-price">'+ element.price +'</div>';
                html_json += '<button>Add to cart</button>';
                html_json += '<div> <a href="#" class="info-link">More info</a> </div>';
                html_json += '<div class="more-info"> <p>'+ element.moreInfo +'</p> </div>';
            html_json += '</div>';

            //ahora simplemente añadimos los items en el store
            $('.store-container').append(html_json);
        });
    });



    // 3 - (AGREGANDO ELEMENTOS AL CARRITO)

    // para tomar los id que tengo en el carrito
    var cart_items_id = [0];
    //total del carrito
    var cart_total=0;

    $('.store-container').on('click', 'button', function(){
        
        //tomo el titulo y el id del item que hice click
        var item_title = $(this).parent().children('.item-title').text();
        var item_id= $(this).closest('.item-box').data('id');

        //agrego el item a la lista si es que no esta
        if($.inArray(item_id, cart_items_id) == -1){

            console.log("el item "+ item_id +" no esta en la lista, agregando...");

            cart_items_id.push(item_id);
            console.log("el carrito actualizado tiene los items: " + cart_items_id);

            var html_item_title =   '<div class="cart-item" data-id="'+ item_id +'" data-cant="1">\
                                        <div class="remove">X</div>\
                                    '
                                        + item_title + '\ </div>';

            //agrego el html
            $('.cartshop-container').append(html_item_title);

            //actualizo el carrito
            $.ajax('/json/destinations.json', {
                dataType: 'json',
                contentType: 'application/json',
                //para evitar enviar lo que tenia en el cache
                cache: false
            })
            .done(function(response){
                //busco el elemento para agregar el precio al carrito
                $.each(response, function(index, element){
                    if(element.id==item_id){
                        console.log(element.price);
                        cart_total+=element.price;
                        $('#total-cost').text('Total $'+cart_total);
                    }
                });

            });

        }else{
            alert("No puedes repetir la elección");
            alert("Solo puedes elegir 1 de cada tarjeta");
            console.log("el item "+ item_id +" ya estaba en la lista");

            console.log("el carrito tiene los items: " + cart_items_id);

            //si ya esta entonces aumentaría en 1 el contador
            
        }
        
    });



    // 4 - (ELIMINANDO DEL CARRITO)
    
    $('.cartshop-container').on('click','.remove', function(){
        console.log("borrando...");
        //selecciono el padre que es el que quiero borrar
        var borrar_parent = $(this).parent();
        //selecciono el id del elemento
        var borrar_parent_id = $(this).parent().data('id');

        //elimino del array
        cart_items_id.splice($.inArray(borrar_parent_id, cart_items_id), 1);
        //elimino el html
        borrar_parent.remove();

        //actualizo el carrito
        $.ajax('/json/destinations.json', {
            dataType: 'json',
            contentType: 'application/json',
            //para evitar enviar lo que tenia en el cache
            cache: false
        })
        .done(function(response){
            //busco el elemento para agregar el precio al carrito
            $.each(response, function(index, element){
                if(element.id==borrar_parent_id){
                    console.log(element.price);
                    cart_total-=element.price;
                    $('#total-cost').text('Total $'+cart_total);
                }
            });

        });
    });


    // 5 - (More info link)
    $('.store-container').on('click','.item-box a.info-link',function(event){
        event.preventDefault();
        $(this).closest('.item-box').find('.more-info').toggle(500, function(){console.log("se completo")}); //tarda 1 seg en mostrarse y el otro param es la funcion de cuando termina
        //en vez de toggle puedo hacer show - hide
    });

});