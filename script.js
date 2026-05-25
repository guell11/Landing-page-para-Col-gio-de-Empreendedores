/* ==========================================================================
   COMPORTAMENTO INTERATIVO - COLÉGIO DE EMPREENDEDORES
   Premium Interactive Logic
   ========================================================================== */

const CONTACT_EMAIL = "Escoladeempreendedores2026@gmail.com";
const WHATSAPP_NUMBER = "558197089334"; // Número de WhatsApp oficial do cliente
const WHATSAPP_MESSAGE = "Olá! Gostaria de obter mais informações sobre as turmas e as matrículas do Colégio de Empreendedores.";

// Seletores Globais
const menuButton = document.querySelector(".menu-toggle");
const menuPanel = document.getElementById("menu-panel");
const menuBackdrop = document.querySelector("[data-menu-backdrop]");
const menuLinks = document.querySelectorAll(".menu-panel a");
const stageWrap = document.querySelector(".stage-wrap");
const enrollmentForm = document.getElementById("enrollment-form-main");
const successOverlay = document.getElementById("form-success-container");

const designSize = {
  width: 943,
  height: 1668,
};

/**
 * Controle de escala do simulador mobile exato do mockup original.
 * Mantém o alinhamento pixel-perfect tanto em dispositivos pequenos quanto grandes.
 */
function updateStageScale() {
  if (!stageWrap) {
    return;
  }

  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  
  // Fórmula matemática original de escala baseada no designSize
  const widthScale = Math.min(viewportWidth, designSize.width) / designSize.width;
  const heightScale = Math.min(viewportHeight, designSize.height) / designSize.height;
  const scale = viewportWidth < 900 ? widthScale : Math.min(widthScale, heightScale);
  
  const visibleDesignHeight = viewportHeight / scale;
  const extraHeight = Math.max(0, visibleDesignHeight - designSize.height);
  const cardTopOffset = extraHeight * 0.1;
  const dotOffset = extraHeight * 0.78;

  // Atualização das variáveis CSS
  document.documentElement.style.setProperty("--stage-scale", scale.toFixed(5));
  document.documentElement.style.setProperty("--stage-visible-height", `${visibleDesignHeight.toFixed(2)}px`);
  document.documentElement.style.setProperty("--stage-extra-height", `${extraHeight.toFixed(2)}px`);
  document.documentElement.style.setProperty("--card-extra-top", `${cardTopOffset.toFixed(2)}px`);
  document.documentElement.style.setProperty("--dot-extra-offset", `${dotOffset.toFixed(2)}px`);
  
  // Aplicação da largura e altura responsiva no contêiner do simulador
  stageWrap.style.width = `${Math.round(designSize.width * scale)}px`;
  stageWrap.style.height = `${Math.round(viewportHeight)}px`;
}

/**
 * Controla a abertura e fechamento do menu móvel (simulador)
 */
function setMenuState(isOpen) {
  if (!menuButton || !menuPanel || !menuBackdrop) {
    return;
  }

  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  menuPanel.setAttribute("aria-hidden", String(!isOpen));

  if (isOpen) {
    menuBackdrop.hidden = false;
  } else {
    // Sincroniza a remoção do backdrop com a animação de saída CSS (180ms)
    window.setTimeout(() => {
      if (!document.body.classList.contains("menu-open")) {
        menuBackdrop.hidden = true;
      }
    }, 180);
  }
}

/**
 * Rola de forma suave e alinha com a âncora selecionada
 */
function scrollToTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", hash);
}

/**
 * Inicialização e eventos do Menu Mobile (Simulador)
 */
function setupMenu() {
  if (!menuButton || !menuBackdrop) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  menuBackdrop.addEventListener("click", () => setMenuState(false));

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

/**
 * Scroll suave para todas as âncoras locais do site
 */
function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") {
      return;
    }

    link.addEventListener("click", (event) => {
      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      setMenuState(false);
      window.setTimeout(() => scrollToTarget(hash), 20);
    });
  });
}

/**
 * Gera URLs dinâmicas para todos os botões que acionam o WhatsApp
 */
function setupWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const customMsg = link.getAttribute("data-whatsapp-message");
    const msg = customMsg ? customMsg : WHATSAPP_MESSAGE;
    const queryText = encodeURIComponent(msg);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${queryText}`;

    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    
    // Suporta cliques em botões ou outras tags não-ancoradas
    if (link.tagName === "BUTTON") {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  });
}

/**
 * Alternador de abas dinâmicas do Público-alvo
 */
function switchTargetTab(idx) {
  const pills = document.querySelectorAll(".target-nav-pill-v2");
  const panes = document.querySelectorAll(".target-pane");

  pills.forEach((pill, i) => {
    pill.classList.toggle("is-active", i === idx);
  });
  
  panes.forEach((pane, i) => {
    pane.classList.toggle("is-active", i === idx);
  });
}

/**
 * Gerenciamento do Modal Premium de Vídeo Institucional
 */
const videoModal = document.getElementById("video-modal");
let modalVideo = null;

if (videoModal) {
  modalVideo = videoModal.querySelector("video");
}

function openVideoModal() {
  if (!videoModal) {
    return;
  }
  videoModal.classList.add("is-active");
  videoModal.setAttribute("aria-hidden", "false");
  if (modalVideo) {
    modalVideo.currentTime = 0;
    // Força o carregamento do vídeo local e inicia a reprodução de forma segura
    modalVideo.load();
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Autoplay barrado ou falha no carregamento. Aguardando clique do usuário:", err);
      });
    }
  }
}

function closeVideoModal() {
  if (!videoModal) {
    return;
  }
  videoModal.classList.remove("is-active");
  videoModal.setAttribute("aria-hidden", "true");
  if (modalVideo) {
    modalVideo.pause();
  }
}

// Configuração robusta de Event Listeners para evitar bloqueios de escopo ou CSP
function setupVideoModalListeners() {
  const videoTrigger = document.querySelector(".video-banner");
  const modalCloseBtn = document.querySelector(".premium-modal__close");
  const modalOverlay = document.querySelector(".premium-modal__overlay");

  if (videoTrigger) {
    // Removemos qualquer listener anterior e adicionamos o novo
    videoTrigger.removeAttribute("onclick");
    videoTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      openVideoModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.removeAttribute("onclick");
    modalCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeVideoModal();
    });
  }

  if (modalOverlay) {
    modalOverlay.removeAttribute("onclick");
    modalOverlay.addEventListener("click", (e) => {
      e.preventDefault();
      closeVideoModal();
    });
  }
}

/**
 * Tratamento avançado de formulário e pop-up de sucesso integrado
 */
function setupEnrollmentForm() {
  if (!enrollmentForm) {
    return;
  }

  enrollmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(enrollmentForm);
    const data = Object.fromEntries(formData.entries());
    const subject = "Solicitação de Matrícula - Colégio de Empreendedores";
    const body = [
      "# Dados do Interessado",
      "",
      `- Nome completo: ${data.nome || ""}`,
      `- E-mail: ${data.email || ""}`,
      `- Telefone: ${data.telefone || ""}`,
      `- Rede Social: ${data.redeSocial || "Não informada"}`,
      `- Origem do contato: ${data.origem || ""}`,
      "",
      "---",
      "Contato enviado através da landing page premium do Colégio de Empreendedores."
    ].join("\n");

    // Exibe imediatamente o pop-up integrado de sucesso com animação
    if (successOverlay) {
      successOverlay.classList.add("is-active");
    }

    enrollmentForm.reset();

    // Redireciona para o mailto em background após exibir o feedback de sucesso na página
    window.setTimeout(() => {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 850);
  });
}

function closeSuccessAlert() {
  if (successOverlay) {
    successOverlay.classList.remove("is-active");
  }
}

/**
 * Configuração do IntersectionObserver para animações dinâmicas de rolagem
 */
function setupScrollAnimations() {
  const animElements = document.querySelectorAll(".landing-section, .animate-on-scroll");
  
  if (!("IntersectionObserver" in window)) {
    // Fallback caso o navegador não suporte IntersectionObserver
    animElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  animElements.forEach((el) => observer.observe(el));
}

// Inicializações
updateStageScale();
setupMenu();
setupAnchorLinks();
setupWhatsAppLinks();
setupEnrollmentForm();
setupScrollAnimations();
setupVideoModalListeners();

// Expor funções globais para ações inline de botões HTML
window.switchTargetTab = switchTargetTab;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.closeSuccessAlert = closeSuccessAlert;

// Listeners de Redimensionamento
window.addEventListener("resize", updateStageScale);
window.visualViewport?.addEventListener("resize", updateStageScale);
