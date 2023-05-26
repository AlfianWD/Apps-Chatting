<template>
  <div
    class="view login"
    v-if="state.username === '' || state.username === null"
  >
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Welcome to Chit Chat</h1>
        <label for="username">Username</label>
        <input type="text" v-model="inputUsername" placeholder="Siapa Kamu ?" />
        <button class="btn-login" type="submit">Login</button>
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    <section class="chat-box" ref="chatBox">
      <div
        v-for="message in state.messages"
        :key="message.key"
        :class="
          message.username == state.username
            ? 'message current-user'
            : 'message'
        "
      >
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>
    <footer>
      <form @submit.prevent="SendMessage">
        <input
          type="text"
          v-model="inputMessage"
          placeholder="Ketikan disini..."
        />
        <button class="btn-send" type="submit">Send</button>
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref, watch, nextTick } from "vue";
import db from "./db";

export default {
  setup() {
    const chatBoxRef = ref(null);
    const inputUsername = ref("");
    const inputMessage = ref("");

    const state = reactive({
      username: "",
      messages: [],
      maxMessages: 1,
      chatBox: null,
    });

    const Login = () => {
      if (inputUsername.value !== "" && inputUsername.value !== null) {
        state.username = inputUsername.value;
        inputUsername.value = "";

        //Berguna untuk scroll down ketika barusan login
        nextTick(() => {
          const chatBox = document.querySelector(".chat-box");
          chatBox.scrollTop = chatBox.scrollHeight;
        });
      }
    };
    const Logout = () => {
      state.username = "";
    };

    const SendMessage = () => {
      // const messagesRef = require("./db").default.database().ref("messages");s
      const messagesRef = db.database().ref("messages");

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value,
      };
      messagesRef.push(message);
      inputMessage.value = "";

      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
    };

    onMounted(() => {
      const messagesRef = db.database().ref("messages");

      messagesRef.on("value", (snapshot) => {
        const data = snapshot.val();

        if (data) {
          let messages = [];
          Object.keys(data).forEach((key) => {
            messages.push({
              id: key,
              username: data[key].username,
              content: data[key].content,
            });
          });

          // Set referensi elemen chat-box saat komponen dimuat
          chatBoxRef.value = document.querySelector(".chat-box");

          // Watch untuk melakukan scroll ke bawah saat state.messages berubah
          watch(
            () => state.messages,
            () => {
              nextTick(() => {
                chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
              });
            }
          );

          state.messages = messages;
        }
      });
    });

    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      Logout,
      chatBoxRef,
    };
  },
};
</script>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin: 0;
  padding: 0;
  align-items: center;
  box-sizing: border-box;
}

.login {
  position: fixed;
  left: 25%;
  transform: translate(-30%, -50%);
  box-shadow: 0px 0px 35px 2px black;
  border-radius: 15px;
  margin: 270px;
  padding: 50px;
  background-color: rgb(34, 165, 99);

  h1 {
    margin-bottom: 50px;
  }

  label {
    display: block;
    margin-bottom: 15px;
    font-size: 16px;
    transition: 0.4s;
  }

  input[type="text"] {
    appearance: none;
    border: none;
    outline: none;
    background: none;

    display: block;
    width: 100%;
    padding: 10px 15px;
    border-radius: 8px;
    margin-top: 15px;

    color: black;
    font-size: 18px;

    box-shadow: 0px 0px 0px rgb(0, 0, 0, 0);
    background-color: #f3f3f3;

    transition: 0.4s;

    &::placeholder {
      color: #888;
      transition: 0.4s;
    }
  }

  button {
    margin-top: 15px;
    margin-left: 85px;
    padding: 10px;
    width: 50%;
    background: none;
    border: 1px solid #ffffff;
    letter-spacing: 3px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    border-radius: 5px;
  }

  button:hover {
    background: rgba(12, 30, 15, 0.5);
  }
}

.chat {
  box-shadow: 0px 0px 35px 2px black;
  transform: translate(0%, 6%);
  border-radius: 15px;
  margin-left: 270px;
  margin-right: 270px;
  padding: 50px;
  background-color: rgb(34, 165, 99);

  .chat-box {
    overflow: auto;
    max-height: 200px;
    border-radius: 24px 24px 0px 0px;
    background-color: #fff;
    box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
    flex: 1 1 100%;
    padding: 30px;

    .message {
      display: flex;
      margin-bottom: 15px;

      .message-inner {
        .username {
          color: #000000;
          font-size: 16px;
          margin-bottom: 5px;
          padding-left: 15px;
          padding-right: 15px;
        }

        .content {
          display: inline-block;
          padding: 10px 20px;
          background-color: #f3f3f3;
          border-radius: 999px;

          color: #000000;
          font-size: 18px;
          line-height: 1.2em;
          text-align: left;
        }
      }

      &.current-user {
        margin-top: 30px;
        justify-content: flex-end;
        text-align: right;

        .message-inner {
          max-width: 75%;

          .content {
            color: #ffffff;
            font-weight: 600;
            background-color: #ea526f;
          }
        }
      }
    }
  }

  .logout {
    margin-top: 15px;
    margin-bottom: 10px;
    padding: 5px;
    width: 35%;
    background: none;
    border: 1px solid #ffffff;
    letter-spacing: 3px;
    cursor: pointer;
    font-size: 12px;
    color: white;
    border-radius: 5px;
  }

  .logout:hover {
    background: rgba(12, 30, 15, 0.5);
  }

  h1 {
    margin-bottom: 50px;
  }

  section {
    border-radius: 24px 24px 0px 0px;
    background-color: #fff;
    box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
    flex: 1 1 100%;
    padding: 50px;
  }

  input[type="text"] {
    appearance: none;
    border: none;
    outline: none;
    background: none;

    display: block;
    width: 100%;
    padding: 10px 15px;
    border-radius: 8px;
    margin-top: 15px;

    color: black;
    font-size: 18px;

    box-shadow: 0px 0px 0px rgb(0, 0, 0, 0);
    background-color: #f3f3f3;

    transition: 0.4s;

    &::placeholder {
      color: #888;
      transition: 0.4s;
    }
  }

  .btn-send {
    margin-top: 15px;
    margin-left: 65px;
    padding: 10px;
    width: 50%;
    background: none;
    border: 1px solid #ffffff;
    letter-spacing: 3px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    border-radius: 5px;
  }

  .btn-send:hover {
    background: rgba(12, 30, 15, 0.5);
  }
}
</style>
