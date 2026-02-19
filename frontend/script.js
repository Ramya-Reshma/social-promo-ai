const statusBadge = document.getElementById("statusBadge");
const calendarGrid = document.getElementById("calendarGrid");
const mediaGrid = document.getElementById("mediaGrid");
const editJobs = document.getElementById("editJobs");

const form = document.getElementById("campaignForm");
const resetAppBtn = document.getElementById("resetAppBtn");
const exportCalendarBtn = document.getElementById("exportCalendarBtn");
const generateMediaBtn = document.getElementById("generateMediaBtn");

const uploadZone = document.getElementById("uploadZone");
const videoInput = document.getElementById("videoInput");
const uploadVideoBtn = document.getElementById("uploadVideoBtn");

let calendarData = [];
let mediaData = [];
let editJobsData = [];

function setStatus(text, mode = "idle") {
  statusBadge.textContent = text;
  statusBadge.classList.remove("busy", "error");
  if (mode === "busy") statusBadge.classList.add("busy");
  if (mode === "error") statusBadge.classList.add("error");
}

function getSelectedPlatforms() {
  const container = document.getElementById("platforms");
  return Array.from(container.querySelectorAll("input[type=checkbox]:checked")).map(
    (input) => input.value
  );
}

function fakeDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderCalendar() {
  if (!calendarData.length) {
    calendarGrid.classList.add("empty-state");
    calendarGrid.innerHTML = `
      <div class="empty">
        <h3>No calendar yet</h3>
        <p>Configure your campaign on the left and click <strong>Generate 30-Day Calendar</strong>.</p>
      </div>
    `;
    return;
  }

  calendarGrid.classList.remove("empty-state");

  calendarGrid.innerHTML = calendarData
    .map(
      (item) => `
      <article class="calendar-card">
        <div class="calendar-card-header">
          <span class="calendar-card-day">Day ${item.day}</span>
          <div class="calendar-card-platforms">
            ${item.platforms
              .map((p) => `<span class="platform-pill">${p}</span>`)
              .join("")}
          </div>
        </div>
        <p class="calendar-card-title">${item.hook}</p>
        <p style="margin:2px 0 0;font-size:.74rem;color:#9ca3af;">${item.description}</p>
        <div class="calendar-card-meta">
          <span class="tag-soft">${item.format}</span>
          <span>${item.goalLabel}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function renderMedia() {
  if (!mediaData.length) {
    mediaGrid.classList.add("empty-state");
    mediaGrid.innerHTML = `
      <div class="empty">
        <h3>No media concepts yet</h3>
        <p>Generate the calendar first, then click <strong>Generate Media for Calendar</strong>.</p>
      </div>
    `;
    return;
  }

  mediaGrid.classList.remove("empty-state");
  mediaGrid.innerHTML = mediaData
    .map(
      (item) => `
      <article class="media-card">
        <div class="media-thumb"></div>
        <div class="media-type">${item.type.toUpperCase()} · Day ${item.day}</div>
        <p class="media-title">${item.title}</p>
        <p style="margin:2px 0 0;font-size:.75rem;color:#9ca3af;">${item.prompt}</p>
        <div class="media-meta-row">
          <span class="badge badge-accent">${item.aspect}</span>
          <span>${item.platform}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function renderEditJobs() {
  if (!editJobsData.length) {
    editJobs.classList.add("empty-state");
    editJobs.innerHTML = `
      <div class="empty">
        <h3>No editing jobs yet</h3>
        <p>Upload or drop a video file to create a new auto-editing job.</p>
      </div>
    `;
    return;
  }

  editJobs.classList.remove("empty-state");
  editJobs.innerHTML = editJobsData
    .map(
      (job) => `
      <article class="edit-job">
        <div class="edit-job-top">
          <span class="edit-job-title">${job.filename}</span>
          <span class="edit-job-status ${job.status}">${job.statusLabel}</span>
        </div>
        <div class="edit-job-meta">
          <span>${job.durationLabel}</span>
          <span>${job.progressLabel}</span>
        </div>
      </article>
    `
    )
    .join("");
}

async function generateCalendar(event) {
  event.preventDefault();

  const brandName = document.getElementById("brandName").value.trim();
  if (!brandName) {
    setStatus("Brand name is required", "error");
    return;
  }

  const brandVoice = document.getElementById("brandVoice").value;
  const goal = document.getElementById("goal").value;
  const niche = document.getElementById("niche").value.trim();
  const keywords = document.getElementById("keywords").value.trim();
  const platforms = getSelectedPlatforms();

  setStatus("Generating 30-day calendar (mock)…", "busy");

  await fakeDelay(600);

  const goalMap = {
    awareness: "Awareness",
    engagement: "Engagement",
    leads: "Leads",
    sales: "Sales",
  };

  const formats = [
    "Carousel",
    "Short-form video",
    "Single image",
    "Story sequence",
    "Live snippet",
  ];

  calendarData = Array.from({ length: 30 }, (_, idx) => {
    const day = idx + 1;
    const format = formats[idx % formats.length];
    return {
      day,
      platforms,
      format,
      goalLabel: goalMap[goal] || "Campaign",
      hook: `${brandName} · Day ${day} ${format}`,
      description:
        keywords && niche
          ? `Tailored ${format.toLowerCase()} focusing on “${keywords.split(",")[0]
              }” for ${niche}.`
          : `AI-crafted ${format.toLowerCase()} aligned with your ${goalMap[goal]?.toLowerCase() || "campaign"
          } goal and ${brandVoice} voice.`,
    };
  });

  renderCalendar();
  setStatus("Calendar generated (mock). Connect to backend for real AI.");
}

async function generateMediaForCalendar() {
  if (!calendarData.length) {
    setStatus("Generate the calendar first", "error");
    return;
  }

  setStatus("Generating media concepts (mock)…", "busy");
  await fakeDelay(500);

  const types = ["image", "video"];
  const aspects = ["9:16 vertical", "1:1 square", "16:9 wide"];

  mediaData = calendarData.slice(0, 12).map((item, idx) => ({
    day: item.day,
    type: types[idx % types.length],
    title: `Visual for “${item.hook}”`,
    prompt: `High-conversion ${types[idx % types.length]} concept that visually reinforces the hook and CTA.`,
    platform: item.platforms[0] || "multi-platform",
    aspect: aspects[idx % aspects.length],
  }));

  renderMedia();
  setStatus("Media concepts generated (mock).");
}

function handleFileUpload(file) {
  if (!file) return;

  const job = {
    id: Date.now(),
    filename: file.name,
    status: "running",
    statusLabel: "Processing",
    durationLabel: "Estimating…",
    progressLabel: "Queued",
  };

  editJobsData.unshift(job);
  renderEditJobs();
  setStatus(`Queued "${file.name}" for auto-edit (demo).`, "busy");

  setTimeout(() => {
    job.status = "completed";
    job.statusLabel = "Ready";
    job.durationLabel = "0:32 · Reel";
    job.progressLabel = "Exported (mock)";
    renderEditJobs();
    setStatus("Video auto-edit simulation complete. Hook up real backend.");
  }, 1800);
}

function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${tab}`);
      });
    });
  });
}

function setupUploadZone() {
  uploadZone.addEventListener("click", () => videoInput.click());
  uploadVideoBtn.addEventListener("click", () => videoInput.click());

  videoInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    handleFileUpload(file);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove("drag-over");
    });
  });

  uploadZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    handleFileUpload(file);
  });
}

function setupExport() {
  exportCalendarBtn.addEventListener("click", () => {
    if (!calendarData.length) {
      setStatus("Nothing to export yet", "error");
      return;
    }
    const blob = new Blob([JSON.stringify(calendarData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "envision-calendar.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Exported calendar JSON (client-side only).");
  });
}

function setupReset() {
  resetAppBtn.addEventListener("click", () => {
    form.reset();
    calendarData = [];
    mediaData = [];
    editJobsData = [];
    renderCalendar();
    renderMedia();
    renderEditJobs();
    setStatus("Reset to initial state.");
  });
}

function setupBackendHooks() {
  form.addEventListener("submit", (event) => {
    generateCalendar(event);

    // To integrate with FastAPI later:
    // fetch("http://localhost:8000/generate_calendar", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // })
    //   .then((res) => res.json())
    //   .then((data) => { calendarData = data.days; renderCalendar(); });
  });

  generateMediaBtn.addEventListener("click", generateMediaForCalendar);
}

function init() {
  setStatus("Idle");
  renderCalendar();
  renderMedia();
  renderEditJobs();
  setupTabs();
  setupUploadZone();
  setupExport();
  setupReset();
  setupBackendHooks();
}

document.addEventListener("DOMContentLoaded", init);

