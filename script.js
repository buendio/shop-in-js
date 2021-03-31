document.addEventListener('DOMContentLoaded', ( )=> {
  const search = document.querySelector('.search');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  const cartBtn = document.querySelector('#cart');
  const cart = document.querySelector('.cart');
  const category = document.querySelector('.category');
  const wishlistBtn =  document.querySelector('#wishlist')
  const wishlistCounter =  wishlistBtn.querySelector('.counter');
  const cartCounter =  cartBtn.querySelector('.counter');
  const cartWraper = document.querySelector('.cart-wrapper');
  const total = document.querySelector('.cart-total');
  const totalCnt = total.querySelector('span');
  const del = document.querySelector('.goods-delete');
  let wishlist = [];
  let goodsBasket = {};
  
  const getGoods = (handler, filter) => {
    fetch('db/db.json').then((response) => {
      return response.json();
     }).then(filter).then(handler);
  }
  


  
  const renderCard = (item) => {
    goodsWrapper.textContent='';
    if(item.length) {
      item.forEach(element => {
        goodsWrapper.appendChild(creatCard(element.id, element.title, element.price, element.imgMin));
      });
    }
    else {
      goodsWrapper.textContent = '⚠⚜ Внимание ❗ &#10071 :exclamation: ';
    }    
  } 

  const creatCard = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `<div class="card">
    <div class="card-img-wrapper">
      <img class="card-img-top" src="${img}" alt="">
      <button class="card-add-wishlist ${wishlist.includes(id)  ? 'active' : ''}" data-goods-id="${id}"></button>
    </div>
    <div class="card-body justify-content-between">
      <a href="#" class="card-title">${title}</a>
      <div class="card-price">${price} ₽</div>
      <div>
        <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
      </div>
    </div>
  </div>`
  return card;
  }

  goodsWrapper.appendChild(creatCard(1, 'Hola', 1000, 'img/temp/Archer.jpg'));
  const creatCart = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = `<div class="goods-img-wrapper">
    <img class="goods-img" src="${img}" alt="">

  </div>
  <div class="goods-description">
    <h2 class="goods-title">${title}</h2>
    <p class="goods-price">${price} ₽</p>

  </div>
  <div class="goods-price-count">
    <div class="goods-trigger">
      <button class="goods-add-wishlist" data-goods-id="${id}"></button>
      <button class="goods-delete" data-goods-id="${id}"></button>
    </div>
    <div class="goods-count">1</div>
  </div>`
  return card;
  }
  const renderCart = (item) => {
    cartWraper.textContent='';
    let totalCnt1 = 0;
    if(item.length) {
      item.forEach(element => {
        cartWraper.appendChild(creatCart(element.id, element.title, element.price, element.imgMin));  

          totalCnt1 += element.price;
          totalCnt.textContent = totalCnt1.toFixed(2);
        
        
      });
    }
    else {
      cartWraper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста ⚠⚜ Внимание ❗ </div> ';
    }
    
  }
  
  const openCart = () => {
    cart.style.display = 'flex';
    getGoods(renderCart, item => { 
      return item.filter(it => goodsBasket.hasOwnProperty(it.id))
    })
    
  }
  const closeCart = (e) => {
    if (e.target==cart || e.target.classList.contains('cart-close')) {
      cart.style.display = '';
    }
    
  }
  const random = item => {
    return item.sort(() => Math.random() - 0.5);
  }
  
  const chooseCategory = (e) => {
    
    const target = e.target;
    
    if (target.classList.contains('category-item')) {
      const categoryItem = document.querySelectorAll('.category-item');
      const category = target.dataset.category; 
      console.log(category)
      categoryItem.forEach(element => {
        element.classList.remove('active');
      });
      target.classList.add('active');
      getGoods(renderCard, (item) => {
        return item.filter(goods => {
           return goods.category.includes(category);
        });      
      });     
    }
  };
  const searchItem = e => {
    e.preventDefault();
    const input = e.target.elements.searchGoods.value.trim();
    if (input !== '') {      
      
      const searchString = new RegExp(input, 'i');
      getGoods(renderCard, item => {
       return item.filter(ifilter => searchString.test(ifilter.title))
      });
    }
    console.log(input);
    e.target.elements.searchGoods.value = '';
   
  }
  const storage = (get) => {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id)) ;
      }
    }
    else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));

    } 
    wishlistCounter.textContent = wishlist.length;  
  }
  const wishlistTogle = (item, target) => {
    if (wishlist.indexOf(item) + 1) {
      wishlist.splice(wishlist.indexOf(item), 1);
      target.classList.remove('active');
     }
     else {
      wishlist.push(item);
      target.classList.add('active');
     }

  }
  const addBasket = (item) => {
    if (goodsBasket[item]) {
      goodsBasket[item] += 1;
    }
    else {
      goodsBasket[item] = 1;
    }
    
    cartCounter.textContent = Object.keys(goodsBasket).length;
    coc();
    console.log(goodsBasket);
  }
  const wishCategory = e => {
   const target = e.target;
    const categoryItem = document.querySelectorAll('.card-add-wishlis');
   if (target.classList.contains('card-add-wishlist')){
     console.log(target.dataset.goodsId); 
     wishlistTogle(target.dataset.goodsId, target);
   };
   if (target.classList.contains('card-add-cart')){ 
     addBasket(target.dataset.goodsId);
   };
  
   let total = 0;

   wishlistCounter.textContent = wishlist.length;
   storage(); 
  }
  const showWishlist = e => {
    getGoods(renderCard, item => { 
      return item.filter(it => wishlist.includes(it.id))
    })
  }
  // возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
/////////////////////////////////////////////////////////////////////////
const coc = get => {
  if (get) {
     if (getCookie('goodsBasket')) {
      goodsBasket = JSON.parse(getCookie('goodsBasket'));
     }
      
   
    
    console.log(getCookie('goodsBasket'));
  }
  else {
    document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`
  }
  cartCounter.textContent = Object.keys(goodsBasket).length;
}

const rem = (id) => {
  delete goodsBasket[id];
  getGoods(renderCart, item => { 
    return item.filter(it => goodsBasket.hasOwnProperty(it.id))
  });
  
  cartCounter.textContent = Object.keys(goodsBasket).length;
  coc();
  console.log(goodsBasket);
}
const handlerBasket = e => {
 const target = e.target;
 
 if (target.classList.contains('goods-delete')){
  totalCnt.textContent = 0; 
  console.log(target.dataset.goodsId)
   rem(target.dataset.goodsId, target);
 };
}


  getGoods(renderCard);
  storage(true);
  coc(true);
  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  search.addEventListener('submit', searchItem);  // инпут поиск
  category.addEventListener('click', chooseCategory); // Фильтры radio
  goodsWrapper.addEventListener('click', wishCategory); // Избранное 
  wishlistBtn.addEventListener('click', showWishlist); // Показать избранное 
  cartWraper.addEventListener('click', handlerBasket); // Показать избранное  
   
  
})