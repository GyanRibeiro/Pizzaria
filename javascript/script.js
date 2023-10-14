const c = (el) => {
    return document.querySelector(el)
};

const cs = (el) => {
    return document.querySelectorAll(el)
};

let cart = [];
let modalQTD = 1;
let modalKey = 0;
let totalCompra = 0;

// Listagem das Pizzas
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index)
    // preencher as informações
    pizzaItem.querySelector('.pizza-item--img img').src = item.img

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    c('.pizza-area').append( pizzaItem );

    
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQTD = 1;
        modalKey = key

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        c('.pizzaInfo--size.selected').classList.remove('selected')

        cs('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            (sizeIndex == 2) ? size.classList.add('selected') : null
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalQTD;

        c('.pizzaWindowArea').style.display = 'flex';
    })
    
});

// Events Modal
function fecharModal() {
    c('.pizzaWindowArea').style.display = 'none';
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((close) =>{
    close.addEventListener('click', fecharModal);
})

let qtdP = 1
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQTD > 0) {
        c('.pizzaInfo--qt').innerHTML = modalQTD -=1
    }
})

c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    c('.pizzaInfo--qt').innerHTML = modalQTD +=1
})

cs('.pizzaInfo--size').forEach((size) =>{
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});


c('.pizzaInfo--addButton').addEventListener('click', () =>{
    let size = Number(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identificador = pizzaJson[modalKey].id+'@'+size;

    let keyItem = cart.findIndex((item) => {
        return item.identificador === identificador
    })

    if (keyItem > -1) {
        cart[keyItem].quantidade += modalQTD;
    } else {
        cart.push({
            identificador,
            id:pizzaJson[modalKey].id,
            size,
            quantidade: modalQTD,
        })
     }
     updateCart();
     fecharModal();
})

let somaTotal = 0;

function updateCart() {
    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id === cart[i].id;
            })
            
            subtotal += cart[i].quantidade * pizzaItem.price;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName = cart[i].size;
            switch (pizzaSizeName) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
            
                case 1:
                    pizzaSizeName = 'M'
                    break;

                case 2:
                    pizzaSizeName = 'G'
                    break;
                    
                default:
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].quantidade > 1) {
                    cart[i].quantidade--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].quantidade++;
                updateCart();
            })

            c('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.preco-subtotal').innerHTML = subtotal.toFixed(2);
        c('.preco-desconto').innerHTML = desconto.toFixed(2);
        c('.total-compra').innerHTML = total.toFixed(2);
    } else {
        c('aside').classList.remove('show')
    }
}