// ==================== STATE ====================
const state = {
    view: 'desktop',
    currentScreen: 1,
    course: '',
    modality: '',
    city: '',
    name: '',
    cpf: '',
    birthDate: '',
    email: '',
    phone: '',
    selectedDisciplines: new Set(),
    paymentMethod: 'boleto',
    installments: 1,
    protocol: '',
    currentPage: 1,
    disciplineFilter: ''
};

const DISCIPLINES_PER_PAGE = 5;

const COURSES = [
    { value: 'ccomp', label: 'Ciência da Computação', price: 4200 },
    { value: 'eng', label: 'Engenharia de Software', price: 4500 },
    { value: 'adm', label: 'Administração', price: 3800 },
    { value: 'dir', label: 'Direito', price: 4800 },
    { value: 'med', label: 'Medicina', price: 12000 }
];

const MODALITIES = [
    { value: 'presencial', label: 'Presencial' },
    { value: 'hibrido', label: 'Híbrido' },
    { value: 'ead', label: 'EAD - À Distância' }
];

const CITIES = [
    { value: 'sao_leopoldo', label: 'São Leopoldo - RS' },
    { value: 'porto_alegre', label: 'Porto Alegre - RS' },
    { value: 'novo_hamburgo', label: 'Novo Hamburgo - RS' },
    { value: 'sao_paulo', label: 'São Paulo - SP' }
];

const DISCIPLINES = [
    { id: 1, name: 'Engenharia de Requisitos', credits: 4, schedule: '19:15 - 22:30', day: 'Seg/Qua', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 2, name: 'Banco de Dados II', credits: 4, schedule: '19:15 - 22:30', day: 'Ter/Qui', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 3, name: 'Algoritmos Avançados', credits: 4, schedule: '19:15 - 22:30', day: 'Seg/Qua', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 4, name: 'Redes de Computadores', credits: 4, schedule: '14:00 - 17:30', day: 'Sáb', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 5, name: 'Inteligência Artificial', credits: 4, schedule: '19:15 - 22:30', day: 'Sex', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 6, name: 'Engenharia de Software', credits: 4, schedule: '14:00 - 17:30', day: 'Sáb', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 7, name: 'Sistemas Distribuídos', credits: 4, schedule: '19:15 - 22:30', day: 'Ter/Qui', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 8, name: 'Computação em Nuvem', credits: 4, schedule: '19:15 - 22:30', day: 'Seg/Qua', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 9, name: 'Segurança da Informação', credits: 4, schedule: '14:00 - 17:30', day: 'Sáb', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 10, name: 'DevOps e Automação', credits: 4, schedule: '19:15 - 22:30', day: 'Sex', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 11, name: 'Mineração de Dados', credits: 4, schedule: '19:15 - 22:30', day: 'Ter/Qui', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 12, name: 'Desenvolvimento Mobile', credits: 4, schedule: '19:15 - 22:30', day: 'Seg/Qua', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 13, name: 'Computação Gráfica', credits: 4, schedule: '14:00 - 17:30', day: 'Sáb', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 14, name: 'Aprendizado de Máquina', credits: 4, schedule: '19:15 - 22:30', day: 'Sex', location: 'São Leopoldo', curriculum: 'Matriz completa' },
    { id: 15, name: 'Arquitetura de Software', credits: 4, schedule: '19:15 - 22:30', day: 'Ter/Qui', location: 'São Leopoldo', curriculum: 'Matriz completa' }
];

// ==================== UTILS ====================
function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatCPF(v) {
    return v.replace(/\D/g, '').slice(0,11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(v) {
    return v.replace(/\D/g, '').slice(0,11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}

function formatDate(v) {
    return v.replace(/\D/g, '').slice(0,8)
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
}

function generateProtocol() {
    return 'MAT-2026-' + Math.floor(Math.random() * 900000 + 100000);
}

function calculateTotal() {
    const course = COURSES.find(c => c.value === state.course);
    const baseValue = (course?.price || 4200);
    const disciplineCount = state.selectedDisciplines.size || 1;
    let total = baseValue * disciplineCount / 4;
    total = Math.max(total, baseValue);

    if (state.paymentMethod === 'pix') total *= 0.95;
    return total;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type} visible`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function openModal(id) {
    document.getElementById(id).classList.add('visible');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('visible');
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
    state.view = view;
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    render();
}

function resetPrototype() {
    state.currentScreen = 1;
    state.course = '';
    state.modality = '';
    state.city = '';
    state.name = '';
    state.cpf = '';
    state.birthDate = '';
    state.email = '';
    state.phone = '';
    state.selectedDisciplines.clear();
    state.paymentMethod = 'boleto';
    state.installments = 1;
    showToast('Protótipo reiniciado', 'info');
    render();
}

// ==================== NAVIGATION ====================
function goToScreen(num) {
    state.currentScreen = num;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateScreen1() {
    let valid = true;
    ['course', 'modality', 'city'].forEach(field => {
        const el = document.getElementById(`field-${field}`);
        const err = document.getElementById(`err-${field}`);
        if (!state[field]) {
            el?.classList.add('error');
            err?.classList.add('visible');
            valid = false;
        } else {
            el?.classList.remove('error');
            err?.classList.remove('visible');
        }
    });
    return valid;
}

function validateScreen2() {
    let valid = true;
    const fields = ['name', 'cpf', 'birthDate', 'email'];
    fields.forEach(field => {
        const el = document.getElementById(`field-${field}`);
        const err = document.getElementById(`err-${field}`);
        let isValid = !!state[field];
        if (field === 'email' && state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) isValid = false;
        if (field === 'cpf' && state.cpf.replace(/\D/g,'').length !== 11) isValid = false;
        if (!isValid) {
            el?.classList.add('error');
            err?.classList.add('visible');
            valid = false;
        } else {
            el?.classList.remove('error');
            el?.classList.add('success');
            err?.classList.remove('visible');
        }
    });
    if (state.selectedDisciplines.size === 0) {
        showToast('Selecione ao menos uma disciplina', 'error');
        valid = false;
    }
    return valid;
}

function handleStart() {
    if (!validateScreen1()) {
        showToast('Preencha todos os campos', 'error');
        return;
    }
    const btn = event.target.closest('button');
    btn.classList.add('loading');
    setTimeout(() => {
        btn.classList.remove('loading');
        goToScreen(2);
    }, 800);
}

function handleContinueToPayment() {
    if (!validateScreen2()) return;
    const btn = event.target.closest('button');
    btn.classList.add('loading');
    setTimeout(() => {
        btn.classList.remove('loading');
        goToScreen(3);
    }, 800);
}

function handleFinalize() {
    const btn = event.target.closest('button');
    btn.classList.add('loading');
    setTimeout(() => {
        btn.classList.remove('loading');
        state.protocol = generateProtocol();
        showToast('Matrícula realizada com sucesso!', 'success');
        goToScreen(4);
    }, 1500);
}

// ==================== FIELD HANDLERS ====================
function setField(field, value) {
    state[field] = value;
    const err = document.getElementById(`err-${field}`);
    err?.classList.remove('visible');
    document.getElementById(`field-${field}`)?.classList.remove('error');
}

function handleCpfInput(e) {
    e.target.value = formatCPF(e.target.value);
    setField('cpf', e.target.value);
}

function handlePhoneInput(e) {
    e.target.value = formatPhone(e.target.value);
    setField('phone', e.target.value);
}

function handleDateInput(e) {
    e.target.value = formatDate(e.target.value);
    setField('birthDate', e.target.value);
}

function toggleDiscipline(id) {
    if (state.selectedDisciplines.has(id)) {
        state.selectedDisciplines.delete(id);
    } else {
        if (state.selectedDisciplines.size >= 4) {
            showToast('Máximo de 4 disciplinas por semestre', 'error');
            return;
        }
        state.selectedDisciplines.add(id);
    }
    render();
}

function selectPaymentMethod(method) {
    state.paymentMethod = method;
    if (method !== 'cartao') state.installments = 1;
    render();
}

function setInstallments(n) {
    state.installments = parseInt(n);
    render();
}

function downloadBoleto() {
    showToast('Boleto baixado! (simulação)', 'success');
    closeModal('modal-boleto');
}

function viewBoleto() {
    document.getElementById('boleto-value').textContent = formatBRL(calculateTotal());
    openModal('modal-boleto');
}

// ==================== STEPPER ====================
function renderStepper(current) {
    const steps = ['Curso', 'Dados', 'Pagamento', 'Confirmação'];
    return `<div class="stepper">${steps.map((label, i) => {
        const num = i + 1;
        const cls = num < current ? 'completed' : num === current ? 'active' : '';
        const lineCls = num < current ? 'active' : '';
        const symbol = num < current ? '✓' : num;
        return `${i > 0 ? `<div class="step-line ${lineCls}"></div>` : ''}
            <div class="step ${cls}">
                <div class="step-number">${symbol}</div>
                <span>${label}</span>
            </div>`;
    }).join('')}</div>`;
}

// ==================== SCREEN 1 - LANDING ====================
function renderScreen1() {
    return `
    <div class="hero-section">
        <div class="hero-content">
            <div class="hero-badge">VESTIBULAR 2026 ABERTO</div>
            <div class="hero-logo">A<span>B</span>C</div>
            <h2 class="hero-title">Universidade do Conhecimento</h2>
            <p class="hero-tagline">Sua jornada acadêmica começa aqui. Escolha seu curso e dê o próximo passo.</p>
        </div>
    </div>
    <div class="enrollment-form">
        <h2 class="form-title">Iniciar Matrícula</h2>
        <p class="form-description">Selecione o curso, modalidade e unidade para começar.</p>
        <div class="form-grid-3">
            <div class="form-group">
                <label>Curso <span class="required">*</span></label>
                <select id="field-course" class="form-select" onchange="setField('course', this.value)">
                    <option value="">Selecione...</option>
                    ${COURSES.map(c => `<option value="${c.value}" ${state.course === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
                </select>
                <div id="err-course" class="form-error">⚠ Selecione um curso</div>
            </div>
            <div class="form-group">
                <label>Modalidade <span class="required">*</span></label>
                <select id="field-modality" class="form-select" onchange="setField('modality', this.value)">
                    <option value="">Selecione...</option>
                    ${MODALITIES.map(m => `<option value="${m.value}" ${state.modality === m.value ? 'selected' : ''}>${m.label}</option>`).join('')}
                </select>
                <div id="err-modality" class="form-error">⚠ Selecione a modalidade</div>
            </div>
            <div class="form-group">
                <label>Cidade / Unidade <span class="required">*</span></label>
                <select id="field-city" class="form-select" onchange="setField('city', this.value)">
                    <option value="">Selecione...</option>
                    ${CITIES.map(c => `<option value="${c.value}" ${state.city === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
                </select>
                <div id="err-city" class="form-error">⚠ Selecione a unidade</div>
            </div>
        </div>
        <div class="btn-center">
            <button class="btn-primary" onclick="handleStart()" style="min-width:280px;">
                Iniciar Matrícula <span>→</span>
            </button>
        </div>
    </div>`;
}

// ==================== SCREEN 2 - DATA + DISCIPLINES ====================
function renderScreen2() {
    const totalCredits = Array.from(state.selectedDisciplines).reduce((sum, id) => {
        return sum + (DISCIPLINES.find(d => d.id === id)?.credits || 0);
    }, 0);

    const { totalPages, visible, page } = getFilteredDisciplines();

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

    const html = `
    ${renderStepper(2)}
    <div class="screen-content">
        <button class="back-btn" onclick="goToScreen(1)">← Voltar</button>
        <h3 class="section-divider">Dados Pessoais</h3>
        <div class="form-grid-2">
            <div class="form-group">
                <label>Nome completo <span class="required">*</span></label>
                <input id="field-name" class="form-input" type="text" placeholder="Digite seu nome completo" value="${state.name}" oninput="setField('name', this.value)">
                <div id="err-name" class="form-error">⚠ Informe o nome completo</div>
            </div>
            <div class="form-group">
                <label>CPF <span class="required">*</span></label>
                <input id="field-cpf" class="form-input" type="text" placeholder="000.000.000-00" value="${state.cpf}" oninput="handleCpfInput(event)" maxlength="14">
                <div id="err-cpf" class="form-error">⚠ CPF inválido</div>
            </div>
        </div>
        <div class="form-grid-3">
            <div class="form-group">
                <label>Data de nascimento <span class="required">*</span></label>
                <input id="field-birthDate" class="form-input" type="text" placeholder="DD/MM/AAAA" value="${state.birthDate}" oninput="handleDateInput(event)" maxlength="10">
                <div id="err-birthDate" class="form-error">⚠ Data inválida</div>
            </div>
            <div class="form-group">
                <label>E-mail <span class="required">*</span></label>
                <input id="field-email" class="form-input" type="email" placeholder="seu@email.com" value="${state.email}" oninput="setField('email', this.value)">
                <div id="err-email" class="form-error">⚠ E-mail inválido</div>
            </div>
            <div class="form-group">
                <label>Telefone</label>
                <input id="field-phone" class="form-input" type="text" placeholder="(00) 00000-0000" value="${state.phone}" oninput="handlePhoneInput(event)" maxlength="15">
            </div>
        </div>

        <h3 class="section-divider">Disciplinas Disponíveis</h3>
        <div class="search-bar">
            <input id="field-search" class="search-input" placeholder="Buscar disciplina..." value="${state.disciplineFilter}" oninput="filterDisciplines(this.value)">
        </div>

        ${visible.length === 0 ? `
            <div style="text-align:center;padding:40px;color:var(--text-secondary);background:var(--bg);border-radius:var(--radius-sm);">
                Nenhuma disciplina encontrada
            </div>
        ` : `
        <table class="discipline-table">
            <thead>
                <tr>
                    <th>Disciplina</th>
                    <th>Horário</th>
                    <th>Local</th>
                    <th>Matriz</th>
                    <th style="text-align:center;width:80px">Selecionar</th>
                </tr>
            </thead>
            <tbody id="disciplines-tbody">
                ${visible.map(d => {
                    const sel = state.selectedDisciplines.has(d.id);
                    return `<tr class="${sel ? 'selected' : ''}" onclick="toggleDiscipline(${d.id})" data-name="${d.name.toLowerCase()}">
                        <td>
                            <div class="discipline-name">${d.name}<span class="discipline-credits">${d.credits} créd</span></div>
                            <div class="discipline-meta" style="margin-top:4px">📅 ${d.day}</div>
                        </td>
                        <td>${d.schedule}</td>
                        <td>${d.location}</td>
                        <td>${d.curriculum}</td>
                        <td style="text-align:center"><div class="checkbox-custom ${sel ? 'checked' : ''}"></div></td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>

        <div class="discipline-cards">
            ${visible.map(d => {
                const sel = state.selectedDisciplines.has(d.id);
                return `<div class="discipline-card ${sel ? 'selected' : ''}" onclick="toggleDiscipline(${d.id})">
                    <div class="discipline-card-info">
                        <h4>${d.name}</h4>
                        <p>🕐 ${d.schedule} · ${d.day}</p>
                        <p>📍 ${d.location}</p>
                    </div>
                    <div class="checkbox-custom ${sel ? 'checked' : ''}"></div>
                </div>`;
            }).join('')}
        </div>

        <div class="pagination">
            <span onclick="goToPage(${page - 1})" class="${page === 1 ? 'disabled' : ''}">←</span>
            ${pageNumbers.map(n => `<span onclick="goToPage(${n})" class="${n === page ? 'active' : ''}">${n}</span>`).join('')}
            <span onclick="goToPage(${page + 1})" class="${page === totalPages ? 'disabled' : ''}">→</span>
        </div>
        `}

        ${state.selectedDisciplines.size > 0 ? `
            <div class="selection-bar">
                <div class="selection-info">
                    <span class="selection-count">${state.selectedDisciplines.size} disciplina${state.selectedDisciplines.size > 1 ? 's' : ''}</span>
                    <span>${totalCredits} créditos selecionados</span>
                </div>
                <span class="selection-total">${formatBRL(calculateTotal())}</span>
            </div>
        ` : ''}

        <div class="btn-row">
            <button class="btn-secondary" onclick="goToScreen(1)">← Voltar</button>
            <button class="btn-primary" onclick="handleContinueToPayment()">
                Continuar <span>→</span>
            </button>
        </div>
    </div>`;
    return html;
}

function filterDisciplines(query) {
    state.disciplineFilter = query;
    state.currentPage = 1;
    render();
}

function goToPage(page) {
    const totalPages = getFilteredDisciplines().totalPages;
    if (page < 1 || page > totalPages) return;
    state.currentPage = page;
    render();
}

function getFilteredDisciplines() {
    const q = state.disciplineFilter.toLowerCase();
    const filtered = DISCIPLINES.filter(d => d.name.toLowerCase().includes(q));
    const totalPages = Math.max(1, Math.ceil(filtered.length / DISCIPLINES_PER_PAGE));
    const page = Math.min(state.currentPage, totalPages);
    const start = (page - 1) * DISCIPLINES_PER_PAGE;
    const visible = filtered.slice(start, start + DISCIPLINES_PER_PAGE);
    return { filtered, totalPages, visible, page };
}

// ==================== SCREEN 3 - PAYMENT ====================
function renderScreen3() {
    const total = calculateTotal();
    const courseLabel = COURSES.find(c => c.value === state.course)?.label || '-';
    const modalityLabel = MODALITIES.find(m => m.value === state.modality)?.label || '-';

    const installmentValue = total / state.installments;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toLocaleDateString('pt-BR');

    return `
    ${renderStepper(3)}
    <div class="screen-content">
        <button class="back-btn" onclick="goToScreen(2)">← Voltar</button>

        <h3 class="section-divider">Resumo da Matrícula</h3>
        <div class="payment-summary">
            <div class="payment-row">
                <span class="label">Curso</span>
                <span><strong>${courseLabel}</strong></span>
            </div>
            <div class="payment-row">
                <span class="label">Modalidade</span>
                <span>${modalityLabel}</span>
            </div>
            <div class="payment-row">
                <span class="label">Disciplinas selecionadas</span>
                <span><strong>${state.selectedDisciplines.size} disciplina${state.selectedDisciplines.size > 1 ? 's' : ''}</strong></span>
            </div>
            <div class="payment-row">
                <span class="label">Semestre</span>
                <span>2026/1</span>
            </div>
            <div class="payment-row">
                <span class="label">Valor base</span>
                <span>${formatBRL(total / (state.paymentMethod === 'pix' ? 0.95 : 1))}</span>
            </div>
        </div>

        <h3 class="section-divider">Forma de Pagamento</h3>
        <div class="payment-methods">
            <div class="payment-method ${state.paymentMethod === 'boleto' ? 'selected' : ''}" onclick="selectPaymentMethod('boleto')">
                <div class="method-icon">📄</div>
                <div>
                    <div class="method-name">Boleto Bancário</div>
                    <div class="method-desc">À vista</div>
                </div>
            </div>
            <div class="payment-method ${state.paymentMethod === 'cartao' ? 'selected' : ''}" onclick="selectPaymentMethod('cartao')">
                <div class="method-icon">💳</div>
                <div>
                    <div class="method-name">Cartão de Crédito</div>
                    <div class="method-desc">Em até 12x</div>
                </div>
            </div>
            <div class="payment-method ${state.paymentMethod === 'pix' ? 'selected' : ''}" onclick="selectPaymentMethod('pix')">
                <div class="method-icon">⚡</div>
                <div>
                    <div class="method-name">PIX</div>
                    <div class="method-desc"><span class="method-discount">5% OFF</span></div>
                </div>
            </div>
        </div>

        ${state.paymentMethod === 'cartao' ? `
            <div class="installments-selector visible">
                <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;display:block;">Parcelar em:</label>
                <select class="form-select" onchange="setInstallments(this.value)">
                    ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                        const v = total / n;
                        return `<option value="${n}" ${n === state.installments ? 'selected' : ''}>${n}x de ${formatBRL(v)} ${n === 1 ? '(à vista)' : ''}</option>`;
                    }).join('')}
                </select>
            </div>
        ` : ''}

        <div class="total-highlight">
            <div>
                <div class="label">Total ${state.paymentMethod === 'cartao' && state.installments > 1 ? `em ${state.installments}x` : ''}</div>
                ${state.paymentMethod === 'cartao' && state.installments > 1 ? `<div style="font-size:0.85rem;opacity:0.85">${state.installments}x de ${formatBRL(installmentValue)}</div>` : ''}
            </div>
            <div class="value">${formatBRL(total)}</div>
        </div>

        ${state.paymentMethod === 'boleto' ? `
            <div class="boleto-preview-card">
                <div class="icon">📄</div>
                <h4>Boleto pronto para pagamento</h4>
                <p>Vencimento: ${dueDateStr}</p>
                <button class="btn-outline" onclick="viewBoleto()">👁 Visualizar Boleto</button>
            </div>
        ` : ''}

        ${state.paymentMethod === 'pix' ? `
            <div class="boleto-preview-card">
                <div class="icon">⚡</div>
                <h4>Pague com PIX e ganhe 5%</h4>
                <p>Pagamento instantâneo via QR Code</p>
                <button class="btn-outline" onclick="showToast('QR Code gerado!','success')">📱 Gerar QR Code</button>
            </div>
        ` : ''}

        <div class="btn-row">
            <button class="btn-secondary" onclick="goToScreen(2)">← Voltar</button>
            <button class="btn-primary" onclick="handleFinalize()">
                Finalizar Matrícula <span>✓</span>
            </button>
        </div>
    </div>`;
}

// ==================== SCREEN 4 - SUCCESS ====================
function renderScreen4() {
    const total = calculateTotal();
    const courseLabel = COURSES.find(c => c.value === state.course)?.label || '-';
    const startDate = '03/03/2026';

    return `
    ${renderStepper(4)}
    <div class="success-content">
        <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <h2 class="success-title">Parabéns, você está matriculado!</h2>
        <p class="success-message">Sua matrícula foi realizada com sucesso. Enviamos os detalhes para <strong>${state.email || 'seu e-mail'}</strong>.</p>

        <div class="success-details">
            <div class="success-detail-row">
                <span class="label">Protocolo</span>
                <span class="value">#${state.protocol || generateProtocol()}</span>
            </div>
            <div class="success-detail-row">
                <span class="label">Aluno</span>
                <span class="value">${state.name || '-'}</span>
            </div>
            <div class="success-detail-row">
                <span class="label">Curso</span>
                <span class="value">${courseLabel}</span>
            </div>
            <div class="success-detail-row">
                <span class="label">Disciplinas</span>
                <span class="value">${state.selectedDisciplines.size}</span>
            </div>
            <div class="success-detail-row">
                <span class="label">Valor pago</span>
                <span class="value">${formatBRL(total)}</span>
            </div>
            <div class="success-detail-row">
                <span class="label">Início das aulas</span>
                <span class="value">${startDate}</span>
            </div>
        </div>

        <div class="success-actions">
            <button class="btn-secondary" onclick="showToast('Comprovante baixado!','success')">📥 Baixar Comprovante</button>
            <button class="btn-primary" style="background:linear-gradient(135deg, var(--success), #66bb6a);box-shadow:0 4px 16px rgba(67,160,71,0.3);" onclick="resetPrototype()">Voltar ao Início</button>
        </div>
    </div>`;
}

// ==================== MAIN RENDER ====================
function render() {
    const activeId = document.activeElement?.id;
    const selStart = document.activeElement?.selectionStart;
    const selEnd = document.activeElement?.selectionEnd;

    const container = document.getElementById('prototype-container');
    const isMobile = state.view === 'mobile';
    const frameClass = isMobile ? 'mobile' : 'desktop';

    let header = '';
    if (isMobile) {
        header = `<div class="mobile-status">
            <span>9:41</span>
            <div class="status-icons"><span>📶</span><span>📶</span><span>🔋 100%</span></div>
        </div>`;
    } else {
        header = `<div class="browser-bar">
            <div class="browser-actions">
                <span class="browser-action">←</span>
                <span class="browser-action">→</span>
                <span class="browser-action">↻</span>
            </div>
            <div class="browser-url">matricula.abc.edu.br/${['', 'inicio', 'dados', 'pagamento', 'confirmacao'][state.currentScreen]}</div>
            <div class="browser-actions">
                <span class="browser-action">⋯</span>
            </div>
        </div>`;
    }

    let screenHtml;
    switch(state.currentScreen) {
        case 1: screenHtml = renderScreen1(); break;
        case 2: screenHtml = renderScreen2(); break;
        case 3: screenHtml = renderScreen3(); break;
        case 4: screenHtml = renderScreen4(); break;
    }

    container.innerHTML = `<div class="device-frame ${frameClass}">${header}<div class="screen active">${screenHtml}</div></div>`;

    if (activeId) {
        const el = document.getElementById(activeId);
        if (el && typeof el.focus === 'function') {
            el.focus();
            if (selStart != null && el.setSelectionRange) {
                try { el.setSelectionRange(selStart, selEnd); } catch (_) {}
            }
        }
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    render();
    showToast('Bem-vindo ao protótipo ABC Matrícula', 'info');
});

// Click outside modal to close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('visible');
    }
});

// ESC closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.visible').forEach(m => m.classList.remove('visible'));
    }
});
