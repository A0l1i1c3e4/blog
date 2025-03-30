const authorList = document.getElementById('author-list');
const authorTemplate = document.getElementById('author-template');

const loginButton = document.getElementById('in');
const profileButton = document.getElementById('profileButton');
const logoutButton = document.getElementById('logoutButton');
const userMenu = document.getElementById('userMenu');
let userMenuListenerAttached = false;

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

function activate(email){
  if (!userMenuListenerAttached) {
    loginButton.addEventListener('click', () => {
    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    });
    loginButton.textContent = email + ' ▾';
    profileButton.style.display = 'inline-block';
    logoutButton.style.display = 'inline-block';

    profileButton.addEventListener('click', () => {
      window.location.href = 'file:///E:/TSU/Front/lab2/prof/profile.html'
    });

    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'file:///E:/TSU/Front/lab2/log/login.html';
    });
    userMenuListenerAttached = true;
  }
}

window.addEventListener('load', () => { 
  const authToken = localStorage.getItem('token'); 
  fetch('https://blog.kreosoft.space/api/author/list', {  
    method: 'GET',  
    headers: {  
      'Content-Type': 'application/json'  
    },
  })  
  .then(response => {  
    if (!response.ok) {  
         
      return response.text().then(text => { throw new Error(text) });  
    }  
    return response.json(); 
  }) 
  .then(data => {  
    data.forEach(author => { 
      const authorBlock = authorTemplate.content.cloneNode(true); 
       
      if(author.gender=="Male")        {
        authorBlock.querySelector('img').src = 'https://sun9-80.userapi.com/impg/ABAM2rjROlJJKMK5fNiiKxoLtroQKf2K49-Hwg/Di0hQkgh318.jpg?size=387x387&quality=95&sign=4e3618501c6833a9798a101cb313e3d5&type=album';
      }
      else {authorBlock.querySelector('img').src = 'https://sun9-80.userapi.com/impg/msquQVKiPuvj-EEPAo3v1-rj4kptEnmZYVJ24Q/86f_6d-bfFM.jpg?size=386x383&quality=95&sign=ef97469c6ae92fbca9d459007d3bfa75&type=album';}
      
      authorBlock.querySelector('h2').textContent = author.fullName; 
      authorBlock.querySelector('p:first-of-type').textContent = `Создан: ${formatDate(author.created)}`; 
      authorBlock.querySelector('.birthdate').textContent = `Дата рождения: ${formatDate(author.birthDate)}`; 
      authorBlock.querySelector('.author-stats button:first-of-type').textContent = `Постов: ${author.posts}`; 
      authorBlock.querySelector('.author-stats button:last-of-type').textContent = `Лайков: ${author.likes}`; 
      authorBlock.querySelector('img').addEventListener('click', () => { 
        localStorage.setItem('selectedAuthor', author.fullName); 
        window.location.href = 'file:///E:/TSU/Front/lab2/post/post.html'; 
      });
      authorList.appendChild(authorBlock); 
    });
  }) 
  .catch(error => { 
    console.error('Ошибка получения параметров профиля:', error); 
    alert('Ошибка получения параметров профиля: ' + error.message); 
  }); 
  if (authToken) { 
    //console.log('Токен получен из localStorage:', localStorage.getItem('token')); 
    email=localStorage.getItem('email') 
    document.getElementById('in').textContent=email; 
    activate(email); 
    
  } else {
    //console.log('Токен не найден в localStorage.');
    loginButton.addEventListener('click', () => {
      window.location.href = 'file:///E:/TSU/Front/lab2/log/login.html';
    });
  }
});