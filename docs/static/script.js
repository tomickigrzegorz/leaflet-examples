document.addEventListener("DOMContentLoaded", () => {
  const place = document.getElementById("section-example");
  const subTitle = document.querySelector("h2");
  const nav = document.querySelector(".menu-examples");

  async function fetchData(url, type) {
    try {
      const response = await fetch(url);
      const data =
        type === "text" ? await response.text() : await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  let firstLink = "";

  fetchData("./menu.json", "json").then((data) => {
    const reverseArray = [...data].reverse();

    reverseArray.forEach(({ link, text, info, position, style }, index) => {
      if (index === 0) {
        firstLink = link;
      }

      const reversIndex = reverseArray.length - index;
      // add zero to index
      const zerofill =
        (reversIndex < 10 && reversIndex > -1 ? "0" : "") + reversIndex;

      const element = document.createElement("a");
      element.className = "item";
      if (index == 0) {
        element.classList.add("active-menu");
      }
      element.href = `#${link}`;
      element.rel = zerofill;
      element.setAttribute("data-iframe", link);
      element.setAttribute("data-css", style ? style : false);
      element.setAttribute("data-position", position);
      if (info) {
        element.setAttribute("data-info", info);
      }
      element.textContent = text.charAt(0).toUpperCase() + text.slice(1);

      nav.appendChild(element);
    });

    const examples = document.querySelectorAll(".item");
    examples.forEach((example) => {
      example.addEventListener("click", () => {
        renderIframe(example);
      });
    });

    const hash = location.hash;
    if (hash) {
      renderIframe(hash.replace("#", ""));

      document.querySelector(".active-menu").scrollIntoView();
    } else {
      renderIframe(firstLink);
    }
  });

  function renderIframe(example) {
    // check if object or stirng
    const check = typeof example === "object";

    const activeMenu = document.querySelector(".active-menu");
    activeMenu.classList.remove("active-menu");

    const style = check
      ? example
      : document.querySelector(`a[data-iframe="${example}"`);
    style.classList.add("active-menu");

    const dataIframe = check ? example.getAttribute("data-iframe") : example;

    // --------------------------------------------------
    // set proper position
    const isActive = document.querySelector(".active-menu");
    document.documentElement.removeAttribute("style");
    const positions = isActive.dataset.position.split(",");

    positions.map((position) => {
      position = position.trim().split(":");
      document.documentElement.style.setProperty(position[0], position[1]);
    });
    // --------------------------------------------------

    // h2 title
    const title = document.createElement("h2");
    title.className = "title";
    title.id = dataIframe;
    const createText = document.createTextNode(
      check
        ? example.textContent
        : document.querySelector(`a[data-iframe="${example}"`).textContent,
    );

    // adding text to h2
    title.appendChild(createText);

    // create iframe
    const iframe = document.createElement("iframe");
    iframe.src = `./${dataIframe}/index.html`;
    iframe.className = "iframe-wrapper";
    if (dataIframe === "25.fitBounds-with-padding") {
      iframe.classList.add("resize-h");
    }
    iframe.border = 0;
    iframe.width = "100%";
    iframe.height = "550px";

    // get data-info
    const dataInfo = check
      ? example.getAttribute("data-info")
      : document
          .querySelector(`a[data-iframe="${example}"`)
          .getAttribute("data-info");

    const dataInfoTeamplte = dataInfo
      ? `<div class="small">${dataInfo}</div>`
      : "";

    const flex = document.createElement("div");
    flex.className += "flex flex-direction-column info-description";

    const setHidden = isActive.dataset.css == "false" ? "hidden" : "";

    const showCssELement = isActive.dataset.css == "false" ? false : true;

    const filejs = `${dataIframe}/script.js`;
    const filecss = `${dataIframe}/style.css`;
    const template = `
      <div class="flex open-source">
        <a type="button" href="${detectUrl(
          filejs,
        )}" target="_blank">open JS file</a> 
        <a type="button" href="#" class="show-code-js">show JS code</a>
        <a type="button" href="#" class="show-code-css ${setHidden}">show CSS code</a>
        <a type="button" href="#" class="full-screen">full screen example</a>
      </div>${dataInfoTeamplte}`;

    flex.innerHTML = template;

    place.innerHTML = "";
    subTitle.innerHTML = "";
    place.insertAdjacentElement("afterbegin", title);
    place.insertAdjacentElement("beforeend", iframe);
    iframe.insertAdjacentElement("afterend", flex);

    // --------------------------------------------------
    // create css/js code to show

    const typeCode = [
      { type: "js", file: filejs, show: true },
      { type: "css", file: filecss, show: showCssELement },
    ];

    typeCode.forEach((obj) => {
      createPlaceWidthCodeCssAndJs(obj);
    });

    document.body.classList.remove("show-menu-examples");
  }

  function detectUrl(file) {
    let url =
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? file
        : `https://raw.githubusercontent.com/tomickigrzegorz/leaflet-examples/master/docs/${file}`;
    return url;
  }

  function createPlaceWidthCodeCssAndJs(obj) {
    const { type, file, show } = obj;

    if (!show) return;

    const infoDescription = document.querySelector(".info-description");

    const buttonCopy = document.createElement("button");
    buttonCopy.className = "copy-code";
    buttonCopy.textContent = "copy";

    const pre = document.createElement("pre");
    pre.className = `code-place-${type} language hidden`;
    pre.id = `code-place-${type}`;
    pre.dataset.lang = type;
    const code = document.createElement("code");
    // pre.appendChild(buttonCopy);
    pre.appendChild(code);

    infoDescription.insertAdjacentElement("afterend", pre);

    fetchData(detectUrl(`${file}`), "text")
      .then((data) => {
        code.className = `language-${type}`;
        code.textContent = data;
      })
      .then(() => {
        document.querySelectorAll("pre code").forEach((el) => {
          hljs.highlightElement(el);
        });
      });
  }

  document.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target;
    if (target.classList.contains("show-code-js")) {
      target.classList.toggle("show-code");
      const cssElementCss = document.querySelector(`.show-code-css`);
      cssElementCss.classList.remove("show-code");

      const jsElement = document.querySelector(`#code-place-js`);
      jsElement.classList.toggle("hidden");

      const cssElement = document.querySelector(`#code-place-css`);
      cssElement?.classList.add("hidden");
    }

    if (target.classList.contains("show-code-css")) {
      target.classList.toggle("show-code");
      const jsElementJs = document.querySelector(`.show-code-js`);
      jsElementJs.classList.remove("show-code");

      const cssElement = document.querySelector(`#code-place-css`);
      cssElement.classList.toggle("hidden");

      const jsElement = document.querySelector(`#code-place-js`);
      jsElement.classList.add("hidden");
    }

    if (target.classList.contains("full-screen")) {
      document.body.classList.add("show-code-full-screen");
    }

    if (target.classList.contains("hide-iframe")) {
      document.body.classList.remove("show-code-full-screen");
    }
  });
});

// ------------------------------------------------------------
// scroll shadow
const menu = document.querySelector(".menu-examples");

menu.addEventListener("scroll", addShadow);

function addShadow(e) {
  const el = e.target;
  if (el.scrollTop >= 52) {
    addRemoveClass(el, "add", "center-shadow");
    addRemoveClass(el, "remove", "top-shadow");
  } else {
    addRemoveClass(el, "add", "top-shadow");
    addRemoveClass(el, "remove", "center-shadow");
  }
}

function addRemoveClass(el, type, className) {
  return el.classList[type](className);
}

// ------------------------------------------------------------
// show menu

const showMenu = document.querySelector(".show-menu");
showMenu.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("show-menu-examples");
});

// close when click esc
window.addEventListener("keydown", function (event) {
  // close sidebar when press esc
  if (event.key === "Escape") {
    document.body.classList.remove("show-code-full-screen");
  }
});

// use arrow keys to navigate active-menu
document.addEventListener("keydown", (e) => {
  const activeMenu = document.querySelector(".active-menu");
  if (e.key === "ArrowDown") {
    // scrollIntoView minus li height
    activeMenu.nextElementSibling?.click();
    activeMenu.nextElementSibling?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  if (e.key === "ArrowUp") {
    activeMenu.previousElementSibling?.click();
    activeMenu.previousElementSibling?.scrollIntoView();
  }
});
