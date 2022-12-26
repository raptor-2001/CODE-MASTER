import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//  Adding the loader effect in the chat window of bot
function loader(element){
  element.textcontent = '';

  loadInterval = setInterval(()=>{
    element.textcontent += '.';

    if(element.textcontent === '....'){
      element.textcontent = '';
    }
  },300); 
}


// UX enhancing app
function typeText(element,text){
    let index = 0;

    let interval =  setInterval(() => {
      if(index < text.length){
        element.innerHTML += text.charAt(index);
        index++;
      }else{
        clearInterval(interval);
      }
    },20)
}


// Generating unqiue id
function generateUniqueId(){

  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}.`;
}

// Creating the chat stripe

function chatStripe(isAi, value, unqiueId){
  return(
    `
      <div class = "wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${unqiueId}>${value}</div>
        </div>
      </div>
      
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true," ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);   

  const response = await fetch('https://code-master.onrender.com',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  
  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if(response.ok){
    const data = await response.json();
    const prasedData = data.bot.trim();

    typeText(messageDiv, prasedData);
    
  }else{

    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong, Please try again."
    alert(err);

  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})