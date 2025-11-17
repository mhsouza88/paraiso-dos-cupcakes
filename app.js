const DEFAULT_CUPCAKES = [
  {
    id: 1,
    name: "Chocolate Clássico",
    description: "Cupcake de chocolate com cobertura de brigadeiro.",
    price: 7.5,
  },
  {
    id: 2,
    name: "Baunilha com Morango",
    description: "Massa de baunilha com cobertura de morango.",
    price: 8.0,
  },
  {
    id: 3,
    name: "Red Velvet",
    description: "Tradicional red velvet com cream cheese.",
    price: 9.0,
  },
  {
    id: 4,
    name: "Doce de Leite",
    description: "Recheado e coberto com doce de leite cremoso.",
    price: 8.5,
  },
];

const SALES_KEY = "cupcake_sales_v1";
const CUPCAKES_KEY = "cupcake_catalog_v1";

let cartItems = []; // itens do carrinho
let cupcakes = []; // catálogo atual
let searchTerm = ""; // termo da busca

// Controle para modal de exclusão
let pendingDeleteSaleId = null;

const SaleRepository = {
  getAll() {
    const raw = localStorage.getItem(SALES_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveAll(sales) {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  },

  create(sale) {
    const sales = this.getAll();
    sales.push(sale);
    this.saveAll(sales);
  },

  updateStatus(id, newStatus) {
    const sales = this.getAll();
    const index = sales.findIndex((s) => s.id === id);
    if (index !== -1) {
      sales[index].status = newStatus;
      this.saveAll(sales);
    }
  },

  remove(id) {
    const sales = this.getAll().filter((s) => s.id !== id);
    this.saveAll(sales);
  },
};

const CupcakeRepository = {
  getAll() {
    const raw = localStorage.getItem(CUPCAKES_KEY);
    if (!raw) {
      return [...DEFAULT_CUPCAKES];
    }
    return JSON.parse(raw);
  },

  saveAll(list) {
    localStorage.setItem(CUPCAKES_KEY, JSON.stringify(list));
  },

  create(cupcake) {
    const list = this.getAll();
    list.push(cupcake);
    this.saveAll(list);
  },
};

function loadCupcakes() {
  cupcakes = CupcakeRepository.getAll();
}

// Filtra cupcakes com base no termo de busca
function getFilteredCupcakes() {
  if (!searchTerm.trim()) return cupcakes;
  const term = searchTerm.toLowerCase();
  return cupcakes.filter((c) => c.name.toLowerCase().includes(term));
}

function renderCupcakes() {
  const list = document.getElementById("cupcake-list");
  list.innerHTML = "";

  const cupcakesToShow = getFilteredCupcakes();

  if (cupcakesToShow.length === 0) {
    list.innerHTML = "<p>Nenhum cupcake encontrado.</p>";
    return;
  }

  cupcakesToShow.forEach((cupcake) => {
    const card = document.createElement("div");
    card.className = "cupcake-card";

    card.innerHTML = `
      <h3 title="${cupcake.name}">${cupcake.name}</h3>
      <p>${cupcake.description}</p>
      <p class="price">R$ ${cupcake.price.toFixed(2).replace(".", ",")}</p>
      <button data-id="${cupcake.id}">Adicionar ao carrinho</button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(cupcake.id));

    list.appendChild(card);
  });
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");

  container.innerHTML = "";

  if (cartItems.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    totalSpan.textContent = "0,00";
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    const cupcake = cupcakes.find((c) => c.id === item.cupcakeId);
    if (!cupcake) return;

    const lineTotal = cupcake.price * item.quantity;
    total += lineTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${cupcake.name} (x${item.quantity})</span>
      <span>R$ ${lineTotal.toFixed(2).replace(".", ",")}</span>
      <button title="Remover item">X</button>
    `;

    const removeBtn = div.querySelector("button");
    removeBtn.addEventListener("click", () => removeFromCart(cupcake.id));

    container.appendChild(div);
  });

  totalSpan.textContent = total.toFixed(2).replace(".", ",");
}

function renderSales() {
  const sales = SaleRepository.getAll();
  const tbody = document.querySelector("#sales-table tbody");
  const emptyMsg = document.getElementById("sales-empty");

  tbody.innerHTML = "";

  if (sales.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  sales.forEach((sale) => {
    const tr = document.createElement("tr");

    const itemDescriptions = sale.items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ");

    const date = new Date(sale.createdAt);
    const dateString = date.toLocaleString("pt-BR");

    tr.innerHTML = `
      <td>${sale.id}</td>
      <td>${sale.customerName}</td>
      <td>${dateString}</td>
      <td>${itemDescriptions}</td>
      <td>R$ ${sale.total.toFixed(2).replace(".", ",")}</td>
      <td>${statusBadge(sale.status)}</td>
      <td class="actions"></td>
    `;

    const actionsTd = tr.querySelector(".actions");

    const payBtn = document.createElement("button");
    payBtn.textContent = "Marcar como pago";
    payBtn.addEventListener("click", () => {
      SaleRepository.updateStatus(sale.id, "Pago");
      renderSales();
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancelar";
    cancelBtn.addEventListener("click", () => {
      SaleRepository.updateStatus(sale.id, "Cancelado");
      renderSales();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => openDeleteModal(sale.id));

    actionsTd.appendChild(payBtn);
    actionsTd.appendChild(cancelBtn);
    actionsTd.appendChild(deleteBtn);

    tbody.appendChild(tr);
  });
}

function statusBadge(status) {
  const normalized = status.toLowerCase();
  let cls = "status-pendente";
  if (normalized === "pago") cls = "status-pago";
  if (normalized === "cancelado") cls = "status-cancelado";

  return `<span class="status-badge ${cls}">${status}</span>`;
}

function addToCart(cupcakeId) {
  const existing = cartItems.find((item) => item.cupcakeId === cupcakeId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ cupcakeId, quantity: 1 });
  }
  renderCart();
}

function removeFromCart(cupcakeId) {
  cartItems = cartItems.filter((item) => item.cupcakeId !== cupcakeId);
  renderCart();
}

function finalizeSale(event) {
  event.preventDefault();
  const nameInput = document.getElementById("customer-name");
  const message = document.getElementById("cart-message");

  message.textContent = "";

  if (cartItems.length === 0) {
    message.textContent =
      "Adicione pelo menos um cupcake ao carrinho antes de finalizar.";
    return;
  }

  if (!nameInput.value.trim()) {
    message.textContent = "Informe o nome do cliente.";
    return;
  }

  let total = 0;
  const items = cartItems
    .map((item) => {
      const cupcake = cupcakes.find((c) => c.id === item.cupcakeId);
      if (!cupcake) return null;

      const lineTotal = cupcake.price * item.quantity;
      total += lineTotal;
      return {
        cupcakeId: cupcake.id,
        name: cupcake.name,
        quantity: item.quantity,
        price: cupcake.price,
      };
    })
    .filter(Boolean);

  const sale = {
    id: Date.now(),
    customerName: nameInput.value.trim(),
    items,
    total,
    createdAt: new Date().toISOString(),
    status: "Pendente",
  };

  SaleRepository.create(sale);

  cartItems = [];
  renderCart();
  renderSales();
  nameInput.value = "";
  message.textContent = "Venda registrada com sucesso!";
}

function handleNewCupcake(event) {
  event.preventDefault();

  const nameInput = document.getElementById("new-cupcake-name");
  const descInput = document.getElementById("new-cupcake-description");
  const priceInput = document.getElementById("new-cupcake-price");
  const message = document.getElementById("new-cupcake-message");

  message.textContent = "";

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  // Aceitar vírgula ou ponto
  const rawPrice = priceInput.value.trim().replace(",", ".");
  const price = parseFloat(rawPrice);

  if (!name || !description || isNaN(price) || price <= 0) {
    message.textContent =
      "Preencha todos os campos com um preço válido (ex: 8,50).";
    return;
  }

  const newCupcake = {
    id: Date.now(),
    name,
    description,
    price,
  };

  cupcakes.push(newCupcake);
  CupcakeRepository.saveAll(cupcakes);

  nameInput.value = "";
  descInput.value = "";
  priceInput.value = "";
  message.textContent = "Cupcake cadastrado com sucesso!";

  renderCupcakes();
}

// Modal de confirmação de exclusão
function openDeleteModal(saleId) {
  pendingDeleteSaleId = saleId;
  const modal = document.getElementById("delete-modal");
  modal.classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteSaleId = null;
  const modal = document.getElementById("delete-modal");
  modal.classList.add("hidden");
}

function confirmDeleteSale() {
  if (pendingDeleteSaleId !== null) {
    SaleRepository.remove(pendingDeleteSaleId);
    renderSales();
  }
  closeDeleteModal();
}

// Botão voltar ao topo
function setupBackToTopButton() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Carrega catálogo
  loadCupcakes();

  renderCupcakes();
  renderCart();
  renderSales();
  setupBackToTopButton();

  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", finalizeSale);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderCupcakes();
  });

  const newCupcakeForm = document.getElementById("new-cupcake-form");
  newCupcakeForm.addEventListener("submit", handleNewCupcake);

  // Enter no campo de nome do cliente finaliza a venda sem comportamento estranho
  const customerNameInput = document.getElementById("customer-name");
  customerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkoutForm.requestSubmit();
    }
  });

  // Eventos do modal de exclusão
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

  confirmDeleteBtn.addEventListener("click", confirmDeleteSale);
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // Fecha modal clicando fora (opcional)
  const deleteModalOverlay = document.getElementById("delete-modal");
  deleteModalOverlay.addEventListener("click", (e) => {
    if (e.target === deleteModalOverlay) {
      closeDeleteModal();
    }
  });
});
