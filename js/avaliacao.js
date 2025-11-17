import { supabase } from './supabase.js'

let quill = null
let notaSelecionada = 0
let livroAtual = null

// TOAST – mensagem elegante
function toast(msg, tipo = "info") {

  const el = document.getElementById("toast")

  const cores = {
    info: "bg-gray-900",
    sucesso: "bg-green-600",
    erro: "bg-red-600",
    alerta: "bg-yellow-600"
  }

  el.className = `fixed bottom-6 right-6 text-white px-4 py-3 rounded-lg shadow-lg opacity-0 pointer-events-none transition-all duration-300 ${cores[tipo]}`

  el.textContent = msg

  // Aparece
  setTimeout(() => { el.style.opacity = "1" }, 10)

  // Some depois de 3s
  setTimeout(() => {
    el.style.opacity = "0"
  }, 3000)
}

// INICIAR MODAL
export function iniciarAvaliacaoModal() {

  livroAtual = null
  iniciarQuill()
  iniciarEstrelas()
  iniciarFechar()
  iniciarSalvar()
  carregarLivros()

  document.getElementById('nomeLivroBox').textContent = "NOME DO LIVRO"
  document.getElementById('placeholderCapa').classList.remove('hidden')
  document.getElementById('capaLivroAvaliacao').classList.add('hidden')

  quill.root.innerHTML = ""

  document.getElementById('modalAvaliacao').classList.remove('hidden')
}

// QUILL
function iniciarQuill() {
  if (quill) return

  quill = new Quill('#editor-av', {
    theme: 'snow',
    placeholder: 'Avaliação do livro...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }]
      ]
    }
  })
}

// CARREGAR LIVROS NO SELECT
async function carregarLivros() {
  const { data, error } = await supabase
    .from('livros')
    .select('id, titulo, capa')

  if (error) {
    console.error(error)
    return
  }

  const select = document.getElementById('selectLivro')
  select.innerHTML = '<option value="">Selecione um livro...</option>'

  data.forEach(livro => {
    const opt = document.createElement('option')
    opt.value = livro.id
    opt.textContent = livro.titulo
    opt.dataset.capa = livro.capa
    select.appendChild(opt)
  })

  // Seleção do livro
  select.addEventListener('change', () => {

    const id = select.value
    if (!id) return

    const option = select.options[select.selectedIndex]

    livroAtual = {
      id: id,
      titulo: option.textContent,
      capa: option.dataset.capa
    }

    atualizarDadosDoLivro()
  })
}

// Atualizar capa e nome
function atualizarDadosDoLivro() {
  const nome = document.getElementById('nomeLivroBox')
  const img = document.getElementById('capaLivroAvaliacao')
  const placeholder = document.getElementById('placeholderCapa')

  nome.textContent = livroAtual.titulo
  img.src = livroAtual.capa

  img.classList.remove('hidden')
  placeholder.classList.add('hidden')
}

// ESTRELAS
function iniciarEstrelas() {
  document.querySelectorAll('#estrelas span').forEach(star => {
    star.onclick = () => {
      notaSelecionada = Number(star.dataset.valor)
      atualizarEstrelas()
    }
  })
}

function atualizarEstrelas() {
  document.querySelectorAll('#estrelas span').forEach(s => {
    const val = Number(s.dataset.valor)
    s.classList.toggle('text-yellow-400', val <= notaSelecionada)
    s.classList.toggle('text-gray-300', val > notaSelecionada)
  })
}

// FECHAR
function iniciarFechar() {
  document.getElementById('fecharAvaliacao').onclick = () => {
    document.getElementById('modalAvaliacao').classList.add('hidden')
  }
}

// SALVAR
function iniciarSalvar() {
  document.getElementById('salvarAvaliacaoBtn').onclick = async () => {

    if (!livroAtual) return toast("Selecione um livro.", "alerta")
    if (!notaSelecionada) return toast("Selecione uma nota.", "alerta")

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'))
    const descricao = quill.root.innerHTML.trim()

    const { error } = await supabase
      .from('avaliacoes')
      .insert({
        usuario_id: usuario.id,
        livro_id: livroAtual.id,
        descricao,
        nota: notaSelecionada,
        data: new Date()
      })

    if (error) {
      console.error(error)
      return toast("Erro ao salvar avaliação.", "erro")
    }

    toast("Avaliação salva com sucesso!", "sucesso")

    document.getElementById('modalAvaliacao').classList.add('hidden')
  }
}
