import { supabase } from './supabase.js'

let quillEdit = null
let avaliacaoId = null
let notaSelecionada = 0

// Toast simples no padrão do projeto
function toast(msg) {
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.remove('opacity-0')
  setTimeout(() => t.classList.add('opacity-0'), 1800)
}

// Função principal chamada pelo perfil.html
export async function iniciarEditarAvaliacao(id) {
  avaliacaoId = id
  notaSelecionada = 0

// Sempre recriar o Quill ao abrir o modal
quillEdit = new Quill('#editor-edit', {
  theme: 'snow',
  placeholder: 'Edite sua avaliação...'
})

  // Reset visual do modal antes de preencher
  quillEdit.setContents([]) //
  limparEstrelas()

  // Buscar dados da avaliação no Supabase
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('nota, descricao, livros(id, titulo, capa)')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Erro ao carregar avaliação:', error)
    return toast('Erro ao carregar.')
  }

  // Preencher capa e título
  document.getElementById('capaLivroEdit').src = data.livros.capa
  document.getElementById('tituloLivroEdit').textContent = data.livros.titulo

  // Preencher conteúdo no editor
  quillEdit.clipboard.dangerouslyPasteHTML(data.descricao || '')

  // Preencher estrelas
  notaSelecionada = data.nota
  marcarEstrelas()

  // Eventos das estrelas
  document.querySelectorAll('#estrelas-edit span').forEach(s => {
    s.onclick = () => {
      notaSelecionada = Number(s.dataset.valor)
      marcarEstrelas()
    }
  })

  // Botão salvar
  document.getElementById('salvarEditBtn').onclick = salvarEdicao

  // Botão fechar
  document.getElementById('fecharEditarAvaliacao').onclick = fecharModal

  // Mostrar modal
  document.getElementById('modalEditarAvaliacao').classList.remove('hidden')
}

// Função para salvar
async function salvarEdicao() {

  const descricao = quillEdit.root.innerHTML.trim()

  const { error } = await supabase
    .from('avaliacoes')
    .update({
      nota: notaSelecionada,
      descricao: descricao,
      data: new Date()
    })
    .eq('id', avaliacaoId)

  if (error) {
    console.error(error)
    return toast('Erro ao salvar edição.')
  }

  toast('Avaliação atualizada.')

  fecharModal()

  // Recarregar avaliações no perfil
  if (typeof window.carregarAvaliacoes === 'function') {
    window.carregarAvaliacoes()
  }
}

// Funções auxiliares de estrelas
function marcarEstrelas() {
  document.querySelectorAll('#estrelas-edit span').forEach(s => {
    const val = Number(s.dataset.valor)
    s.classList.toggle('text-yellow-400', val <= notaSelecionada)
    s.classList.toggle('text-gray-300', val > notaSelecionada)
  })
}

function limparEstrelas() {
  document.querySelectorAll('#estrelas-edit span').forEach(s => {
    s.classList.remove('text-yellow-400')
    s.classList.add('text-gray-300')
  })
}

// Fechar modal
function fecharModal() {
  document.getElementById('modalEditarAvaliacao').classList.add('hidden')
  avaliacaoId = null
  notaSelecionada = 0
}
