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
    toast.innerHTML = `<span aria-hidden="true">${icons[type]}</span> ${message}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

// WCAG 4.1.3 Status Messages — anuncia mudanças para leitores de tela
function announce(message) {
    const sr = document.getElementById('sr-announcer');
    if (!sr) return;
    sr.textContent = '';
    setTimeout(() => { sr.textContent = message; }, 50);
}

let lastFocusBeforeModal = null;

function openModal(id) {
    lastFocusBeforeModal = document.activeElement;
    const modal = document.getElementById(id);
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
    // Move foco para dentro do modal (botão de fechar)
    setTimeout(() => {
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn?.focus();
    }, 100);
    announce('Modal aberto');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
    // Restaura foco para onde estava antes
    if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === 'function') {
        lastFocusBeforeModal.focus();
    }
    announce('Modal fechado');
}

// ==================== VIEW SWITCHING ====================
function switchView(view) {
    state.view = view;
    document.querySelectorAll('.toggle-btn').forEach(b => {
        const isActive = b.dataset.view === view;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    announce(view === 'mobile' ? 'Visualização móvel ativada' : 'Visualização desktop ativada');
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
    state.currentPage = 1;
    state.disciplineFilter = '';
    showToast('Protótipo reiniciado', 'info');
    announce('Protótipo reiniciado. Tela inicial carregada.');
    render();
    focusScreenHeading();
}

// ==================== NAVIGATION ====================
function goToScreen(num) {
    state.currentScreen = num;
    const titles = ['', 'Iniciar matrícula', 'Dados pessoais e disciplinas', 'Pagamento', 'Confirmação da matrícula'];
    announce(`Tela ${num} de 4: ${titles[num]}`);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    focusScreenHeading();
}

function focusScreenHeading() {
    setTimeout(() => {
        const heading = document.getElementById('screen-heading');
        heading?.focus();
    }, 50);
}

function validateScreen1() {
    let valid = true;
    let firstInvalid = null;
    ['course', 'modality', 'city'].forEach(field => {
        const el = document.getElementById(`field-${field}`);
        const err = document.getElementById(`err-${field}`);
        if (!state[field]) {
            el?.classList.add('error');
            el?.setAttribute('aria-invalid', 'true');
            err?.classList.add('visible');
            if (!firstInvalid) firstInvalid = el;
            valid = false;
        } else {
            el?.classList.remove('error');
            el?.setAttribute('aria-invalid', 'false');
            err?.classList.remove('visible');
        }
    });
    if (!valid) firstInvalid?.focus();
    return valid;
}

function validateScreen2() {
    let valid = true;
    let firstInvalid = null;
    const fields = ['name', 'cpf', 'birthDate', 'email'];
    fields.forEach(field => {
        const el = document.getElementById(`field-${field}`);
        const err = document.getElementById(`err-${field}`);
        let isValid = !!state[field];
        if (field === 'email' && state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) isValid = false;
        if (field === 'cpf' && state.cpf.replace(/\D/g,'').length !== 11) isValid = false;
        if (!isValid) {
            el?.classList.add('error');
            el?.setAttribute('aria-invalid', 'true');
            err?.classList.add('visible');
            if (!firstInvalid) firstInvalid = el;
            valid = false;
        } else {
            el?.classList.remove('error');
            el?.classList.add('success');
            el?.setAttribute('aria-invalid', 'false');
            err?.classList.remove('visible');
        }
    });
    if (state.selectedDisciplines.size === 0) {
        showToast('Selecione ao menos uma disciplina', 'error');
        announce('Erro: selecione ao menos uma disciplina');
        valid = false;
    }
    if (!valid && firstInvalid) firstInvalid.focus();
    return valid;
}

function handleStart() {
    if (!validateScreen1()) {
        showToast('Preencha todos os campos', 'error');
        announce('Erro: preencha todos os campos obrigatórios antes de continuar');
        return;
    }
    const btn = (event && event.target?.closest && event.target.closest('button')) || document.querySelector('.enrollment-form button[type="submit"]');
    btn?.classList.add('loading');
    btn?.setAttribute('aria-busy', 'true');
    announce('Carregando próxima tela');
    setTimeout(() => {
        btn?.classList.remove('loading');
        btn?.removeAttribute('aria-busy');
        goToScreen(2);
    }, 800);
}

function handleContinueToPayment() {
    if (!validateScreen2()) return;
    const btn = (event && event.target?.closest && event.target.closest('button[type="submit"]')) || document.querySelector('.btn-row .btn-primary');
    btn?.classList.add('loading');
    btn?.setAttribute('aria-busy', 'true');
    announce('Carregando tela de pagamento');
    setTimeout(() => {
        btn?.classList.remove('loading');
        btn?.removeAttribute('aria-busy');
        goToScreen(3);
    }, 800);
}

function handleFinalize() {
    const btn = event.target.closest('button');
    btn.classList.add('loading');
    btn.setAttribute('aria-busy', 'true');
    announce('Processando matrícula');
    setTimeout(() => {
        btn.classList.remove('loading');
        btn.removeAttribute('aria-busy');
        state.protocol = generateProtocol();
        showToast('Matrícula realizada com sucesso!', 'success');
        announce('Matrícula realizada com sucesso. Tela de confirmação carregada.');
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
    return `<nav class="stepper" aria-label="Progresso da matrícula"><ol style="display:contents;list-style:none;">${steps.map((label, i) => {
        const num = i + 1;
        const cls = num < current ? 'completed' : num === current ? 'active' : '';
        const lineCls = num < current ? 'active' : '';
        const symbol = num < current ? '✓' : num;
        const status = num < current ? 'concluído' : num === current ? 'atual' : 'pendente';
        const ariaCurrent = num === current ? 'aria-current="step"' : '';
        return `${i > 0 ? `<li class="step-line ${lineCls}" aria-hidden="true"></li>` : ''}
            <li class="step ${cls}" ${ariaCurrent}>
                <span class="step-number" aria-hidden="true">${symbol}</span>
                <span>${label}</span>
                <span class="sr-only">: passo ${num} de ${steps.length}, ${status}</span>
            </li>`;
    }).join('')}</ol></nav>`;
}

// ==================== SCREEN 1 - LANDING ====================
function renderScreen1() {
    return `
    <section class="hero-section" aria-labelledby="hero-title">
        <div class="hero-content">
            <p class="hero-badge">VESTIBULAR 2026 ABERTO</p>
            <p class="hero-logo" aria-label="ABC Universidade">A<span aria-hidden="true">B</span><span class="sr-only">B</span>C</p>
            <h1 id="hero-title" class="hero-title">Universidade do Conhecimento</h1>
            <p class="hero-tagline">Sua jornada acadêmica começa aqui. Escolha seu curso e dê o próximo passo.</p>
        </div>
    </section>
    <form class="enrollment-form" onsubmit="event.preventDefault();handleStart()" novalidate>
        <h2 id="screen-heading" class="form-title" tabindex="-1">Iniciar Matrícula</h2>
        <p class="form-description">Selecione o curso, modalidade e unidade para começar. Campos com asterisco são obrigatórios.</p>
        <div class="form-grid-3">
            <div class="form-group">
                <label for="field-course">Curso <span class="required" aria-hidden="true">*</span></label>
                <select id="field-course" class="form-select" onchange="setField('course', this.value)" aria-required="true" aria-invalid="false" aria-describedby="err-course">
                    <option value="">Selecione...</option>
                    ${COURSES.map(c => `<option value="${c.value}" ${state.course === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
                </select>
                <div id="err-course" class="form-error" role="alert"><span aria-hidden="true">⚠</span> Selecione um curso</div>
            </div>
            <div class="form-group">
                <label for="field-modality">Modalidade <span class="required" aria-hidden="true">*</span></label>
                <select id="field-modality" class="form-select" onchange="setField('modality', this.value)" aria-required="true" aria-invalid="false" aria-describedby="err-modality">
                    <option value="">Selecione...</option>
                    ${MODALITIES.map(m => `<option value="${m.value}" ${state.modality === m.value ? 'selected' : ''}>${m.label}</option>`).join('')}
                </select>
                <div id="err-modality" class="form-error" role="alert"><span aria-hidden="true">⚠</span> Selecione a modalidade</div>
            </div>
            <div class="form-group">
                <label for="field-city">Cidade / Unidade <span class="required" aria-hidden="true">*</span></label>
                <select id="field-city" class="form-select" onchange="setField('city', this.value)" aria-required="true" aria-invalid="false" aria-describedby="err-city">
                    <option value="">Selecione...</option>
                    ${CITIES.map(c => `<option value="${c.value}" ${state.city === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
                </select>
                <div id="err-city" class="form-error" role="alert"><span aria-hidden="true">⚠</span> Selecione a unidade</div>
            </div>
        </div>
        <div class="btn-center">
            <button type="submit" class="btn-primary" style="min-width:280px;">
                Iniciar Matrícula <span aria-hidden="true">→</span>
            </button>
        </div>
    </form>`;
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
        <button class="back-btn" onclick="goToScreen(1)" aria-label="Voltar para a tela de seleção de curso"><span aria-hidden="true">←</span> Voltar</button>
        <h2 id="screen-heading" class="section-divider" tabindex="-1">Dados Pessoais</h2>
        <form onsubmit="event.preventDefault();handleContinueToPayment()" novalidate>
        <div class="form-grid-2">
            <div class="form-group">
                <label for="field-name">Nome completo <span class="required" aria-hidden="true">*</span></label>
                <input id="field-name" class="form-input" type="text" placeholder="Digite seu nome completo" value="${state.name}" oninput="setField('name', this.value)" aria-required="true" aria-invalid="false" aria-describedby="err-name" autocomplete="name">
                <div id="err-name" class="form-error" role="alert"><span aria-hidden="true">⚠</span> Informe o nome completo</div>
            </div>
            <div class="form-group">
                <label for="field-cpf">CPF <span class="required" aria-hidden="true">*</span></label>
                <input id="field-cpf" class="form-input" type="text" inputmode="numeric" placeholder="000.000.000-00" value="${state.cpf}" oninput="handleCpfInput(event)" maxlength="14" aria-required="true" aria-invalid="false" aria-describedby="err-cpf hint-cpf">
                <span id="hint-cpf" class="sr-only">11 dígitos numéricos no formato 000.000.000-00</span>
                <div id="err-cpf" class="form-error" role="alert"><span aria-hidden="true">⚠</span> CPF inválido</div>
            </div>
        </div>
        <div class="form-grid-3">
            <div class="form-group">
                <label for="field-birthDate">Data de nascimento <span class="required" aria-hidden="true">*</span></label>
                <input id="field-birthDate" class="form-input" type="text" inputmode="numeric" placeholder="DD/MM/AAAA" value="${state.birthDate}" oninput="handleDateInput(event)" maxlength="10" aria-required="true" aria-invalid="false" aria-describedby="err-birthDate hint-birth" autocomplete="bday">
                <span id="hint-birth" class="sr-only">Formato dia, mês, ano com 4 dígitos</span>
                <div id="err-birthDate" class="form-error" role="alert"><span aria-hidden="true">⚠</span> Data inválida</div>
            </div>
            <div class="form-group">
                <label for="field-email">E-mail <span class="required" aria-hidden="true">*</span></label>
                <input id="field-email" class="form-input" type="email" placeholder="seu@email.com" value="${state.email}" oninput="setField('email', this.value)" aria-required="true" aria-invalid="false" aria-describedby="err-email" autocomplete="email">
                <div id="err-email" class="form-error" role="alert"><span aria-hidden="true">⚠</span> E-mail inválido</div>
            </div>
            <div class="form-group">
                <label for="field-phone">Telefone</label>
                <input id="field-phone" class="form-input" type="tel" inputmode="tel" placeholder="(00) 00000-0000" value="${state.phone}" oninput="handlePhoneInput(event)" maxlength="15" autocomplete="tel">
            </div>
        </div>

        <h2 class="section-divider">Disciplinas Disponíveis</h2>
        <p class="sr-only" id="disc-instructions">Selecione até 4 disciplinas. Use Tab para navegar e Espaço ou Enter para marcar/desmarcar.</p>
        <div class="search-bar" role="search">
            <label for="field-search" class="sr-only">Buscar disciplina por nome</label>
            <input id="field-search" class="search-input" placeholder="Buscar disciplina..." value="${state.disciplineFilter}" oninput="filterDisciplines(this.value)" aria-controls="disciplines-tbody" type="search">
        </div>

        ${visible.length === 0 ? `
            <div role="status" style="text-align:center;padding:40px;color:var(--text-secondary);background:var(--bg);border-radius:var(--radius-sm);">
                Nenhuma disciplina encontrada
            </div>
        ` : `
        <table class="discipline-table" aria-describedby="disc-instructions">
            <caption class="sr-only">Disciplinas disponíveis para matrícula. Página ${page} de ${totalPages}.</caption>
            <thead>
                <tr>
                    <th scope="col">Disciplina</th>
                    <th scope="col">Horário</th>
                    <th scope="col">Local</th>
                    <th scope="col">Matriz</th>
                    <th scope="col" style="text-align:center;width:80px">Selecionar</th>
                </tr>
            </thead>
            <tbody id="disciplines-tbody">
                ${visible.map(d => {
                    const sel = state.selectedDisciplines.has(d.id);
                    return `<tr class="${sel ? 'selected' : ''}" role="checkbox" aria-checked="${sel}" tabindex="0" onclick="toggleDiscipline(${d.id})" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleDiscipline(${d.id});}" aria-label="${d.name}, ${d.credits} créditos, ${d.day} ${d.schedule}, ${d.location}" data-name="${d.name.toLowerCase()}">
                        <td>
                            <div class="discipline-name">${d.name}<span class="discipline-credits">${d.credits} créd</span></div>
                            <div class="discipline-meta" style="margin-top:4px"><span aria-hidden="true">📅</span> ${d.day}</div>
                        </td>
                        <td>${d.schedule}</td>
                        <td>${d.location}</td>
                        <td>${d.curriculum}</td>
                        <td style="text-align:center"><span class="checkbox-custom ${sel ? 'checked' : ''}" aria-hidden="true"></span></td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>

        <ul class="discipline-cards" role="list" aria-describedby="disc-instructions">
            ${visible.map(d => {
                const sel = state.selectedDisciplines.has(d.id);
                return `<li class="discipline-card ${sel ? 'selected' : ''}" role="checkbox" aria-checked="${sel}" tabindex="0" onclick="toggleDiscipline(${d.id})" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();toggleDiscipline(${d.id});}" aria-label="${d.name}, ${d.credits} créditos, ${d.day} ${d.schedule}">
                    <div class="discipline-card-info">
                        <h4>${d.name}</h4>
                        <p><span aria-hidden="true">🕐</span> ${d.schedule} · ${d.day}</p>
                        <p><span aria-hidden="true">📍</span> ${d.location}</p>
                    </div>
                    <span class="checkbox-custom ${sel ? 'checked' : ''}" aria-hidden="true"></span>
                </li>`;
            }).join('')}
        </ul>

        <nav class="pagination" aria-label="Paginação de disciplinas">
            <button type="button" onclick="goToPage(${page - 1})" class="${page === 1 ? 'disabled' : ''}" ${page === 1 ? 'disabled aria-disabled="true"' : ''} aria-label="Página anterior"><span aria-hidden="true">←</span></button>
            ${pageNumbers.map(n => `<button type="button" onclick="goToPage(${n})" class="${n === page ? 'active' : ''}" aria-label="Página ${n}" ${n === page ? 'aria-current="page"' : ''}>${n}</button>`).join('')}
            <button type="button" onclick="goToPage(${page + 1})" class="${page === totalPages ? 'disabled' : ''}" ${page === totalPages ? 'disabled aria-disabled="true"' : ''} aria-label="Próxima página"><span aria-hidden="true">→</span></button>
        </nav>
        `}

        ${state.selectedDisciplines.size > 0 ? `
            <div class="selection-bar" role="status" aria-live="polite">
                <div class="selection-info">
                    <span class="selection-count">${state.selectedDisciplines.size} disciplina${state.selectedDisciplines.size > 1 ? 's' : ''}</span>
                    <span>${totalCredits} créditos selecionados</span>
                </div>
                <span class="selection-total">${formatBRL(calculateTotal())}</span>
            </div>
        ` : ''}

        <div class="btn-row">
            <button type="button" class="btn-secondary" onclick="goToScreen(1)"><span aria-hidden="true">←</span> Voltar</button>
            <button type="submit" class="btn-primary">
                Continuar <span aria-hidden="true">→</span>
            </button>
        </div>
        </form>
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
        <button class="back-btn" onclick="goToScreen(2)" aria-label="Voltar para a tela de dados pessoais"><span aria-hidden="true">←</span> Voltar</button>

        <h2 id="screen-heading" class="section-divider" tabindex="-1">Resumo da Matrícula</h2>
        <dl class="payment-summary">
            <div class="payment-row">
                <dt class="label">Curso</dt>
                <dd><strong>${courseLabel}</strong></dd>
            </div>
            <div class="payment-row">
                <dt class="label">Modalidade</dt>
                <dd>${modalityLabel}</dd>
            </div>
            <div class="payment-row">
                <dt class="label">Disciplinas selecionadas</dt>
                <dd><strong>${state.selectedDisciplines.size} disciplina${state.selectedDisciplines.size > 1 ? 's' : ''}</strong></dd>
            </div>
            <div class="payment-row">
                <dt class="label">Semestre</dt>
                <dd>2026/1</dd>
            </div>
            <div class="payment-row">
                <dt class="label">Valor base</dt>
                <dd>${formatBRL(total / (state.paymentMethod === 'pix' ? 0.95 : 1))}</dd>
            </div>
        </dl>

        <h2 class="section-divider" id="payment-method-label">Forma de Pagamento</h2>
        <div class="payment-methods" role="radiogroup" aria-labelledby="payment-method-label">
            <button type="button" class="payment-method ${state.paymentMethod === 'boleto' ? 'selected' : ''}" onclick="selectPaymentMethod('boleto')" role="radio" aria-checked="${state.paymentMethod === 'boleto'}">
                <span class="method-icon" aria-hidden="true">📄</span>
                <span>
                    <span class="method-name">Boleto Bancário</span>
                    <span class="method-desc">À vista</span>
                </span>
            </button>
            <button type="button" class="payment-method ${state.paymentMethod === 'cartao' ? 'selected' : ''}" onclick="selectPaymentMethod('cartao')" role="radio" aria-checked="${state.paymentMethod === 'cartao'}">
                <span class="method-icon" aria-hidden="true">💳</span>
                <span>
                    <span class="method-name">Cartão de Crédito</span>
                    <span class="method-desc">Em até 12x</span>
                </span>
            </button>
            <button type="button" class="payment-method ${state.paymentMethod === 'pix' ? 'selected' : ''}" onclick="selectPaymentMethod('pix')" role="radio" aria-checked="${state.paymentMethod === 'pix'}">
                <span class="method-icon" aria-hidden="true">⚡</span>
                <span>
                    <span class="method-name">PIX</span>
                    <span class="method-desc"><span class="method-discount">5% OFF</span></span>
                </span>
            </button>
        </div>

        ${state.paymentMethod === 'cartao' ? `
            <div class="installments-selector visible">
                <label for="field-installments" style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;display:block;">Parcelar em:</label>
                <select id="field-installments" class="form-select" onchange="setInstallments(this.value)">
                    ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                        const v = total / n;
                        return `<option value="${n}" ${n === state.installments ? 'selected' : ''}>${n}x de ${formatBRL(v)} ${n === 1 ? '(à vista)' : ''}</option>`;
                    }).join('')}
                </select>
            </div>
        ` : ''}

        <div class="total-highlight" role="region" aria-label="Valor total da matrícula">
            <div>
                <div class="label">Total ${state.paymentMethod === 'cartao' && state.installments > 1 ? `em ${state.installments}x` : ''}</div>
                ${state.paymentMethod === 'cartao' && state.installments > 1 ? `<div style="font-size:0.85rem;opacity:0.85">${state.installments}x de ${formatBRL(installmentValue)}</div>` : ''}
            </div>
            <div class="value">${formatBRL(total)}</div>
        </div>

        ${state.paymentMethod === 'boleto' ? `
            <div class="boleto-preview-card">
                <div class="icon" aria-hidden="true">📄</div>
                <h3>Boleto pronto para pagamento</h3>
                <p>Vencimento: ${dueDateStr}</p>
                <button class="btn-outline" onclick="viewBoleto()" aria-haspopup="dialog"><span aria-hidden="true">👁</span> Visualizar Boleto</button>
            </div>
        ` : ''}

        ${state.paymentMethod === 'pix' ? `
            <div class="boleto-preview-card">
                <div class="icon" aria-hidden="true">⚡</div>
                <h3>Pague com PIX e ganhe 5%</h3>
                <p>Pagamento instantâneo via QR Code</p>
                <button class="btn-outline" onclick="showToast('QR Code gerado!','success')"><span aria-hidden="true">📱</span> Gerar QR Code</button>
            </div>
        ` : ''}

        <div class="btn-row">
            <button type="button" class="btn-secondary" onclick="goToScreen(2)"><span aria-hidden="true">←</span> Voltar</button>
            <button type="button" class="btn-primary" onclick="handleFinalize()">
                Finalizar Matrícula <span aria-hidden="true">✓</span>
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
        <div class="success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <h2 id="screen-heading" class="success-title" tabindex="-1">Parabéns, você está matriculado!</h2>
        <p class="success-message">Sua matrícula foi realizada com sucesso. Enviamos os detalhes para <strong>${state.email || 'seu e-mail'}</strong>.</p>

        <dl class="success-details" aria-label="Detalhes da matrícula">
            <div class="success-detail-row">
                <dt class="label">Protocolo</dt>
                <dd class="value">#${state.protocol || generateProtocol()}</dd>
            </div>
            <div class="success-detail-row">
                <dt class="label">Aluno</dt>
                <dd class="value">${state.name || '-'}</dd>
            </div>
            <div class="success-detail-row">
                <dt class="label">Curso</dt>
                <dd class="value">${courseLabel}</dd>
            </div>
            <div class="success-detail-row">
                <dt class="label">Disciplinas</dt>
                <dd class="value">${state.selectedDisciplines.size}</dd>
            </div>
            <div class="success-detail-row">
                <dt class="label">Valor pago</dt>
                <dd class="value">${formatBRL(total)}</dd>
            </div>
            <div class="success-detail-row">
                <dt class="label">Início das aulas</dt>
                <dd class="value">${startDate}</dd>
            </div>
        </dl>

        <div class="success-actions">
            <button class="btn-secondary" onclick="showToast('Comprovante baixado!','success')"><span aria-hidden="true">📥</span> Baixar Comprovante</button>
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
