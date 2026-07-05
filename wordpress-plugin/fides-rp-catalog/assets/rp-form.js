(function () {
  const config = window.FIDES_RP_FORM_CONFIG || {};
  const mode = config.mode === "update" ? "update" : "create";
  const root =
    document.getElementById(
      mode === "update" ? "fides-rp-update-form-root" : "fides-rp-submit-form-root"
    ) || document.querySelector(".fides-rp-submission-root");
  if (!root) return;

  const apiBase = String(config.apiBase || "").replace(/\/$/, "");
  const restNonce = String(config.restNonce || "").trim();
  const contactEmail = String(config.contactEmail || "").trim();
  const fieldHelp = config.fieldHelp && typeof config.fieldHelp === "object" ? config.fieldHelp : {};
  const enums = config.enums && typeof config.enums === "object" ? config.enums : {};
  const enumLabels = config.enumLabels && typeof config.enumLabels === "object" ? config.enumLabels : {};
  const sectionIntro = String(config.sectionIntro || "").trim();
  const countries = Array.isArray(config.countries) ? config.countries : [];
  const VOCABULARY_URL = config.vocabularyUrl ? String(config.vocabularyUrl) : "";
  const VOCABULARY_FALLBACK_URL = config.vocabularyFallbackUrl ? String(config.vocabularyFallbackUrl) : "";
  const v2Limits = config.v2Limits && typeof config.v2Limits === "object" ? config.v2Limits : {};
  const RP_DESC_MAX = 2000;
  let vocabulary = null;

  const FORM_FIELD_TO_VOCAB = {
    vcFormat: "vcFormat",
    presentationProtocols: "presentationProtocol",
    interoperabilityProfiles: "interopProfile",
    readiness: "readiness",
    interactionMode: "interactionMode",
  };

  let selectedRpId = mode === "update" ? String(config.preselectRpId || "").trim() : "";
  let selectedRpLabel = "";
  let selectedOrgId = "";
  let selectedOrgLabel = "";

  const linkState = {
    supportedWallets: [],
    acceptedCredentialRefs: [],
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function updateRpDescriptionCounter() {
    const descEl = root.querySelector("#fides-rp-description");
    const counterEl = root.querySelector("#fides-rp-description-counter");
    if (!descEl || !counterEl) return;
    const len = String(descEl.value || "").length;
    counterEl.textContent = `${len.toLocaleString("en-US")} / ${RP_DESC_MAX.toLocaleString("en-US")} characters`;
    counterEl.classList.toggle("fides-description-counter--over", len > RP_DESC_MAX);
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function helpText(key) {
    return fieldHelp[key] ? String(fieldHelp[key]) : "";
  }

  function helpHtml(key) {
    const text = helpText(key);
    if (!text) return "";
    return `<p class="fides-help" data-vocab-field="${escapeHtml(FORM_FIELD_TO_VOCAB[key] || key)}">${escapeHtml(text)}</p>`;
  }

  function enumList(key) {
    return Array.isArray(enums[key]) ? enums[key] : [];
  }

  function enumLabelList(key) {
    return enumLabels[key] && typeof enumLabels[key] === "object" ? enumLabels[key] : {};
  }

  function labeledOption(value, labels, selected) {
    const label = labels[value] || value;
    const sel = selected === value ? " selected" : "";
    return `<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`;
  }

  function checkboxGroupHtml(name, values, labels) {
    return values
      .map((value) => {
        const label = labels[value] || value;
        return `<label class="fides-form-choice"><input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}" /> <span>${escapeHtml(label)}</span></label>`;
      })
      .join("");
  }

  function getCheckedValues(name) {
    return Array.from(root.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => String(el.value || "").trim()).filter(Boolean);
  }

  function parseListInput(raw) {
    return String(raw || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function countryLabel(code) {
    const upper = String(code || "").toUpperCase();
    const match = countries.find((entry) => String(entry.code || "").toUpperCase() === upper);
    return match && match.label ? String(match.label) : upper;
  }

  function countrySelectHtml(selected) {
    const sel = String(selected || "").toUpperCase();
    return countries
      .map((entry) => {
        const code = String(entry.code || "").toUpperCase();
        const label = entry.label ? String(entry.label) : code;
        return `<option value="${escapeHtml(code)}"${sel === code ? " selected" : ""}>${escapeHtml(label)}</option>`;
      })
      .join("");
  }

  function accordionSection(title, intro, bodyHtml) {
    const introHtml = intro ? `<p class="fides-form-section-intro">${escapeHtml(intro)}</p>` : "";
    return `
      <details class="fides-form-section fides-form-accordion">
        <summary class="fides-form-accordion-summary">
          <span class="fides-form-accordion-heading">
            <span class="fides-form-section-title">${escapeHtml(title)}</span>
            <span class="fides-form-accordion-badge">Optional</span>
          </span>
          <span class="fides-form-accordion-chevron" aria-hidden="true"></span>
        </summary>
        <div class="fides-form-accordion-panel">
          ${introHtml}
          <div class="fides-form-section-body">${bodyHtml}</div>
        </div>
      </details>`;
  }

  function formOrgPickerHtml() {
    return `
      <div id="fides-rp-org-picker" class="fides-form-section-body fides-org-update-picker-body">
        <div id="fides-rp-org-search-block" class="fides-linked-field">
          <label for="fides-rp-org-search">Organization *</label>
          ${helpHtml("orgSearch")}
          <div class="fides-linked-inputs">
            <input id="fides-rp-org-search" type="text" autocomplete="off" placeholder="Start typing organization name…" />
          </div>
          <div class="fides-lookup-panel">
            <p id="fides-rp-org-hint" class="fides-lookup-hint" hidden></p>
            <ul id="fides-rp-org-results" class="fides-lookup-results" role="listbox" aria-label="Organization search results"></ul>
          </div>
        </div>
        <div id="fides-rp-org-banner" class="fides-update-banner-row" hidden>
          <div class="fides-update-banner">
            <span class="fides-update-banner-label">Organization:</span>
            <strong id="fides-rp-org-name"></strong>
            <code id="fides-rp-org-id-display"></code>
          </div>
          <button type="button" class="fides-secondary-btn" id="fides-rp-org-change">Choose different</button>
        </div>
      </div>`;
  }

  function formCoreFieldsHtml() {
    const readiness = enumList("readiness");
    const statuses = enumList("status");
    const interactionModes = enumList("interactionMode");
    const readinessLabels = enumLabelList("readiness");
    const interactionLabels = enumLabelList("interactionMode");
    return `
      <div class="fides-form-section-body fides-rp-fields" hidden>
        <input type="hidden" id="fides-rp-org-id" name="orgId" value="" />
        <div class="fides-form-grid fides-form-grid-pair">
          <div class="fides-form-row">
            <label for="fides-rp-name">Relying party name *</label>
            ${helpHtml("name")}
            <input id="fides-rp-name" name="name" type="text" required maxlength="200" />
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-id">RP id *</label>
            ${helpHtml("id")}
            <input id="fides-rp-id" name="id" type="text" required maxlength="80" pattern="[a-z0-9-]+" ${mode === "update" ? 'readonly aria-readonly="true"' : ""} />
          </div>
        </div>
        <div class="fides-form-grid fides-form-grid-pair">
          <div class="fides-form-row">
            <label for="fides-rp-readiness">Readiness *</label>
            ${helpHtml("readiness")}
            <select id="fides-rp-readiness" name="readiness" required>
              <option value="">—</option>
              ${readiness.map((value) => labeledOption(value, readinessLabels, "use-case-demo")).join("")}
            </select>
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-country">Country *</label>
            ${helpHtml("country")}
            <select id="fides-rp-country" name="country" required>
              <option value="">—</option>
              ${countrySelectHtml("")}
            </select>
          </div>
        </div>
        <div class="fides-form-grid fides-form-grid-pair">
          <div class="fides-form-row">
            <label for="fides-rp-interaction-mode">Interaction mode *</label>
            ${helpHtml("interactionMode")}
            <select id="fides-rp-interaction-mode" name="interactionMode" required>
              <option value="">—</option>
              ${interactionModes.map((value) => labeledOption(value, interactionLabels, "")).join("")}
            </select>
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-status">Status</label>
            ${helpHtml("status")}
            <select id="fides-rp-status" name="status">
              <option value="">—</option>
              ${statuses.map((value) => labeledOption(value, {}, "")).join("")}
            </select>
          </div>
        </div>
        <div class="fides-form-row">
          <label for="fides-rp-description">Description</label>
          ${helpHtml("description")}
          <textarea id="fides-rp-description" name="description" maxlength="${RP_DESC_MAX}" rows="5" placeholder="Brief description of the verifier and its use case."></textarea>
          <div class="fides-field-meta">
            <p class="fides-description-limit-notice" id="fides-rp-description-limit-notice">Maximum ${RP_DESC_MAX.toLocaleString("en-US")} characters in the published catalog description.</p>
            <p class="fides-description-counter" id="fides-rp-description-counter" aria-live="polite"></p>
          </div>
        </div>
        <div class="fides-form-grid fides-form-grid-pair">
          <div class="fides-form-row">
            <label for="fides-rp-logo">Logo URL</label>
            ${helpHtml("logo")}
            <input id="fides-rp-logo" name="logo" type="url" placeholder="https://…/logo.png" />
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-website">Website</label>
            ${helpHtml("website")}
            <input id="fides-rp-website" name="website" type="url" placeholder="https://…" />
          </div>
        </div>
        <div class="fides-form-row">
          <span class="fides-form-label" id="fides-rp-vc-format-label">VC formats</span>
          ${helpHtml("vcFormat")}
          <div class="fides-form-choices" role="group" aria-labelledby="fides-rp-vc-format-label">
            ${checkboxGroupHtml("vcFormat", enumList("vcFormat"), enumLabelList("vcFormat"))}
          </div>
        </div>
        <div id="fides-rp-link-fields" class="fides-form-section-body"></div>
        <div class="fides-form-row">
          <span class="fides-form-label" id="fides-rp-interop-label">Interop profiles</span>
          ${helpHtml("interoperabilityProfiles")}
          <div class="fides-form-choices" role="group" aria-labelledby="fides-rp-interop-label">
            ${checkboxGroupHtml("interoperabilityProfiles", enumList("interoperabilityProfiles"), {})}
          </div>
        </div>
        ${
          contactEmail
            ? `<div class="fides-form-row">
          <label for="fides-rp-contact">Contact email *</label>
          ${helpHtml("contactEmail")}
          <input id="fides-rp-contact" class="fides-input-locked" type="email" value="${escapeHtml(contactEmail)}" readonly aria-readonly="true" tabindex="-1" />
        </div>`
            : `<p class="fides-form-message is-error">Your WordPress profile must have a valid email address before you can submit.</p>`
        }
      </div>`;
  }

  function formMediaSectionHtml() {
    return accordionSection(
      "Media",
      "Visuals shown on your public relying party listing — add cover images and optional demo videos.",
      `
        <div class="fides-media-section-body">
          <div class="fides-form-grid fides-media-grid">
            <div class="fides-media-col">
              <label>Cover images</label>
              <p class="fides-help fides-media-col-help">${escapeHtml(helpText("mediaImages") || "Screenshot or product image URLs.")}</p>
              <div id="fides-rp-image-rows" class="fides-media-rows" aria-live="polite"></div>
            </div>
            <div class="fides-media-col">
              <label>Demo videos</label>
              <p class="fides-help fides-media-col-help">${escapeHtml(helpText("mediaVideos") || "YouTube or Vimeo links to demos.")}</p>
              <div id="fides-rp-video-rows" class="fides-media-rows" aria-live="polite"></div>
            </div>
          </div>
          <p id="fides-rp-image-upload-status" class="fides-lookup-hint" hidden></p>
        </div>`
    );
  }

  function formOptionalSectionsHtml() {
    return `
      ${formMediaSectionHtml()}
      ${accordionSection(
        "Protocols & credentials",
        "Presentation protocols and additional accepted credential metadata.",
        `
          <div class="fides-form-row">
            <span class="fides-form-label" id="fides-rp-presentation-label">Presentation protocols</span>
            ${helpHtml("presentationProtocols")}
            <div class="fides-form-choices" role="group" aria-labelledby="fides-rp-presentation-label">
              ${checkboxGroupHtml("presentationProtocols", enumList("presentationProtocols"), {})}
            </div>
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-features">Features</label>
            ${helpHtml("features")}
            <input id="fides-rp-features" name="features" type="text" placeholder="Age verification, selective disclosure" />
          </div>`
      )}
      ${accordionSection(
        "Links & documentation",
        "Optional URLs shown on the public catalog detail page.",
        `
          <div class="fides-form-grid fides-form-grid-pair">
            <div class="fides-form-row">
              <label for="fides-rp-documentation">Documentation</label>
              ${helpHtml("documentation")}
              <input id="fides-rp-documentation" name="documentation" type="url" placeholder="https://…" />
            </div>
            <div class="fides-form-row">
              <label for="fides-rp-test-credentials">Test credentials</label>
              ${helpHtml("testCredentials")}
              <input id="fides-rp-test-credentials" name="testCredentials" type="url" placeholder="https://…" />
            </div>
          </div>
          <div class="fides-form-row">
            <label for="fides-rp-api-endpoint">API endpoint</label>
            ${helpHtml("apiEndpoint")}
            <input id="fides-rp-api-endpoint" name="apiEndpoint" type="url" placeholder="https://…" />
          </div>`
      )}`;
  }

  const sectionTitle = mode === "update" ? "Suggest a relying party update" : "Submit a relying party";
  const sectionIntroHtml = sectionIntro ? `<p class="fides-form-section-intro">${escapeHtml(sectionIntro)}</p>` : "";

  root.innerHTML = `
    <section class="fides-use-case-card">
      <form id="fides-rp-form" class="fides-use-case-form fides-rp-form" novalidate>
        <section class="fides-form-section fides-form-section-first" aria-labelledby="fides-rp-section-title">
          <div class="fides-form-accordion-heading">
            <h3 id="fides-rp-section-title" class="fides-form-section-title">${escapeHtml(sectionTitle)}</h3>
          </div>
          ${sectionIntroHtml}
          ${
            mode === "update"
              ? `<div id="fides-rp-update-picker" class="fides-form-section-body fides-org-update-picker-body">
            <div id="fides-rp-search-block" class="fides-linked-field">
              <label for="fides-rp-search">Find relying party *</label>
              ${helpHtml("rpSearch")}
              <div class="fides-linked-inputs">
                <input id="fides-rp-search" type="text" autocomplete="off" placeholder="Start typing…" />
              </div>
              <div class="fides-lookup-panel">
                <p id="fides-rp-lookup-hint" class="fides-lookup-hint" hidden></p>
                <ul id="fides-rp-lookup-results" class="fides-lookup-results" role="listbox" aria-label="Search results"></ul>
              </div>
            </div>
            <div id="fides-rp-update-banner" class="fides-update-banner-row" hidden>
              <div class="fides-update-banner">
                <span class="fides-update-banner-label">Updating:</span>
                <strong id="fides-rp-update-name"></strong>
                <code id="fides-rp-update-id"></code>
              </div>
              <button type="button" class="fides-secondary-btn" id="fides-rp-change">Choose different</button>
            </div>
          </div>`
              : formOrgPickerHtml()
          }
          ${formCoreFieldsHtml()}
        </section>
        <div class="fides-rp-optional-sections" hidden>${formOptionalSectionsHtml()}</div>
        <div id="fides-rp-submit-block" class="fides-org-submit-block" hidden>
          <div class="fides-consent">
            <label><input type="checkbox" name="consentPublish" required /> I confirm this information may be published *</label>
          </div>
          <div class="fides-form-actions">
            <button type="submit">${mode === "update" ? "Submit update proposal" : "Submit relying party"}</button>
          </div>
        </div>
        <p id="fides-rp-form-message" class="fides-form-message" aria-live="polite"></p>
      </form>
    </section>
  `;

  const form = root.querySelector("#fides-rp-form");
  const messageEl = root.querySelector("#fides-rp-form-message");
  const descInput = root.querySelector("#fides-rp-description");
  if (descInput) {
    descInput.addEventListener("input", updateRpDescriptionCounter);
  }
  updateRpDescriptionCounter();
  const fieldsWrap = root.querySelector(".fides-rp-fields");
  const optionalSections = root.querySelector(".fides-rp-optional-sections");
  const submitBlock = root.querySelector("#fides-rp-submit-block");
  const orgIdInput = root.querySelector("#fides-rp-org-id");
  const nameInput = root.querySelector("#fides-rp-name");
  const idInput = root.querySelector("#fides-rp-id");
  const linkFieldsRoot = root.querySelector("#fides-rp-link-fields");
  const searchInput = root.querySelector("#fides-rp-search");
  const updateBanner = root.querySelector("#fides-rp-update-banner");
  const searchBlock = root.querySelector("#fides-rp-search-block");
  const updateNameEl = root.querySelector("#fides-rp-update-name");
  const updateIdEl = root.querySelector("#fides-rp-update-id");
  const changeBtn = root.querySelector("#fides-rp-change");
  const imageRowsEl = root.querySelector("#fides-rp-image-rows");
  const videoRowsEl = root.querySelector("#fides-rp-video-rows");
  const imageUploadStatusEl = root.querySelector("#fides-rp-image-upload-status");
  const imageRowsState = [{ url: "" }];
  const videoRowsState = [{ url: "" }];

  function mediaImageMax() {
    return Number(v2Limits.mediaImages) || 10;
  }

  function mediaVideoMax() {
    return Number(v2Limits.mediaVideos) || 3;
  }

  function collectMediaUrls(state) {
    return state.map((entry) => String(entry.url || "").trim()).filter(Boolean);
  }

  function setImageUploadStatus(text) {
    if (!imageUploadStatusEl) return;
    if (!text) {
      imageUploadStatusEl.hidden = true;
      imageUploadStatusEl.textContent = "";
      return;
    }
    imageUploadStatusEl.hidden = false;
    imageUploadStatusEl.textContent = text;
  }

  function renderImageRows() {
    if (!imageRowsEl) return;
    const max = mediaImageMax();
    const lastIndex = imageRowsState.length - 1;
    imageRowsEl.innerHTML = imageRowsState
      .map((entry, index) => {
        const isLast = index === lastIndex;
        const canAdd = imageRowsState.length < max;
        let rowAction = "";
        if (isLast && canAdd) {
          rowAction = `<button type="button" class="fides-secondary-btn fides-media-action-btn" data-add-image="1">Add</button>`;
        } else if (!isLast || imageRowsState.length > 1) {
          rowAction = `<button type="button" class="fides-secondary-btn fides-media-action-btn" data-remove-image="${index}" aria-label="Remove image">Remove</button>`;
        }
        return `
          <div class="fides-media-row" data-image-index="${index}">
            <div class="fides-media-inputs fides-media-inputs--image">
              <input type="url" class="fides-media-url-input" data-image-url="${index}" value="${escapeHtml(entry.url || "")}" placeholder="https://…" inputmode="url" autocomplete="url" />
              <label class="fides-secondary-btn fides-media-action-btn fides-upload-btn">
                Upload
                <input type="file" data-image-file="${index}" accept="image/jpeg,image/png,image/webp,image/gif" hidden />
              </label>
              ${rowAction}
            </div>
            ${
              entry.url
                ? `<div class="fides-image-preview"><img src="${escapeHtml(entry.url)}" alt="Image preview" loading="lazy" /></div>`
                : ""
            }
          </div>`;
      })
      .join("");
  }

  function renderVideoRows() {
    if (!videoRowsEl) return;
    const max = mediaVideoMax();
    const lastIndex = videoRowsState.length - 1;
    videoRowsEl.innerHTML = videoRowsState
      .map((entry, index) => {
        const isLast = index === lastIndex;
        const canAdd = videoRowsState.length < max;
        let rowAction = "";
        if (isLast && canAdd) {
          rowAction = `<button type="button" class="fides-secondary-btn fides-media-action-btn" data-add-video="1">Add</button>`;
        } else if (!isLast || videoRowsState.length > 1) {
          rowAction = `<button type="button" class="fides-secondary-btn fides-media-action-btn" data-remove-video="${index}" aria-label="Remove video">Remove</button>`;
        }
        return `
          <div class="fides-media-row" data-video-index="${index}">
            <div class="fides-media-inputs fides-media-inputs--video">
              <input type="url" class="fides-media-url-input" data-video-url="${index}" value="${escapeHtml(entry.url || "")}" placeholder="https://youtube.com/…" inputmode="url" autocomplete="url" />
              ${rowAction}
            </div>
          </div>`;
      })
      .join("");
  }

  function setMediaRowsFromUrls(images, videos) {
    imageRowsState.length = 0;
    const imageUrls = (Array.isArray(images) ? images : []).slice(0, mediaImageMax());
    if (imageUrls.length) {
      imageUrls.forEach((url) => imageRowsState.push({ url: String(url) }));
    } else {
      imageRowsState.push({ url: "" });
    }
    videoRowsState.length = 0;
    const videoUrls = (Array.isArray(videos) ? videos : []).slice(0, mediaVideoMax());
    if (videoUrls.length) {
      videoUrls.forEach((url) => videoRowsState.push({ url: String(url) }));
    } else {
      videoRowsState.push({ url: "" });
    }
    renderImageRows();
    renderVideoRows();
    setImageUploadStatus("");
  }

  async function uploadImageFile(file, rowIndex) {
    if (!file || !apiBase) {
      setImageUploadStatus("Missing API configuration.");
      return;
    }
    setImageUploadStatus("Uploading…");
    const formData = new FormData();
    formData.append("file", file);
    const headers = {};
    if (restNonce) headers["X-WP-Nonce"] = restNonce;
    try {
      const response = await fetch(`${apiBase}/submissions/card-image`, {
        method: "POST",
        credentials: "same-origin",
        headers,
        body: formData,
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setImageUploadStatus(json.message || "Image upload failed.");
        return;
      }
      const url = json.url ? String(json.url) : "";
      if (!url) {
        setImageUploadStatus("Upload succeeded but no URL was returned.");
        return;
      }
      if (imageRowsState[rowIndex]) {
        imageRowsState[rowIndex].url = url;
      }
      renderImageRows();
      setImageUploadStatus("Image uploaded.");
    } catch (_err) {
      setImageUploadStatus("Image upload failed due to a network error.");
    }
  }

  function initRpMediaControls() {
    renderImageRows();
    renderVideoRows();

    if (imageRowsEl) {
      imageRowsEl.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-image-url")) return;
        const index = Number(target.getAttribute("data-image-url"));
        if (!Number.isFinite(index) || !imageRowsState[index]) return;
        imageRowsState[index].url = target.value.trim();
        renderImageRows();
      });

      imageRowsEl.addEventListener("change", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-image-file")) return;
        const index = Number(target.getAttribute("data-image-file"));
        const file = target.files && target.files[0];
        target.value = "";
        if (!Number.isFinite(index) || !file) return;
        uploadImageFile(file, index);
      });

      imageRowsEl.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.hasAttribute("data-add-image")) {
          if (imageRowsState.length >= mediaImageMax()) return;
          imageRowsState.push({ url: "" });
          renderImageRows();
          return;
        }
        const indexAttr = target.getAttribute("data-remove-image");
        if (indexAttr == null) return;
        const index = Number(indexAttr);
        if (!Number.isFinite(index) || imageRowsState.length <= 1) return;
        imageRowsState.splice(index, 1);
        renderImageRows();
      });
    }

    if (videoRowsEl) {
      videoRowsEl.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) || !target.hasAttribute("data-video-url")) return;
        const index = Number(target.getAttribute("data-video-url"));
        if (!Number.isFinite(index) || !videoRowsState[index]) return;
        videoRowsState[index].url = target.value.trim();
      });

      videoRowsEl.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.hasAttribute("data-add-video")) {
          if (videoRowsState.length >= mediaVideoMax()) return;
          videoRowsState.push({ url: "" });
          renderVideoRows();
          return;
        }
        const indexAttr = target.getAttribute("data-remove-video");
        if (indexAttr == null) return;
        const index = Number(indexAttr);
        if (!Number.isFinite(index) || videoRowsState.length <= 1) return;
        videoRowsState.splice(index, 1);
        renderVideoRows();
      });
    }
  }

  initRpMediaControls();

  function setMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text || "";
    messageEl.className = `fides-form-message ${type ? `is-${type}` : ""}`.trim();
  }

  function revealFields(visible) {
    if (fieldsWrap) fieldsWrap.hidden = !visible;
    if (optionalSections) optionalSections.hidden = !visible;
    if (submitBlock) submitBlock.hidden = !visible;
  }

  function submissionItemUrl(rpId) {
    const id = String(rpId || "").trim();
    if (!/^[a-z0-9-]+$/.test(id)) return "";
    return `${apiBase}/submissions/rp/${encodeURIComponent(id)}`;
  }

  function setCountryValue(code) {
    const select = root.querySelector("#fides-rp-country");
    if (!select) return;
    const upper = String(code || "").toUpperCase();
    if (!upper) {
      select.value = "";
      return;
    }
    const hasOption = Array.from(select.options).some((opt) => opt.value === upper);
    if (hasOption) {
      select.value = upper;
      return;
    }
    const option = document.createElement("option");
    option.value = upper;
    option.textContent = `${countryLabel(upper)} (${upper})`;
    option.selected = true;
    select.appendChild(option);
  }

  function setCheckboxValues(name, values) {
    const set = new Set(Array.isArray(values) ? values.map(String) : []);
    root.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
      el.checked = set.has(String(el.value));
    });
  }

  function renderLinkChips(container, key) {
    if (!container) return;
    container.innerHTML = (linkState[key] || [])
      .map((entry, index) => {
        const label = entry.labelRaw || entry.name || entry.refId || entry.credentialCatalogId || "Item";
        return `<span class="fides-chip" data-link-key="${escapeHtml(key)}" data-link-index="${index}">${escapeHtml(label)} <button type="button" aria-label="Remove">×</button></span>`;
      })
      .join("");
    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chip = btn.closest(".fides-chip");
        if (!chip) return;
        const linkKey = chip.getAttribute("data-link-key");
        const idx = Number(chip.getAttribute("data-link-index"));
        if (!linkKey || Number.isNaN(idx)) return;
        linkState[linkKey].splice(idx, 1);
        renderLinkChips(container, linkKey);
      });
    });
  }

  function addLinkField(fieldConfig) {
    if (!linkFieldsRoot) return;
    linkState[fieldConfig.key] = [];
    const wrapper = document.createElement("div");
    wrapper.className = "fides-linked-field";
    wrapper.innerHTML = `
      <label>${escapeHtml(fieldConfig.label)}</label>
      ${fieldConfig.helpKey ? helpHtml(fieldConfig.helpKey) : ""}
      <div class="fides-linked-inputs">
        <input type="text" placeholder="Search by name…" autocomplete="off" />
      </div>
      <div class="fides-lookup-panel">
        <p class="fides-lookup-hint" hidden></p>
        <ul class="fides-lookup-results" role="listbox" aria-label="Search results"></ul>
      </div>
      <div class="fides-chip-list"></div>
    `;
    const searchInput = wrapper.querySelector("input");
    const resultsEl = wrapper.querySelector(".fides-lookup-results");
    const hintEl = wrapper.querySelector(".fides-lookup-hint");
    const chipsEl = wrapper.querySelector(".fides-chip-list");
    let debounceTimer = null;

    function refreshChips() {
      renderLinkChips(chipsEl, fieldConfig.key);
    }

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        resultsEl.innerHTML = "";
        if (hintEl) {
          hintEl.hidden = true;
          hintEl.textContent = "";
        }
        if (query.length < 2) return;
        try {
          const { content: items, totalMatches } = await lookupFetch(fieldConfig.lookupType, query);
          if (!items.length) {
            if (hintEl) {
              hintEl.hidden = false;
              hintEl.textContent = "No matches.";
            }
            return;
          }
          const total = totalMatches || items.length;
          if (hintEl) {
            hintEl.hidden = false;
            hintEl.textContent = total === 1 ? "1 match — click to add" : `${total} matches — click to add`;
          }
          resultsEl.innerHTML = items
            .map(
              (item, idx) =>
                `<li><button type="button" class="fides-lookup-option" data-idx="${idx}"><span class="fides-lookup-option-main"><span class="fides-lookup-option-title">${escapeHtml(item.label || item.id || "Unnamed")}</span>${item.subtitle ? `<span class="fides-lookup-option-subtitle">${escapeHtml(item.subtitle)}</span>` : ""}</span><span class="fides-lookup-option-action">Add</span></button></li>`
            )
            .join("");
          resultsEl.querySelectorAll("button[data-idx]").forEach((btn) => {
            btn.addEventListener("click", () => {
              const picked = items[Number(btn.getAttribute("data-idx"))];
              if (!picked) return;
              const exists = (linkState[fieldConfig.key] || []).some((row) => row.refId === picked.id);
              if (exists) return;
              if (fieldConfig.key === "acceptedCredentialRefs") {
                linkState[fieldConfig.key].push({
                  refId: picked.id,
                  credentialCatalogId: picked.id,
                  labelRaw: picked.label || picked.id,
                  source: "catalog",
                });
              } else {
                linkState[fieldConfig.key].push({
                  refId: picked.id,
                  name: picked.label || picked.id,
                  labelRaw: picked.label || picked.id,
                  walletCatalogId: picked.id,
                  source: "catalog",
                });
              }
              refreshChips();
              resultsEl.innerHTML = "";
              searchInput.value = "";
              if (hintEl) hintEl.hidden = true;
            });
          });
        } catch (err) {
          if (hintEl) {
            hintEl.hidden = false;
            hintEl.textContent = err.message || "Lookup failed.";
          }
        }
      }, 250);
    });

    linkFieldsRoot.appendChild(wrapper);
    fieldConfig.refreshChips = refreshChips;
  }

  const linkFieldConfigs = [
    { key: "supportedWallets", label: "Supported wallets", lookupType: "wallet", helpKey: "supportedWallets" },
    { key: "acceptedCredentialRefs", label: "Accepted credentials", lookupType: "credential", helpKey: "acceptedCredentialRefs" },
  ];
  linkFieldConfigs.forEach(addLinkField);

  function fillForm(payload) {
    payload = payload && typeof payload === "object" ? payload : {};
    selectedOrgId = String(payload.orgId || selectedOrgId || "").trim();
    if (orgIdInput) orgIdInput.value = selectedOrgId;
    if (nameInput) nameInput.value = payload.name || "";
    if (idInput) idInput.value = payload.id || selectedRpId || "";
    const readinessEl = root.querySelector("#fides-rp-readiness");
    if (readinessEl) readinessEl.value = payload.readiness || "";
    setCountryValue(payload.country || "");
    const interactionEl = root.querySelector("#fides-rp-interaction-mode");
    if (interactionEl) interactionEl.value = payload.interactionMode || "";
    const statusEl = root.querySelector("#fides-rp-status");
    if (statusEl) statusEl.value = payload.status || "";
    const descEl = root.querySelector("#fides-rp-description");
    if (descEl) descEl.value = payload.description || "";
    updateRpDescriptionCounter();
    const logoEl = root.querySelector("#fides-rp-logo");
    if (logoEl) logoEl.value = payload.logo || "";
    const websiteEl = root.querySelector("#fides-rp-website");
    if (websiteEl) websiteEl.value = payload.website || "";
    setCheckboxValues("vcFormat", payload.vcFormat);
    setCheckboxValues("interoperabilityProfiles", payload.interoperabilityProfiles);
    setCheckboxValues("presentationProtocols", payload.presentationProtocols);
    const featuresEl = root.querySelector("#fides-rp-features");
    if (featuresEl) featuresEl.value = Array.isArray(payload.features) ? payload.features.join(", ") : "";
    const docEl = root.querySelector("#fides-rp-documentation");
    if (docEl) docEl.value = payload.documentation || "";
    const testEl = root.querySelector("#fides-rp-test-credentials");
    if (testEl) testEl.value = payload.testCredentials || "";
    const apiEl = root.querySelector("#fides-rp-api-endpoint");
    if (apiEl) apiEl.value = payload.apiEndpoint || "";
    const media = payload.media && typeof payload.media === "object" ? payload.media : {};
    setMediaRowsFromUrls(Array.isArray(media.images) ? media.images : [], Array.isArray(media.videos) ? media.videos : []);

    linkState.supportedWallets = [];
    if (Array.isArray(payload.supportedWallets)) {
      payload.supportedWallets.forEach((entry) => {
        if (typeof entry === "string") {
          linkState.supportedWallets.push({ name: entry, labelRaw: entry, source: "manual" });
          return;
        }
        if (!entry || typeof entry !== "object") return;
        linkState.supportedWallets.push({
          refId: entry.walletCatalogId || entry.refId || null,
          walletCatalogId: entry.walletCatalogId || entry.refId || null,
          name: entry.name || entry.labelRaw || "",
          labelRaw: entry.name || entry.labelRaw || entry.walletCatalogId || "",
          source: entry.walletCatalogId || entry.refId ? "catalog" : "manual",
        });
      });
    }

    linkState.acceptedCredentialRefs = [];
    if (Array.isArray(payload.acceptedCredentialRefs)) {
      payload.acceptedCredentialRefs.forEach((entry) => {
        if (!entry || typeof entry !== "object") return;
        const id = entry.credentialCatalogId || entry.refId || "";
        if (!id) return;
        linkState.acceptedCredentialRefs.push({
          refId: id,
          credentialCatalogId: id,
          labelRaw: entry.labelRaw || id,
          source: "catalog",
        });
      });
    }

    linkFieldConfigs.forEach((cfg) => {
      if (typeof cfg.refreshChips === "function") cfg.refreshChips();
    });
  }

  function buildPayload() {
    const payload = {
      orgId: orgIdInput ? String(orgIdInput.value || selectedOrgId || "").trim() : selectedOrgId,
      id: idInput ? String(idInput.value || "").trim() : "",
      name: nameInput ? String(nameInput.value || "").trim() : "",
      readiness: root.querySelector("#fides-rp-readiness") ? String(root.querySelector("#fides-rp-readiness").value || "").trim() : "",
      country: root.querySelector("#fides-rp-country") ? String(root.querySelector("#fides-rp-country").value || "").trim().toUpperCase() : "",
      interactionMode: root.querySelector("#fides-rp-interaction-mode")
        ? String(root.querySelector("#fides-rp-interaction-mode").value || "").trim()
        : "",
      description: root.querySelector("#fides-rp-description") ? String(root.querySelector("#fides-rp-description").value || "").trim() : "",
      logo: root.querySelector("#fides-rp-logo") ? String(root.querySelector("#fides-rp-logo").value || "").trim() : "",
      website: root.querySelector("#fides-rp-website") ? String(root.querySelector("#fides-rp-website").value || "").trim() : "",
      vcFormat: getCheckedValues("vcFormat"),
      interoperabilityProfiles: getCheckedValues("interoperabilityProfiles"),
      presentationProtocols: getCheckedValues("presentationProtocols"),
    };

    const status = root.querySelector("#fides-rp-status") ? String(root.querySelector("#fides-rp-status").value || "").trim() : "";
    if (status) payload.status = status;

    const features = parseListInput(root.querySelector("#fides-rp-features")?.value);
    if (features.length) payload.features = features;

    ["documentation", "testCredentials", "apiEndpoint"].forEach((key) => {
      const map = {
        documentation: "#fides-rp-documentation",
        testCredentials: "#fides-rp-test-credentials",
        apiEndpoint: "#fides-rp-api-endpoint",
      };
      const el = root.querySelector(map[key]);
      const val = el ? String(el.value || "").trim() : "";
      if (val) payload[key] = val;
    });

    const videos = collectMediaUrls(videoRowsState).slice(0, mediaVideoMax());
    const images = collectMediaUrls(imageRowsState).slice(0, mediaImageMax());
    if (videos.length || images.length) {
      payload.media = {};
      if (videos.length) payload.media.videos = videos;
      if (images.length) payload.media.images = images;
    }

    if (linkState.supportedWallets.length) {
      payload.supportedWallets = linkState.supportedWallets.map((entry) => {
        const row = { name: entry.name || entry.labelRaw || entry.refId || "Wallet" };
        if (entry.walletCatalogId || entry.refId) row.walletCatalogId = entry.walletCatalogId || entry.refId;
        return row;
      });
    }
    if (linkState.acceptedCredentialRefs.length) {
      payload.acceptedCredentialRefs = linkState.acceptedCredentialRefs.map((entry) => ({
        credentialCatalogId: entry.credentialCatalogId || entry.refId,
      }));
    }

    return payload;
  }

  async function lookupFetch(type, query) {
    const headers = {};
    if (restNonce) headers["X-WP-Nonce"] = restNonce;
    const response = await fetch(`${apiBase}/lookups/${type}?q=${encodeURIComponent(query)}`, {
      credentials: "same-origin",
      headers,
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json.message || "Lookup failed.");
    return {
      content: Array.isArray(json.content) ? json.content : [],
      totalMatches: Number(json.totalMatches) || 0,
    };
  }

  function renderLookupOption(item, idx) {
    const title = escapeHtml(item.label || item.id || "Unnamed");
    const subtitle = item.subtitle ? escapeHtml(item.subtitle) : "";
    return (
      `<li><button type="button" class="fides-lookup-option" data-idx="${idx}" ` +
      `aria-label="Select ${title}${subtitle ? `, ${subtitle}` : ""}">` +
      `<span class="fides-lookup-option-main">` +
      `<span class="fides-lookup-option-title">${title}</span>` +
      (subtitle ? `<span class="fides-lookup-option-subtitle">${subtitle}</span>` : "") +
      `</span>` +
      `<span class="fides-lookup-option-action">Select</span>` +
      `</button></li>`
    );
  }

  function wireLookup(input, resultsEl, hintEl, type, onSelect) {
    if (!input || !resultsEl) return;
    let debounceTimer = null;
    input.addEventListener("input", () => {
      const query = input.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        resultsEl.innerHTML = "";
        if (hintEl) {
          hintEl.hidden = true;
          hintEl.textContent = "";
        }
        if (query.length < 2) return;
        try {
          const { content: items, totalMatches } = await lookupFetch(type, query);
          if (!items.length) {
            if (hintEl) {
              hintEl.hidden = false;
              hintEl.textContent =
                type === "rp"
                  ? "No matches. Check the spelling or contact us if the relying party is missing."
                  : "No matches.";
            }
            return;
          }
          const total = totalMatches || items.length;
          if (hintEl) {
            hintEl.hidden = false;
            hintEl.textContent = total === 1 ? "1 match — click to select" : `${total} matches — click to select`;
          }
          resultsEl.innerHTML = items.map((item, idx) => renderLookupOption(item, idx)).join("");
          resultsEl.querySelectorAll("button[data-idx]").forEach((btn) => {
            btn.addEventListener("click", () => {
              const picked = items[Number(btn.getAttribute("data-idx"))];
              if (picked) onSelect(picked);
            });
          });
        } catch (err) {
          if (hintEl) {
            hintEl.hidden = false;
            hintEl.textContent = err.message || "Lookup failed.";
          }
        }
      }, 250);
    });
  }

  function showOrgSelectionUi() {
    const banner = root.querySelector("#fides-rp-org-banner");
    const orgSearchBlock = root.querySelector("#fides-rp-org-search-block");
    const hasSelection = Boolean(selectedOrgId);
    if (banner) banner.hidden = !hasSelection;
    if (orgSearchBlock) orgSearchBlock.hidden = hasSelection;
    if (submitBlock && mode === "create") submitBlock.hidden = !hasSelection;
    if (orgIdInput) orgIdInput.value = selectedOrgId;
    const nameEl = root.querySelector("#fides-rp-org-name");
    const idEl = root.querySelector("#fides-rp-org-id-display");
    if (!hasSelection) {
      if (nameEl) nameEl.textContent = "";
      if (idEl) idEl.textContent = "";
      revealFields(false);
      return;
    }
    if (nameEl) nameEl.textContent = selectedOrgLabel || selectedOrgId;
    if (idEl) idEl.textContent = selectedOrgId;
    revealFields(true);
  }

  function showUpdateSelectionUi() {
    const hasSelection = Boolean(selectedRpId);
    if (updateBanner) updateBanner.hidden = !hasSelection;
    if (searchBlock) searchBlock.hidden = hasSelection;
    if (submitBlock && mode === "update") submitBlock.hidden = !hasSelection;
    if (!hasSelection) {
      if (updateNameEl) updateNameEl.textContent = "";
      if (updateIdEl) updateIdEl.textContent = "";
      return;
    }
    if (updateNameEl) updateNameEl.textContent = selectedRpLabel || selectedRpId;
    if (updateIdEl) updateIdEl.textContent = selectedRpId;
  }

  async function loadItemPayload(rpId) {
    const url = submissionItemUrl(rpId);
    if (!url) {
      setMessage("Invalid relying party id.", "error");
      return;
    }
    setMessage("Loading relying party details…", "");
    const headers = {};
    if (restNonce) headers["X-WP-Nonce"] = restNonce;
    try {
      const response = await fetch(url, { credentials: "same-origin", headers });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(json.message || "Could not load relying party details.", "error");
        return;
      }
      fillForm(json.payload || {});
      selectedOrgId = json.payload?.orgId || selectedOrgId;
      revealFields(true);
      setMessage("", "");
    } catch {
      setMessage("Could not load relying party details due to a network error.", "error");
    }
  }

  async function selectRp(item) {
    selectedRpId = String(item.id || "").trim();
    selectedRpLabel = String(item.label || selectedRpId).trim();
    const lookupResults = root.querySelector("#fides-rp-lookup-results");
    const lookupHint = root.querySelector("#fides-rp-lookup-hint");
    if (lookupResults) lookupResults.innerHTML = "";
    if (lookupHint) lookupHint.hidden = true;
    showUpdateSelectionUi();
    await loadItemPayload(selectedRpId);
  }

  function resetUpdateSelection() {
    selectedRpId = "";
    selectedRpLabel = "";
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    showUpdateSelectionUi();
    revealFields(false);
    fillForm({});
    setMessage("", "");
  }

  if (mode === "create") {
    showOrgSelectionUi();
    wireLookup(
      root.querySelector("#fides-rp-org-search"),
      root.querySelector("#fides-rp-org-results"),
      root.querySelector("#fides-rp-org-hint"),
      "organization",
      (item) => {
        selectedOrgId = String(item.id || "").trim();
        selectedOrgLabel = String(item.label || selectedOrgId).trim();
        showOrgSelectionUi();
      }
    );
    const orgChange = root.querySelector("#fides-rp-org-change");
    if (orgChange) {
      orgChange.addEventListener("click", () => {
        selectedOrgId = "";
        selectedOrgLabel = "";
        const orgSearch = root.querySelector("#fides-rp-org-search");
        if (orgSearch) {
          orgSearch.value = "";
          orgSearch.focus();
        }
        fillForm({});
        showOrgSelectionUi();
        setMessage("", "");
      });
    }
    if (nameInput && idInput) {
      nameInput.addEventListener("input", () => {
        if (!idInput.value || idInput.dataset.autoId === "1") {
          idInput.value = slugify(nameInput.value);
          idInput.dataset.autoId = "1";
        }
      });
      idInput.addEventListener("input", () => {
        idInput.dataset.autoId = "0";
      });
    }
  }

  if (mode === "update") {
    showUpdateSelectionUi();
    wireLookup(
      searchInput,
      root.querySelector("#fides-rp-lookup-results"),
      root.querySelector("#fides-rp-lookup-hint"),
      "rp",
      selectRp
    );
    if (changeBtn) changeBtn.addEventListener("click", resetUpdateSelection);
    if (selectedRpId) selectRp({ id: selectedRpId, label: selectedRpId });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const payload = buildPayload();
      if (!payload.orgId) {
        setMessage("Select an organization.", "error");
        return;
      }
      if (!payload.id || !/^[a-z0-9-]+$/.test(payload.id)) {
        setMessage("Enter a valid RP id.", "error");
        return;
      }
      if (!payload.name) {
        setMessage("Name is required.", "error");
        return;
      }
      if (!payload.readiness) {
        setMessage("Select a readiness level.", "error");
        return;
      }
      if (!payload.country) {
        setMessage("Select a country.", "error");
        return;
      }
      if (!payload.interactionMode) {
        setMessage("Select an interaction mode.", "error");
        return;
      }
      if (!contactEmail) {
        setMessage("Your WordPress profile must have a valid email address before submitting.", "error");
        return;
      }
      if (payload.description && payload.description.length > RP_DESC_MAX) {
        setMessage(`Description must be at most ${RP_DESC_MAX.toLocaleString("en-US")} characters.`, "error");
        return;
      }

      const url =
        mode === "update" ? submissionItemUrl(selectedRpId || payload.id) : `${apiBase}/submissions/rp`;
      if (!url) {
        setMessage("Invalid submission target.", "error");
        return;
      }

      setMessage("Submitting…", "");
      const headers = { "Content-Type": "application/json" };
      if (restNonce) headers["X-WP-Nonce"] = restNonce;
      try {
        const response = await fetch(url, {
          method: "POST",
          credentials: "same-origin",
          headers,
          body: JSON.stringify(payload),
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          setMessage(json.message || "Submission failed.", "error");
          return;
        }
        const ref = json.itemId || json.id || payload.id;
        setMessage(
          mode === "update"
            ? `Update proposal received${ref ? ` for ${ref}` : ""}. It will be reviewed before publication.`
            : `Submission received${ref ? ` (${ref})` : ""}. It will be reviewed before publication.`,
          "success"
        );
        if (mode === "create") {
          form.reset();
          updateRpDescriptionCounter();
          selectedOrgId = "";
          selectedOrgLabel = "";
          linkState.supportedWallets = [];
          linkState.acceptedCredentialRefs = [];
          linkFieldConfigs.forEach((cfg) => {
            if (typeof cfg.refreshChips === "function") cfg.refreshChips();
          });
          setMediaRowsFromUrls([], []);
          showOrgSelectionUi();
        } else {
          selectedRpId = "";
          selectedRpLabel = "";
          revealFields(false);
          showUpdateSelectionUi();
        }
      } catch {
        setMessage("Submission failed due to a network error.", "error");
      }
    });
  }

  async function loadVocabulary() {
    const urls = [VOCABULARY_URL, VOCABULARY_FALLBACK_URL].filter(Boolean);
    for (const url of urls) {
      try {
        const response = await fetch(url, { credentials: "omit" });
        if (!response.ok) continue;
        const json = await response.json();
        if (json && json.terms) {
          vocabulary = json;
          return;
        }
      } catch (_err) {
        /* try fallback */
      }
    }
  }

  loadVocabulary();
})();
