document.addEventListener("DOMContentLoaded", () => {
  const place = document.getElementById("section-example");
  const subTitle = document.querySelector("h2");
  const nav = document.querySelector(".all-examples");

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

  fetchData("./menu.json", "json").then((data) => {
    data.forEach(({ link, text, info }, index) => {
      const element = document.createElement("a");
      element.className = "item";
      if (index == 0) {
        element.classList.add("active-menu");
      }
      element.href = `#${link}`;
      element.setAttribute("data-iframe", link);
      if (info) {
        element.setAttribute("data-info", info);
      }
      element.textContent = text;
      nav.appendChild(element);
    });

    const examples = document.querySelectorAll(".item");
    examples.forEach((example) => {
      example.addEventListener("click", (event) => {
        renderIframe(example);
      });
    });

    const hash = location.hash;
    if (hash) {
      renderIframe(hash.replace("#", ""));
    } else {
      renderIframe("01.simple-map");
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

    // h2 title
    const title = document.createElement("h2");
    title.className = "title";
    title.id = dataIframe;
    const createText = document.createTextNode(
      check
        ? example.textContent
        : document.querySelector(`a[data-iframe="${example}"`).textContent
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
    flex.className += "flex info-description";

    const file = `${dataIframe}/script.js`;
    const template = `
      <div class="small open-source">
        <a href="${detectUrl(file)}" target="_blank">→ open source</a>
        <a href="#" class="show-code">show code</a>
      </div>${dataInfoTeamplte}`;

    flex.innerHTML = template;

    place.innerHTML = "";
    subTitle.innerHTML = "";
    place.insertAdjacentElement("afterbegin", title);
    place.insertAdjacentElement("beforeend", iframe);
    iframe.insertAdjacentElement("afterend", flex);

    const infoDescription = document.querySelector(".info-description");
    const pre = document.createElement("pre");
    pre.className = "code-place hidden";
    const code = document.createElement("code");

    pre.appendChild(code);

    infoDescription.insertAdjacentElement("afterend", pre);

    fetchData(detectUrl(`${file}`), "text")
      .then((data) => {
        code.className = "language-js";
        code.textContent = data;
      })
      .then(() => {
        document.querySelectorAll("pre code").forEach((el) => {
          hljs.highlightElement(el);
        });
      })
      .then(() => {
        const showCode = document.querySelector(".show-code");
        showCode.addEventListener("click", (e) => {
          e.preventDefault();
          pre.classList.toggle("hidden");
          document.body.classList.toggle("show-code-iframe");
        });
      });
  }

  function detectUrl(file) {
    let url =
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? file
        : `https://raw.githubusercontent.com/tomik23/leaflet-examples/master/docs/${file}`;
    return url;
  }
});
