import { supabase } from './supabase.js'

export async function iniciarInfoLivro(id) {

  const modal = document.getElementById('modalInfoLivro')

  // FECHAR (apenas o X)
  const fechar = document.getElementById('fecharInfoLivro')
  if (fechar) {
    fechar.addEventListener('click', () => modal.classList.add('hidden'))
  }

  // BOTÃO AVALIAR
  const avaliar = document.getElementById('btnAvaliarLivro')
  if (avaliar) {
    avaliar.addEventListener('click', () => {
      window.location.href = 'perfil.html'
    })
  }

  // BUSCAR DADOS DO LIVRO
  const { data, error } = await supabase
    .from('livros')
    .select('id, titulo, autor, capa, editora, lancamento, resumo')
    .eq('id', id)
    .single()

  if (error || !data) return

  // Preencher dados
  document.getElementById('infoTitulo').textContent = data.titulo || ''
  document.getElementById('infoAutor').textContent = data.autor || ''
  document.getElementById('infoEditora').textContent = data.editora || '-'
  document.getElementById('infoLancamento').textContent =
    data.lancamento ? new Date(data.lancamento).toLocaleDateString('pt-BR') : '-'
  document.getElementById('infoResumo').innerHTML = data.resumo || 'Sem resumo.'

  // Capa
  const capa = document.getElementById('infoCapa')
  const placeholder = document.getElementById('infoCapaPlaceholder')

  if (data.capa) {
    capa.src = data.capa
    capa.classList.remove('hidden')
    placeholder.classList.add('hidden')
  }
}
