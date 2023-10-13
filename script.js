const c = (el) => {
    return document.querySelector(el)
};

const cs = (el) => {
    return document.querySelectorAll(el)
};

let cart = [];
let modalQTD = 1;
let modalKey = 0;

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

c('.pizzaInfo--addButton').addEventListener('click', () =>{
    let size = Number(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    if (modalQTD > 0) {
        cart.push({
            id:pizzaJson[modalKey],
            size,
            quantidade: modalQTD

        })
        fecharModal()

        setTimeout(() =>{
            alert('Pizza adicionada ao carrinho')
        }, 500)
    }
})

cs('.pizzaInfo--size').forEach((size) =>{
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})