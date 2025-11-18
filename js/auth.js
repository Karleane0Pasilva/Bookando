import { supabase } from './supabase.js'

// CADASTRO
export async function handleCadastro(dados, msgElement) {
  msgElement.textContent = 'Cadastrando...'

  // VERIFICA SE O E-MAIL JÁ EXISTE
  const { data: existente } = await supabase
    .from('usuarios')
    .select('email')
    .eq('email', dados.email)
    .single()

  if (existente) {
    msgElement.textContent = '❌ Este e-mail já está cadastrado.'
    return
  }

  // INSERE NOVO USUÁRIO
  const { error } = await supabase.from('usuarios').insert([{
    nome: dados.nome,
    email: dados.email,
    senha: dados.senha
  }])

  if (error) {
    console.error('Erro no cadastro:', error)
    msgElement.textContent = '❌ Erro ao cadastrar. Veja o console.'
  } else {
    msgElement.textContent = '✅ Cadastro realizado com sucesso!'
    setTimeout(() => {
      window.location.href = 'login.html'
    }, 2000)
  }
}

// LOGIN
export async function handleLogin(dados, msgElement) {
  msgElement.textContent = 'Verificando...'

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', dados.email)
    .eq('senha', dados.senha)
    .single()

  if (error || !usuario) {
    msgElement.textContent = '❌ E-mail ou senha incorretos.'
    console.warn('Erro no login:', error)
    return
  }

  // SALVA USUÁRIO LOCALMENTE
  localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
  msgElement.textContent = '✅ Login realizado com sucesso!'

  setTimeout(() => {
    window.location.href = 'index.html'
  }, 2000)
}

// LOGOUT
export function handleLogout() {
  localStorage.removeItem('usuarioLogado')
  window.location.href = 'login.html'
}
