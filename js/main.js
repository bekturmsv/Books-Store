const API = 'http://localhost:8888'
let pageCount = 1;
let page = 1;
let searchValue = '';
rednderInfo()

$('.add-btn').on('click',function(){
    if(!$('.name').val().trim() || !$('.year').val().trim() || !$('.image').val().trim() || !$('.description').val().trim() || !$('.price').val()||!$('.rate').val().trim() || !$('.author').val().trim()){
        alert('Заполните все поля!')
        return
    }
    if($('.rate').val()> 100){
        alert('Рейтинг не может быть больше 100')
        return
    }
    let newBook = {
        name: $('.name').val(),
        year: $('.year').val(),
        image: $('.image').val(),
        description: $('.description').val(),
        rate: $('.rate').val(),
        price: $('.price').val(),
        author: $('.author').val(),
    }
    fetch(API + '/books',{
        method:'POST',
        body: JSON.stringify(newBook),
        headers:{
            "Content-type":"application/json"
        }
    })
    .then(()=>rednderInfo())
    $('.name').val('')
    $('.year').val('')
    $('.image').val('')
    $('.description').val('')
    $('.rate').val('')
    $('.author').val('')
    $('.price').val('')

})
function getPagination(){
    fetch(`http://localhost:8888/books`)
    .then(res => res.json())
    .then(data => {
        
         pageCount = Math.ceil(data.length / 6)
         $('.pagination-page').remove()
        for(let i = pageCount; i >= 1 ; i--){
            $('.prev-btn').after(`
            <span class = "pagination-page"><a href="#" alt = "..." class="page-num">${i}</a></span>
            `)
        }
    })
    }

    $('body').on('click','.pagination-page', function(event){
        page = event.target.innerText
        rednderInfo()
    })
    
    $('.search-inp').on('input', function(e){
        searchValue = e.target.value
        rednderInfo()
    })
    $('.next-btn').on('click',function(){
        if(page >= pageCount) return
        page++        
        rednderInfo()
    })
    $('.prev-btn').on('click',function(){
        if(page <= 1) return
        page--       
        rednderInfo()
    })
    $('.showAll').on('click',function(){
        $('.books-block > .card').css('dispaly','block')
            
        
    })
function rednderInfo(){
    fetch(`${API}/books?_page=${page}&_limit=6&q=${searchValue}`)
    .then(res => res.json())
    .then(personData => {
        getPagination()
        $('.books-block').html('')
        personData.forEach(item => {
        $('.books-block').append(`
        <div class = "card" style="width:18rem;">
        <img src="${item.image}" class="card-img-top" alt="...">
        <div class = "card-body">
        <span class="name-sur">
        <span>${item.name}</span> <span>${item.year}</span>  <span class="rate">${item.rate}/100</span><br><span>${item.author}</span> <br> 
        <span class="price">${item.price} сом</span> 
        </span>
        <p class = "card-text">${item.description.slice(0,50)}...</p>
        <a href = "#" id = "${item.id}" class = "edit-btn btn btn-primary">Редактировать</a>
        <a href = "#" id = "${item.id}" class = "btn-delete btn btn-primary">Удалить</a>

        </div>
        </div>
        `)
    })
})
}

$('body').on('click','.btn-delete',function(event){
    let id = this.id
    fetch(`${API}/books/${id}`,{
        method:"DELETE"
    })
    .then(res=>res.json())
    .then(data => rednderInfo())
})


$('body').on('click','.edit-btn', function(){
    let id = this.id
    fetch(`${API}/books/${id}`)
    .then(res=>res.json())
    .then(person => {
         $('.edit-name').val(person.name),
        $('.edit-year').val(person.year),
         $('.edit-image').val(person.image),
         $('.edit-description').val(person.description),
         $('.edit-rate').val(person.rate),
         $('.edit-author').val(person.author),
         $('.edit-price').val(person.price),
         $('.btn-save').attr('id',id),
         
         $('.main-modal').css('display','block')
    })
})
$('.btn-close').on('click',function(){
    $('.main-modal').css('display','none');
    
})
$('.btn-save').on('click',function(){
    if($('.edit-rate').val()>100){
        alert('Рейтинг не может быть больше 100')
        return
    }
    let newBook = {
        name: $('.edit-name').val(),
        year: $('.edit-year').val(),
        image: $('.edit-image').val(),
        description: $('.edit-description').val(),
        rate: $('.edit-rate').val(),
        price: $('.edit-price').val(),
        author: $('.edit-author').val(),

    }
    fetch(`${API}/books/${this.id}`,{
        method:"PATCH",
        body: JSON.stringify(newBook),
        headers:{
            "Content-type":"application/json"
        }
    })
    .then(()=>{
        $('.main-modal').css('display','none')
        rednderInfo()
    })

   
   
})
$('.add-content').on('click',function(){
        $('.inps').css('display', 'block')
        
        rednderInfo()
    })
    $('.close-added-inp').on('click',function(){
        $('.inps').css('display', 'none')
    })