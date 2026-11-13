const selected = { kegiatan: null, kendaraan: null };

const jamInput = document.getElementById("jam");
const tanggalInput = document.getElementById("tanggal");
const jamHint = document.createElement("p");
jamHint.className = "jam-hint";
jamInput.after(jamHint);

tanggalInput.addEventListener("change", () => {
  const date = new Date(tanggalInput.value + "T00:00:00");
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  jamInput.min = isWeekend ? "07:00" : "18:00";
  jamInput.max = "21:00";
  jamHint.textContent = isWeekend ? "⏰ aku bisanya dari jam 07:00 – 21:00 hehe ^_^" : "⏰ aku bisanya dari jam 18:00 – 21:00 hehe ^_^";

  if (jamInput.value) {
    const totalMin = getMinutes(jamInput.value);
    const minMin = isWeekend ? 7 * 60 : 18 * 60;
    if (totalMin < minMin || totalMin > 21 * 60) {
      jamInput.value = "";
      showToast(isWeekend ? getWeekendToast(totalMin) : getWeekdayToast(totalMin));
    }
  }
});

jamInput.addEventListener("change", () => {
  if (!tanggalInput.value || !jamInput.value) return;
  const date = new Date(tanggalInput.value + "T00:00:00");
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const totalMin = getMinutes(jamInput.value);
  const minMin = isWeekend ? 7 * 60 : 18 * 60;

  if (totalMin < minMin || totalMin > 21 * 60) {
    jamInput.value = "";
    showToast(isWeekend ? getWeekendToast(totalMin) : getWeekdayToast(totalMin));
  }
});

function getMinutes(val) {
  const [h, m] = val.split(":").map(Number);
  return h * 60 + m;
}

function getWeekdayToast(totalMin) {
  if (totalMin < 18 * 60) return "yah aku masih kerja kalau jam segitu mah :(, paling dari jam 18:00 gimana?";
  return "eh kemaleman gasie >~<";
}

function getWeekendToast(totalMin) {
  if (totalMin < 7 * 60) return "Aku belum bangun kayaknya jam segitu mah, nanti takut telat jemput kamunya >~<";
  return "eh sayang gasih kemaleman nanti kita ketemunya cuman sebentar :(";
}

document.querySelectorAll(".option-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const group = btn.dataset.group;
    document.querySelectorAll(`.option-btn[data-group="${group}"]`).forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selected[group] = btn.dataset.value;
  });
});

function openLetter() {
  document.querySelector(".envelope-wrapper").style.display = "none";
  document.getElementById("letterWrapper").classList.remove("hidden");
}

function formatTanggal(val) {
  if (!val) return null;
  const [y, m, d] = val.split("-");
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function formatJam(val) {
  if (!val) return null;
  const [h, m] = val.split(":");
  const hour = parseInt(h);
  const suffix = hour < 12 ? "pagi" : hour < 15 ? "siang" : hour < 18 ? "sore" : "malam";
  return `${val} ${suffix}`;
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function sendToWhatsApp() {
  const tanggal = formatTanggal(document.getElementById("tanggal").value);
  const jam = formatJam(document.getElementById("jam").value);
  const kegiatan = selected.kegiatan;
  const kendaraan = selected.kendaraan;

  if (!tanggal || !jam || !kegiatan || !kendaraan) {
    showToast("🥺 isi semua dulu ya sayang~");
    return;
  }

  const pesan =
    `aloowww nopal\n` +
    `hayuuuk aku mau banget ngedate sama kamuu hihi.\n` +
    `gimana kalau kita jalan di tanggal *${tanggal}*. biar pas waktunya, nanti kamu jemput aku jam *${jam}*-an yaa. Gimana kalau nanti *${kegiatan}* ajaa hihi lagi pengen itu soalnya. tapi nanti kita naik *${kendaraan}* aja yaa biar enak juga hihii\n\n` +
    `jangan lupa yaww ><✨`;

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}
