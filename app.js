// HW1: add another portal
// HW2: render output as LINK to the source

const config = [
  {
    name: 'Point MD News',
    url: 'https://point.md/ru/novosti/poisk/',
    param: 'keyword',

    domMapping: {
      title: '.ujabma-2 h3',
      image: '.ujabma-2 img'
    }
  },
  {
    name: 'TV8 News',
    url: 'https://tv8.md/ro/search',
    param: 'query',

    domMapping: {
      title: 'h1 ~ a > div > div',
      image: 'h1 ~ a > img',
      href: 'h1 ~ a[href]'
      //href needs https://tv8.md to work
    }
  },
  {
    name: 'Publica News',
    url: 'https://www.publika.md/cauta/',
    param: 'q',

    domMapping: {
      title: '.pure-u-1-1 .single-article .article-content',
      image: '.pure-u-1-1 .single-article figure a img',
      href: '.pure-u-1-1 .single-article figure a[href]'
    }
  }
];


const formElement = document.querySelector("#form");
const inputElement = formElement.firstElementChild;

const contentElement = document.querySelector("#content");


const onKeypress = (e) => {
  e.preventDefault();
  // let keyPhrase = inputElement.value;
  // console.log(keyPhrase);     
}


const onSubmit = (e) => {
  e.preventDefault();

  let keyPhrase = inputElement.value;

  sendSearch(config[2], keyPhrase);

  inputElement.value = '';
}


const render = (data, parent) => {

  for (let i=0; i< data.length; i++) {
    
    let a = document.createElement('a');
    a.setAttribute('href', `${data[i].href}`);
    // console.log(`${data[i].href}`);

    let div = document.createElement('div');

    let h3 = document.createElement('h3');
    h3.innerText = data[i].title;
    // console.log(`${data[i].title}`);

    let img = document.createElement('img');
    img.src = data[i].img_src;

    div.appendChild(h3);
    div.appendChild(img);
    a.appendChild(div);

    contentElement.appendChild(a);
  }
}


const sendSearch = (portal, keyPhrase) => {
  console.log(portal, keyPhrase);

  // 1. prep the connection object
  let xhr = new XMLHttpRequest();

  // 2. setup
  xhr.open('GET', portal.url + "?" + portal.param + "=" + keyPhrase);

  // 2.a  callback
  xhr.onload = () => {
    let html = xhr.responseText;
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(html, 'text/html'); // DOM structure
    // console.log(htmlDoc);

    let titleElement = htmlDoc.querySelectorAll(portal.domMapping.title);
    let imageElement = htmlDoc.querySelectorAll(portal.domMapping.image);
    let hrefElement = htmlDoc.querySelectorAll(portal.domMapping.href);
    // console.log(titleElement);
    // console.log(imageElement);
    // console.log(hrefElement);

    // document.body.innerHTML = htmlDoc.body.innerHTML;

    let news = [];
    for (let i=0; i<titleElement.length; i++) {
      news.push({
        title: titleElement[i].innerText,
        img_src: imageElement[i].src,
        href: hrefElement[i].href 
      });
    }
    // console.log(news);
    render(news, contentElement);
  }

  // 3. send the request
  xhr.send();
}


inputElement.addEventListener('keyup', onKeypress);
formElement.addEventListener('submit', onSubmit);
