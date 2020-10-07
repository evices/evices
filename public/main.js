const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const fallback = document.querySelector(".fallback");

let userName = "";
let typing = false;

const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addToUsersBox(userName);
};

const addToUsersBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }

  const userBox = `
  <li class="chat_ib ${userName}-userlist">
  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="">
  <div>
      <h2>${userName}</h2>
      <h3>
          <span class="status green"></span>
          offline
      </h3>
  </div>
</li>
  `;
  inboxPeople.innerHTML += userBox;
};

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsg = `
  <li class="you incoming__message">
                  <div class="entete">
                      <span class="status green"></span>
                      <h2>${user}</h2>
                      <h3>${formattedTime}</h3>
                  </div>
                  <div class="triangle"></div>
                  <div class="message">
                  ${message}
                  </div>
              </li>`;

  const myMsg = `
  <li class="me outgoing__message">
                  <div class="entete">
                      <h3>${formattedTime}</h3>
                      <h2>Me</h2>
                      <span class="status blue"></span>
                  </div>
                  <div class="triangle"></div>
                  <div class="message">
                  ${message}
                  </div>
              </li>`;

  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

// new user is created so we generate nickname and emit event
newUserConnected();

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";

  socket.emit("typing", {
    isTyping: false,
    nick: userName,
  });

});

inputField.addEventListener("keyup", () => {
  socket.emit("typing", {
    isTyping: inputField.value.length > 0,
    nick: userName,
  });
});

socket.on("new user", function (data) {
  data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});


socket.on("typing", function (data) {
  const { isTyping, nick } = data;

  if (!isTyping) {
    fallback.innerHTML = "";
    return;
  }

  fallback.innerHTML = `<p>${nick} is typing...</p>`;
});