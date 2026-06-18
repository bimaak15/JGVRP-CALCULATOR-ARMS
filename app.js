/* ================================================
   JGVRP Arms Dealer Calculator — Application Logic
   Data source: JGV ARMSSS!.xlsx
   ================================================ */

// ==================== WEAPON DATABASE (from Excel) ====================
const BASE_PRICES = {
  gunMaterial: 35,
  heavyMaterial: 75,
  component: 1.25,
};

const WEAPONS = {
  combat_pistol: {
    name: 'Combat Pistol',
    manufacture: { gunMat: 50, heavyMat: 0, component: 200 },
    ammo: { gunMat: 0, component: 10, costPerCreate: 12.5, createdPerCraft: 12 },
    manufacturePrice: 2000,
  },
  heavy_pistol: {
    name: 'Heavy Pistol',
    manufacture: { gunMat: 60, heavyMat: 10, component: 200 },
    ammo: { gunMat: 0, component: 15, costPerCreate: 18.75, createdPerCraft: 18 },
    manufacturePrice: 3100,
  },
  machine_pistol: {
    name: 'Machine Pistol',
    manufacture: { gunMat: 100, heavyMat: 25, component: 500 },
    ammo: { gunMat: 1, component: 5, costPerCreate: 41.25, createdPerCraft: 12 },
    manufacturePrice: 6000,
  },
  sawn_off: {
    name: 'Sawn Off',
    manufacture: { gunMat: 75, heavyMat: 10, component: 300 },
    ammo: { gunMat: 1, component: 5, costPerCreate: 41.25, createdPerCraft: 8 },
    manufacturePrice: 3750,
  },
  pump: {
    name: 'Pump',
    manufacture: { gunMat: 80, heavyMat: 20, component: 400 },
    ammo: { gunMat: 1, component: 5, costPerCreate: 41.25, createdPerCraft: 8 },
    manufacturePrice: 4800,
  },
};

// ==================== DOM HELPERS ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ==================== DOM ELEMENTS ====================
const dashboard = {
  weaponCost: $('#weaponCostDisplay'),
  ammoCost: $('#ammoCostDisplay'),
  totalCost: $('#totalCostDisplay'),
  profit: $('#profitDisplay'),
  margin: $('#profitMarginDisplay'),
  progressBar: $('#profitBar'),
  sellingPrice: $('#sellingPriceDisplay'),
  totalModal: $('#totalModalDisplay'),
  tables: {
    manufacture: $('#manufactureTableBody'),
    ammo: $('#ammoTableBody'),
    summary: $('#summaryTableBody')
  },
  totals: {
    manufacture: $('#totalManufacture'),
    ammo: $('#totalAmmo'),
    overall: $('#totalOverall')
  }
};

const modalElements = {
  overlay: $('#calcModal'),
  slots: [1, 2, 3].map(i => ({
    container: $(`#slot-${i}`),
    weapon: $(`#weaponType-${i}`),
    location: $(`#location-${i}`),
    weaponQty: $(`#weaponQty-${i}`),
    ammoQty: $(`#ammoQty-${i}`),
    sellingPrice: $(`#sellingPrice-${i}`)
  })),
  previewTotalModal: $('#modalTotalModal'),
  previewTotalProfit: $('#modalTotalProfit'),
  btnReset: $('#btnResetForm'),
  btnCalculate: $('#btnCalculate'),
  modalClose: $('#modalClose')
};

const common = {
  btnNewCalc: $('#btnNewCalc'),
  btnCopy: $('#btnCopyResults'),
  sidebarTemplate: $('#weaponTemplate'),
  toast: $('#toast'),
  navToggle: $('#navToggle'),
  navMenu: $('#navMenu')
};

// ==================== CURRENCY FORMATTER ====================
function formatCurrency(value) {
  const num = Math.abs(value);
  const formatted = num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

// ==================== GET VALUE HELPERS ====================
function getVal(el) {
  if (!el) return 0;
  const val = parseFloat(el.value);
  return isNaN(val) || val < 0 ? 0 : val;
}

// ==================== CALCULATION ENGINE ====================
function calculateTransaction(slotIndex) {
  const slot = modalElements.slots[slotIndex];
  const weaponKey = slot.weapon.value;
  const weaponConfig = WEAPONS[weaponKey];

  if (!weaponConfig) return null;

  const weaponQty = getVal(slot.weaponQty);
  if (weaponQty === 0 && getVal(slot.ammoQty) === 0) return null;

  const weaponBaseCost = weaponConfig.manufacturePrice * weaponQty;
  const ammoQtyToSell = getVal(slot.ammoQty);
  const craftsNeeded = weaponConfig.ammo.createdPerCraft > 0 ? Math.ceil(ammoQtyToSell / weaponConfig.ammo.createdPerCraft) : 0;
  const ammoCost = craftsNeeded * weaponConfig.ammo.costPerCreate;
  
  const totalModal = weaponBaseCost + ammoCost;
  const sellingPrice = getVal(slot.sellingPrice);
  const profit = sellingPrice - totalModal;

  return {
    slot: slotIndex + 1,
    weaponKey,
    weaponName: weaponConfig.name,
    location: slot.location.value || 'Unknown',
    weaponQty,
    ammoQtyToSell,
    craftsNeeded,
    weaponBaseCost,
    ammoCost,
    totalModal,
    sellingPrice,
    profit,
    config: weaponConfig
  };
}

function calculateSession() {
  const transactions = modalElements.slots.map((_, i) => calculateTransaction(i)).filter(t => t !== null);
  
  if (transactions.length === 0) return null;

  const totalModal = transactions.reduce((sum, t) => sum + t.totalModal, 0);
  const totalSellingPrice = transactions.reduce((sum, t) => sum + t.sellingPrice, 0);
  const totalProfit = totalSellingPrice - totalModal;
  const profitMargin = totalSellingPrice > 0 ? (totalProfit / totalSellingPrice) * 100 : 0;

  // Material consolidation
  const materials = { gunMat: 0, heavyMat: 0, component: 0 };
  transactions.forEach(t => {
    // Weapon Materials
    materials.gunMat += t.config.manufacture.gunMat * t.weaponQty;
    materials.heavyMat += t.config.manufacture.heavyMat * t.weaponQty;
    materials.component += t.config.manufacture.component * t.weaponQty;
    // Ammo Materials
    materials.gunMat += t.config.ammo.gunMat * t.craftsNeeded;
    materials.component += t.config.ammo.component * t.craftsNeeded;
  });

  return {
    transactions,
    totalModal,
    totalSellingPrice,
    totalProfit,
    profitMargin,
    materials,
    weaponTotal: transactions.reduce((sum, t) => sum + t.weaponBaseCost, 0),
    ammoTotal: transactions.reduce((sum, t) => sum + t.ammoCost, 0)
  };
}

// ==================== UI UPDATES ====================
function updateDashboard(sessionData) {
  if (!sessionData) {
    dashboard.weaponCost.textContent = '$0';
    dashboard.ammoCost.textContent = '$0';
    dashboard.totalCost.textContent = '$0';
    dashboard.profit.textContent = '$0';
    dashboard.margin.textContent = '0%';
    dashboard.progressBar.style.width = '0%';
    dashboard.sellingPrice.textContent = '$0';
    dashboard.totalModal.textContent = '$0';
    dashboard.tables.manufacture.innerHTML = emptyRow('📋');
    dashboard.tables.ammo.innerHTML = emptyRow('🎯');
    dashboard.tables.summary.innerHTML = emptyRow('📊');
    dashboard.totals.manufacture.textContent = '$0';
    dashboard.totals.ammo.textContent = '$0';
    dashboard.totals.overall.textContent = '$0';
    return;
  }

  // Dashboard Stats
  dashboard.weaponCost.textContent = formatCurrency(sessionData.weaponTotal);
  dashboard.ammoCost.textContent = formatCurrency(sessionData.ammoTotal);
  dashboard.totalCost.textContent = formatCurrency(sessionData.totalModal);
  dashboard.profit.textContent = formatCurrency(sessionData.totalProfit);
  dashboard.profit.className = 'profit-amount' + (sessionData.totalProfit >= 0 ? '' : ' loss');
  
  dashboard.margin.textContent = sessionData.profitMargin.toFixed(2) + '%';
  dashboard.margin.className = 'profit-margin-value' + (sessionData.totalProfit < 0 ? ' loss' : '');
  dashboard.progressBar.style.width = Math.min(100, Math.max(0, sessionData.profitMargin)) + '%';
  dashboard.progressBar.className = 'profit-bar' + (sessionData.totalProfit < 0 ? ' loss' : '');
  
  dashboard.sellingPrice.textContent = formatCurrency(sessionData.totalSellingPrice);
  dashboard.totalModal.textContent = formatCurrency(sessionData.totalModal);

  // Breakdown: Manufacture
  const m = sessionData.materials;
  const mRows = [
    { name: 'Gun Material', qty: m.gunMat, price: BASE_PRICES.gunMaterial, total: m.gunMat * BASE_PRICES.gunMaterial },
    { name: 'Heavy Material', qty: m.heavyMat, price: BASE_PRICES.heavyMaterial, total: m.heavyMat * BASE_PRICES.heavyMaterial },
    { name: 'Component', qty: m.component, price: BASE_PRICES.component, total: m.component * BASE_PRICES.component },
  ].filter(r => r.qty > 0);

  dashboard.tables.manufacture.innerHTML = mRows.map(r => `
    <tr><td>${r.name}</td><td>${r.qty.toLocaleString()}</td><td>${formatCurrency(r.price)}</td><td>${formatCurrency(r.total)}</td></tr>
  `).join('');
  dashboard.totals.manufacture.textContent = formatCurrency(sessionData.weaponTotal);

  // Breakdown: Ammo
  // (Ammo is now combined in manufacture above for simpler session view, or we can list per transaction)
  dashboard.tables.ammo.innerHTML = sessionData.transactions.map(t => `
    <tr><td>${t.weaponName} (${t.ammoQtyToSell} ammo)</td><td>${t.craftsNeeded} crafts</td><td>${formatCurrency(t.config.ammo.costPerCreate)}</td><td>${formatCurrency(t.ammoCost)}</td></tr>
  `).join('');
  dashboard.totals.ammo.textContent = formatCurrency(sessionData.ammoTotal);

  // Breakdown: Summary
  dashboard.tables.summary.innerHTML = sessionData.transactions.map(t => `
    <tr class="summary-weapon-row">
      <td colspan="4" style="background:rgba(23,169,92,0.05); font-weight:700; color:var(--primary-green)">
        #${t.slot} ${t.weaponName} @ ${t.location}
      </td>
    </tr>
    <tr><td>Produksi Senjata</td><td>${t.weaponQty}</td><td>${formatCurrency(t.config.manufacturePrice)}</td><td>${formatCurrency(t.weaponBaseCost)}</td></tr>
    <tr><td>Modal Amunisi</td><td>${t.craftsNeeded} c</td><td>${formatCurrency(t.config.ammo.costPerCreate)}</td><td>${formatCurrency(t.ammoCost)}</td></tr>
    <tr style="border-bottom:1.5px solid #eee"><td>Profit Individual</td><td></td><td></td><td style="color:${t.profit >= 0 ? '#16A34A' : '#DC2626'}">${formatCurrency(t.profit)}</td></tr>
  `).join('') + `
    <tr style="font-weight:700; background:var(--bg)">
      <td>TOTAL SESSION</td>
      <td></td>
      <td></td>
      <td style="color:var(--primary-green); font-size:16px">${formatCurrency(sessionData.totalProfit)}</td>
    </tr>
  `;
  dashboard.totals.overall.textContent = formatCurrency(sessionData.totalModal);
}

function updateModalPreview() {
  const data = calculateSession();
  modalElements.previewTotalModal.textContent = formatCurrency(data ? data.totalModal : 0);
  modalElements.previewTotalProfit.textContent = formatCurrency(data ? data.totalProfit : 0);
}

function emptyRow(icon) {
  return `<tr><td colspan="4" class="empty-state">
    <div class="empty-state-icon"><i data-lucide="${icon === '📋' ? 'clipboard-list' : icon === '🎯' ? 'target' : 'bar-chart-3'}"></i></div>
    <div class="empty-state-text">Belum ada data</div>
    <div class="empty-state-hint">Klik "Hitung Baru" dan lengkapi transaksi</div>
  </td></tr>`;
}

// ==================== EVENT HANDLERS ====================
function openModal() {
  modalElements.overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeModal() {
  modalElements.overlay.classList.remove('show');
  document.body.style.overflow = '';
}

function resetForm() {
  modalElements.slots.forEach(slot => {
    slot.weapon.value = '';
    slot.location.value = '';
    slot.weaponQty.value = 0;
    slot.ammoQty.value = 0;
    slot.sellingPrice.value = 0;
    slot.container.classList.remove('active');
  });
  updateModalPreview();
}

function copyToClipboard() {
  const data = calculateSession();
  if (!data) {
    showToast('⚠️ Belum ada data transaksi untuk disalin');
    return;
  }

  let text = `═══ JGVRP ARMS DEALER SESSION ═══\n\n`;
  data.transactions.forEach(t => {
    text += `[#${t.slot}] ${t.weaponName} × ${t.weaponQty}\n`;
    text += `📍 Location : ${t.location}\n`;
    text += `📦 Ammo     : ${t.ammoQtyToSell} rounds (${t.craftsNeeded} crafts)\n`;
    text += `💰 Profit   : ${formatCurrency(t.profit)}\n`;
    text += `───────────────────────────────\n`;
  });
  text += `\nTOTAL MODAL  : ${formatCurrency(data.totalModal)}\n`;
  text += `TOTAL PROFIT : ${formatCurrency(data.totalProfit)}\n`;
  text += `MARGIN       : ${data.profitMargin.toFixed(2)}%\n`;
  text += `\nCREDITS BY bimaak15/B1maF4st`;

  navigator.clipboard.writeText(text).then(() => showToast('✅ Session summary copied!'));
}

function showToast(msg) {
  common.toast.innerHTML = `<i data-lucide="check-circle" style="vertical-align: middle; margin-right: 8px;"></i> ${msg}`;
  common.toast.classList.add('show');
  lucide.createIcons();
  setTimeout(() => common.toast.classList.remove('show'), 3000);
}

// ==================== INITIALIZATION ====================
function init() {
  // Tabs & Nav
  $$('.breakdown-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.breakdown-tab, .tab-content').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      $(`#tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  common.navToggle.addEventListener('click', () => common.navMenu.classList.toggle('open'));

  // Modal Inputs
  modalElements.slots.forEach(slot => {
    [slot.weapon, slot.location, slot.weaponQty, slot.ammoQty, slot.sellingPrice].forEach(input => {
      input.addEventListener('input', () => {
        if (slot.weapon.value) slot.container.classList.add('active');
        else slot.container.classList.remove('active');
        updateModalPreview();
      });
    });
  });

  // Buttons
  common.btnNewCalc.addEventListener('click', openModal);
  modalElements.modalClose.addEventListener('click', closeModal);
  modalElements.btnReset.addEventListener('click', resetForm);
  
  modalElements.btnCalculate.addEventListener('click', () => {
    const data = calculateSession();
    if (!data) {
      showToast('⚠️ Masukkan setidaknya 1 transaksi valid');
      return;
    }
    updateDashboard(data);
    closeModal();
    showToast('📊 Dashboard updated for the session');
  });

  common.btnCopy.addEventListener('click', copyToClipboard);

  // Sidebar Shortcut
  common.sidebarTemplate.addEventListener('change', (e) => {
    const weapon = e.target.value;
    if (!weapon) return;
    resetForm();
    modalElements.slots[0].weapon.value = weapon;
    modalElements.slots[0].container.classList.add('active');
    updateModalPreview();
    openModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
