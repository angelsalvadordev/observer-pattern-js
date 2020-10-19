// get ui elements
const ulList = document.querySelector(".list-group");
const uiButton = document.querySelector("#button-add");
const uiInput = document.querySelector(".form-control");
const uiBadge = document.querySelector(".badge");
const uiAlertsContainer = document.querySelector(".alerts");

// create observer
class Observer {
  constructor() {
    this.store = [];
    this.subscribers = [];
  }

  addArticle(article) {
    this.store.push(article);
    this.notifySubscribers();
  }

  deleteArticle(article) {
    this.store = this.store.filter((el) => el !== article);
    this.notifySubscribers();
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach((sub) => {
      sub(this.store);
    });
  }
}

const marketplace = new Observer();

// Create classes to subscribe
class List {
  constructor() {
    marketplace.addSubscriber(this.render);
  }

  render(elements) {
    ulList.innerHTML = elements.map((el) => `<li class="item py-1"><span>${el}</span><button class="delete btn btn-outline-danger btn-sm ml-3" type="button" id="button-add">x</button></li>`).join("");
  }
}

class Badge {
  constructor() {
    marketplace.addSubscriber(this.render);
  }

  render(elements) {
    uiBadge.innerHTML = elements.length;
  }
}

class Alert {
  constructor() {
    this.time = null;
    this.prevElements = 0;
    this.render = this.render.bind(this);
    marketplace.addSubscriber(this.render);
  }

  timeOut() {
    clearTimeout(this.time);

    this.time = setTimeout(() => {
      uiAlertsContainer.innerHTML = "";
    }, 4000);
  }

  render(elements) {
    if (this.prevElements > elements.length) {
      uiAlertsContainer.innerHTML = `<div class="alert-delete alert alert-info text-center" role="alert">Article has been deleted</div>`;
      this.prevElements = elements.length;
      this.timeOut();
      return;
    }

    uiAlertsContainer.innerHTML = `<div class="alert-success alert alert-success text-center" role="alert">Article has been added successfully</div>`;
    this.prevElements = elements.length;
    this.timeOut();
  }
}

// magic
uiButton.addEventListener("click", () => {
  const inputVal = uiInput.value;

  marketplace.addArticle(inputVal);
});

ulList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    console.log("click");
    const element = e.target.parentElement.firstChild.textContent;
    marketplace.deleteArticle(element);
  }
});

const list = new List();
const badge = new Badge();
const alert = new Alert();
