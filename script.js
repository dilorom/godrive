// ============================
// GoDrive - FINAL JS (Stable Version)
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // ELEMENTS
  // ============================
  const dropdown = document.getElementById("langDropdown");
  const selected = document.getElementById("selectedLang");
  const selectedFlag = document.getElementById("selectedFlag");
  const selectedText = document.getElementById("selectedText");
  const optionsContainer = document.getElementById("langOptions");

  const options = document.querySelectorAll(".option");
  const translatableNodes = document.querySelectorAll(".translatable");
  const form = document.getElementById("uploadForm");

  // ============================
  // 🔥 FIX: CURRENT YEAR
  // ============================
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================
  // TRANSLATIONS (SAFE)
  // ============================
  const translations = {
    en: {
      "hero-h1": "Fast & Certified Driving License Translation",
      "hero-p": "A simple platform to translate and certify foreign driving licenses."
    },
    ru: {
      "hero-h1": "Перевод водительских прав",
      "hero-p": "Простая платформа для перевода и сертификации."
    },
    uz: {
      "hero-h1": "Haydovchilik guvohnomasini tarjima qilish",
      "hero-p": "Oddiy va tez tarjima platformasi."
    },
    zh: {
      "hero-h1": "驾照翻译服务",
      "hero-p": "简单快速的翻译平台。"
    }
  };

  let currentLang = localStorage.getItem("preferredLanguage") || "en";

  // ============================
  // LANGUAGE ENGINE
  // ============================
  function updateText(lang) {
    translatableNodes.forEach(node => {
      const key = node.dataset.key;
      if (!key) return;

      const value = translations?.[lang]?.[key];
      if (value) node.innerHTML = value;
    });
  }

  function initLanguageUI() {
    const active = document.querySelector(`.option[data-lang="${currentLang}"]`);

    if (active) {
      selectedFlag.src = active.dataset.flag;
      selectedText.textContent = active.textContent.trim();
    }

    updateText(currentLang);
  }

  function setLanguage(option) {
    const lang = option.dataset.lang;
    const flag = option.dataset.flag;
    const text = option.textContent.trim();

    if (!lang) return;

    currentLang = lang;
    localStorage.setItem("preferredLanguage", lang);

    selectedFlag.src = flag;
    selectedText.textContent = text;

    updateText(lang);
  }

  // ============================
  // DROPDOWN CONTROL
  // ============================
  if (selected && optionsContainer) {

    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      optionsContainer.classList.toggle("open");
    });

    options.forEach(option => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        setLanguage(option);
        optionsContainer.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        optionsContainer.classList.remove("open");
      }
    });
  }

  // ============================
  // FORM UX
  // ============================
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email");
      const file = document.getElementById("licenseFile");

      if (!email?.value || !file?.files?.length) {
        showToast("Please fill in all fields");
        return;
      }

      setLoading(true);

      await wait(1200);
      showToast("Uploading...");
      await wait(1200);
      showToast("Processing...");
      await wait(1200);
      showToast("Generating translation...");
      await wait(1200);

      setLoading(false);
      showSuccess();
    });
  }

  // ============================
  // HELPERS
  // ============================
  function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  function showToast(msg) {
    let el = document.querySelector(".toast");

    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }

    el.textContent = msg;

    el.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #111;
      color: #fff;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;

    setTimeout(() => el.remove(), 2500);
  }

  function setLoading(state) {
    const btn = form?.querySelector("button");
    if (!btn) return;

    btn.disabled = state;
    btn.textContent = state ? "Processing..." : "Upload & Continue";
    btn.style.opacity = state ? "0.6" : "1";
  }

  function showSuccess() {
    const container = document.querySelector(".upload-section");
    if (!container) return;

    container.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <div style="font-size:48px;">✅</div>
        <h2>Upload Successful</h2>
        <p style="color:#666; margin-top:10px;">
          Your document is being processed.
        </p>
        <button class="btn btn-primary" style="margin-top:20px;" onclick="location.reload()">
          Upload Another
        </button>
      </div>
    `;
  }

  // ============================
  // INIT
  // ============================
  initLanguageUI();

});