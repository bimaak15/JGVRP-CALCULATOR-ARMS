/* ================================================
   JGVRP Arms Dealer Calculator — Application Logic
   Data source: JGV ARMSSS!.xlsx
   ================================================ */

// ==================== WEAPON DATABASE (from Excel) ====================
// Base unit prices
const BASE_PRICES = {
  gunMaterial: 35,
  heavyMaterial: 75,
  component: 1.25,
};

// Weapon recipes from Excel: columns C-G in "GUN BIMAAK" / "GUN EGAN" sheets
// manufacture.gunMat / heavyMat / component = materials needed to craft 1 weapon
// ammo.gunMat / component = materials needed per /create ammo
// ammo.costPerCreate = calculated cost of 1 ammo /create
// ammo.createdPerCraft = how many ammo rounds produced per /create
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
const weaponCostDisplay = $('#weaponCostDisplay');
const ammoCostDisplay = $('#ammoCostDisplay');
const totalCostDisplay = $('#totalCostDisplay');
const profitDisplay = $('#profitDisplay');
const profitMarginDisplay = $('#profitMarginDisplay');
const profitBar = $('#profitBar');
const sellingPriceDisplay = $('#sellingPriceDisplay');
const totalModalDisplay = $('#totalModalDisplay');

const totalManufactureEl = $('#totalManufacture');
const totalAmmoEl = $('#totalAmmo');
const totalOverallEl = $('#totalOverall');

const manufactureTableBody = $('#manufactureTableBody');
const ammoTableBody = $('#ammoTableBody');
const summaryTableBody = $('#summaryTableBody');

const calcModal = $('#calcModal');
const btnNewCalc = $('#btnNewCalc');
const modalClose = $('#modalClose');
const btnCalculate = $('#btnCalculate');
const btnResetForm = $('#btnResetForm');
const btnCopyResults = $('#btnCopyResults');
const weaponTemplateSelect = $('#weaponTemplate');
const modalWeaponType = $('#modalWeaponType');
const toast = $('#toast');
const navToggle = $('#navToggle');
const navMenu = $('#navMenu');

// ==================== CURRENCY FORMATTER ====================
function formatCurrency(value) {
  const num = Math.abs(value);
  const formatted = num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

// ==================== GET INPUT VALUE SAFELY ====================
function getVal(id) {
  const el = $(id);
  if (!el) return 0;
  const val = parseFloat(el.value);
  return isNaN(val) || val < 0 ? 0 : val;
}

// ==================== POPULATE RECIPE FIELDS ====================
function populateRecipe(weaponKey) {
  const w = WEAPONS[weaponKey];
  if (!w) {
    // Clear recipe fields
    $('#gunMatQty').value = '';
    $('#heavyMatQty').value = '';
    $('#componentQty').value = '';
    $('#ammoGunMatQty').value = '';
    $('#ammoComponentQty').value = '';
    $('#ammoCostPerCreate').value = '';
    $('#ammoCreatedPerCraft').value = '';
    return;
  }

  $('#gunMatQty').value = w.manufacture.gunMat;
  $('#gunMatPrice').value = BASE_PRICES.gunMaterial;
  $('#heavyMatQty').value = w.manufacture.heavyMat;
  $('#heavyMatPrice').value = BASE_PRICES.heavyMaterial;
  $('#componentQty').value = w.manufacture.component;
  $('#componentPrice').value = BASE_PRICES.component;

  $('#ammoGunMatQty').value = w.ammo.gunMat;
  $('#ammoComponentQty').value = w.ammo.component;
  $('#ammoCostPerCreate').value = formatCurrency(w.ammo.costPerCreate);
  $('#ammoCreatedPerCraft').value = w.ammo.createdPerCraft;
}

// ==================== CALCULATION ENGINE ====================
function calculateAll() {
  const weaponKey = $('#modalWeaponType').value;
  const w = WEAPONS[weaponKey];

  if (!w) {
    return {
      weaponName: '',
      weaponQty: 0,
      gunMatCost: 0, heavyMatCost: 0, componentCost: 0,
      manufacturePrice: 0,
      totalManufacture: 0,
      ammoCostPerCreate: 0,
      ammoCreatedPerCraft: 0,
      ammoQtyToSell: 0,
      craftsNeeded: 0,
      totalAmmoCost: 0,
      totalExpense: 0,
      sellingPrice: 0,
      profit: 0,
      profitMargin: 0,
      ammoGunMatQty: 0,
      ammoComponentQty: 0,
    };
  }

  const weaponQty = Math.max(1, getVal('#weaponQty'));

  // Manufacture cost per weapon (from Excel formula)
  // Gun Material cost = qty × $35
  const gunMatCost = w.manufacture.gunMat * BASE_PRICES.gunMaterial;
  // Heavy Material cost = qty × $75
  const heavyMatCost = w.manufacture.heavyMat * BASE_PRICES.heavyMaterial;
  // Component cost = qty × $1.25
  const componentCost = w.manufacture.component * BASE_PRICES.component;
  // Manufacture price per weapon = sum of all material costs  
  const manufacturePrice = w.manufacturePrice; // from Excel pre-calculated
  // Total manufacture cost for all weapons
  const totalManufacture = manufacturePrice * weaponQty;

  // Ammo calculations
  const ammoQtyToSell = getVal('#ammoQtyToSell');
  const ammoCreatedPerCraft = w.ammo.createdPerCraft;
  const ammoCostPerCreate = w.ammo.costPerCreate;
  // How many /create commands needed to produce the requested ammo
  const craftsNeeded = ammoCreatedPerCraft > 0 ? Math.ceil(ammoQtyToSell / ammoCreatedPerCraft) : 0;
  // Total ammo production cost
  const totalAmmoCost = craftsNeeded * ammoCostPerCreate;

  // Grand totals
  const totalExpense = totalManufacture + totalAmmoCost;
  const sellingPrice = getVal('#sellingPrice');
  const profit = sellingPrice - totalExpense;
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;

  return {
    weaponName: w.name,
    weaponQty,
    gunMatCost,
    heavyMatCost,
    componentCost,
    manufacturePrice,
    totalManufacture,
    ammoCostPerCreate,
    ammoCreatedPerCraft,
    ammoQtyToSell,
    craftsNeeded,
    totalAmmoCost,
    totalExpense,
    sellingPrice,
    profit,
    profitMargin,
    ammoGunMatQty: w.ammo.gunMat,
    ammoComponentQty: w.ammo.component,
    gunMatQty: w.manufacture.gunMat,
    heavyMatQty: w.manufacture.heavyMat,
    componentQty: w.manufacture.component,
  };
}

// ==================== UPDATE DASHBOARD ====================
function updateDashboard(data) {
  // --- Ringkasan Biaya ---
  weaponCostDisplay.textContent = formatCurrency(data.totalManufacture);
  ammoCostDisplay.textContent = formatCurrency(data.totalAmmoCost);
  totalCostDisplay.textContent = formatCurrency(data.totalExpense);

  // --- Estimasi Profit ---
  profitDisplay.textContent = formatCurrency(data.profit);
  profitDisplay.className = 'profit-amount' +
    (data.profit > 0 ? '' : data.profit < 0 ? ' loss' : ' neutral');

  const marginStr = Math.abs(data.profitMargin).toFixed(2) + '%';
  profitMarginDisplay.textContent = marginStr;
  profitMarginDisplay.className = 'profit-margin-value' + (data.profit < 0 ? ' loss' : '');

  const barWidth = Math.max(0, Math.min(100, Math.abs(data.profitMargin)));
  profitBar.style.width = barWidth + '%';
  profitBar.className = 'profit-bar' + (data.profit < 0 ? ' loss' : '');

  sellingPriceDisplay.textContent = formatCurrency(data.sellingPrice);
  totalModalDisplay.textContent = formatCurrency(data.totalExpense);

  // --- Breakdown: Manufacture ---
  if (data.weaponName) {
    const mfRows = [];
    if (data.gunMatQty > 0) {
      mfRows.push({ name: 'Gun Material', qty: data.gunMatQty, price: BASE_PRICES.gunMaterial, total: data.gunMatCost });
    }
    if (data.heavyMatQty > 0) {
      mfRows.push({ name: 'Heavy Material', qty: data.heavyMatQty, price: BASE_PRICES.heavyMaterial, total: data.heavyMatCost });
    }
    if (data.componentQty > 0) {
      mfRows.push({ name: 'Component', qty: data.componentQty, price: BASE_PRICES.component, total: data.componentCost });
    }

    manufactureTableBody.innerHTML = mfRows.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.qty.toLocaleString()}</td>
        <td>${formatCurrency(r.price)}</td>
        <td>${formatCurrency(r.total)}</td>
      </tr>
    `).join('');
    totalManufactureEl.textContent = formatCurrency(data.totalManufacture);

    // Show per-weapon price note
    if (data.weaponQty > 1) {
      manufactureTableBody.innerHTML += `<tr><td colspan="3" style="font-size:12px;color:#9CA3AF;padding-top:8px">× ${data.weaponQty} senjata (${formatCurrency(data.manufacturePrice)}/unit)</td><td style="font-weight:700;padding-top:8px">${formatCurrency(data.totalManufacture)}</td></tr>`;
    }
  } else {
    manufactureTableBody.innerHTML = emptyRow('📋');
    totalManufactureEl.textContent = '$0';
  }

  // --- Breakdown: Ammo ---
  if (data.ammoQtyToSell > 0 && data.weaponName) {
    const ammoRows = [];
    if (data.ammoGunMatQty > 0) {
      ammoRows.push({ name: 'Gun Material (per /create)', qty: data.ammoGunMatQty * data.craftsNeeded, price: BASE_PRICES.gunMaterial, total: data.ammoGunMatQty * data.craftsNeeded * BASE_PRICES.gunMaterial });
    }
    if (data.ammoComponentQty > 0) {
      ammoRows.push({ name: 'Component (per /create)', qty: data.ammoComponentQty * data.craftsNeeded, price: BASE_PRICES.component, total: data.ammoComponentQty * data.craftsNeeded * BASE_PRICES.component });
    }
    ammoRows.push({
      name: `Ammo /create × ${data.craftsNeeded}`,
      qty: data.craftsNeeded,
      price: data.ammoCostPerCreate,
      total: data.totalAmmoCost,
    });

    ammoTableBody.innerHTML = ammoRows.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${typeof r.qty === 'number' ? r.qty.toLocaleString() : r.qty}</td>
        <td>${formatCurrency(r.price)}</td>
        <td>${formatCurrency(r.total)}</td>
      </tr>
    `).join('');
    ammoTableBody.innerHTML += `<tr><td colspan="3" style="font-size:12px;color:#9CA3AF;padding-top:4px">${data.ammoQtyToSell} ammo (${data.ammoCreatedPerCraft}/craft → ${data.craftsNeeded} crafts)</td><td></td></tr>`;
    totalAmmoEl.textContent = formatCurrency(data.totalAmmoCost);
  } else {
    ammoTableBody.innerHTML = emptyRow('🎯');
    totalAmmoEl.textContent = '$0';
  }

  // --- Breakdown: Summary ---
  if (data.weaponName) {
    summaryTableBody.innerHTML = `
      <tr><td>Manufacture (${data.weaponName})</td><td>${data.weaponQty}</td><td>${formatCurrency(data.manufacturePrice)}</td><td>${formatCurrency(data.totalManufacture)}</td></tr>
      <tr><td>Ammo /create</td><td>${data.craftsNeeded}</td><td>${formatCurrency(data.ammoCostPerCreate)}</td><td>${formatCurrency(data.totalAmmoCost)}</td></tr>
      <tr style="font-weight:700;border-top:2px solid #C8F7D9"><td>Total Modal</td><td></td><td></td><td>${formatCurrency(data.totalExpense)}</td></tr>
      <tr><td>Harga Jual</td><td></td><td></td><td>${formatCurrency(data.sellingPrice)}</td></tr>
      <tr style="font-weight:700;color:${data.profit >= 0 ? '#16A34A' : '#DC2626'}"><td>Profit</td><td></td><td>${data.profitMargin.toFixed(2)}%</td><td>${formatCurrency(data.profit)}</td></tr>
    `;
    totalOverallEl.textContent = formatCurrency(data.totalExpense);
  } else {
    summaryTableBody.innerHTML = emptyRow('📊');
    totalOverallEl.textContent = '$0';
  }
}

function emptyRow(icon) {
  return `<tr><td colspan="4" class="empty-state">
    <div class="empty-state-icon">${icon}</div>
    <div class="empty-state-text">Belum ada data</div>
    <div class="empty-state-hint">Klik "Hitung Baru" atau pilih template</div>
  </td></tr>`;
}

// ==================== MODAL CONTROLS ====================
function openModal() {
  calcModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  calcModal.classList.remove('show');
  document.body.style.overflow = '';
}

function resetForm() {
  modalWeaponType.value = '';
  $('#weaponQty').value = 1;
  $('#ammoQtyToSell').value = '';
  $('#sellingPrice').value = '';
  populateRecipe('');
  $$('.form-error').forEach(el => el.classList.remove('show'));
  $$('.form-input.error').forEach(el => el.classList.remove('error'));
}

// ==================== VALIDATION ====================
function validateForm() {
  let isValid = true;

  if (!modalWeaponType.value) {
    modalWeaponType.classList.add('error');
    isValid = false;
  } else {
    modalWeaponType.classList.remove('error');
  }

  const qty = getVal('#weaponQty');
  if (qty < 1) {
    $('#weaponQty').classList.add('error');
    $('#weaponQtyError').classList.add('show');
    isValid = false;
  } else {
    $('#weaponQty').classList.remove('error');
    $('#weaponQtyError').classList.remove('show');
  }

  const sp = getVal('#sellingPrice');
  if (sp <= 0) {
    $('#sellingPrice').classList.add('error');
    $('#sellingPriceError').classList.add('show');
    isValid = false;
  } else {
    $('#sellingPrice').classList.remove('error');
    $('#sellingPriceError').classList.remove('show');
  }

  return isValid;
}

// ==================== COPY RESULTS ====================
function copyResults() {
  const data = calculateAll();
  if (!data.weaponName) {
    showToast('⚠️ Belum ada data untuk dicopy');
    return;
  }

  const text = `
═══════════════════════════════════════
  JGVRP Arms Dealer Calculator v1.0
═══════════════════════════════════════
  Senjata    : ${data.weaponName}
  Jumlah     : ${data.weaponQty}
  Ammo       : ${data.ammoQtyToSell} rounds (${data.craftsNeeded} crafts)
───────────────────────────────────────
  Manufacture: ${formatCurrency(data.totalManufacture)}
    Gun Material  ${data.gunMatQty} × $${BASE_PRICES.gunMaterial} = ${formatCurrency(data.gunMatCost)}
    Heavy Material ${data.heavyMatQty} × $${BASE_PRICES.heavyMaterial} = ${formatCurrency(data.heavyMatCost)}
    Component     ${data.componentQty} × $${BASE_PRICES.component} = ${formatCurrency(data.componentCost)}
  Ammo Cost  : ${formatCurrency(data.totalAmmoCost)}
    ${data.craftsNeeded} crafts × ${formatCurrency(data.ammoCostPerCreate)}/create
───────────────────────────────────────
  Total Modal: ${formatCurrency(data.totalExpense)}
  Harga Jual : ${formatCurrency(data.sellingPrice)}
  PROFIT     : ${formatCurrency(data.profit)}
  Margin     : ${data.profitMargin.toFixed(2)}%
═══════════════════════════════════════`.trim();

  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Hasil kalkulasi berhasil disalin!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ Hasil kalkulasi berhasil disalin!');
  });
}

function showToast(msg) {
  toast.textContent = msg || '✅ Berhasil!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== TAB SWITCHING ====================
function initTabs() {
  $$('.breakdown-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.breakdown-tab').forEach(t => t.classList.remove('active'));
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      $(`#tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

// ==================== NAV TOGGLE ====================
function initNav() {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// ==================== REAL-TIME UPDATES ====================
function recalcAndUpdate() {
  const data = calculateAll();
  updateDashboard(data);
}

// ==================== INIT ====================
function init() {
  initTabs();
  initNav();

  // Weapon type change → populate recipe + recalc
  modalWeaponType.addEventListener('change', (e) => {
    populateRecipe(e.target.value);
    recalcAndUpdate();
  });

  // Real-time calc on numeric inputs
  ['#weaponQty', '#ammoQtyToSell', '#sellingPrice'].forEach(sel => {
    $(sel)?.addEventListener('input', () => {
      $(sel).classList.remove('error');
      const err = $(sel).parentElement.querySelector('.form-error');
      if (err) err.classList.remove('show');
      recalcAndUpdate();
    });
  });

  // Open modal
  btnNewCalc.addEventListener('click', () => {
    resetForm();
    openModal();
  });

  // Close modal
  modalClose.addEventListener('click', closeModal);
  calcModal.addEventListener('click', (e) => { if (e.target === calcModal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Calculate button
  btnCalculate.addEventListener('click', () => {
    if (!validateForm()) return;
    recalcAndUpdate();
    closeModal();
  });

  // Reset
  btnResetForm.addEventListener('click', () => {
    resetForm();
    recalcAndUpdate();
  });

  // Template quick-select (sidebar)
  weaponTemplateSelect.addEventListener('change', (e) => {
    const key = e.target.value;
    if (!key) return;
    modalWeaponType.value = key;
    populateRecipe(key);
    recalcAndUpdate();
    openModal();
  });

  // Copy results
  btnCopyResults.addEventListener('click', copyResults);
}

document.addEventListener('DOMContentLoaded', init);
