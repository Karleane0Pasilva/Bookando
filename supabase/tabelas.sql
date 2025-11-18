-- Tabela de usuários
create table usuarios (
  id bigint generated always as identity primary key,
  nome text not null,
  email text unique not null,
  senha text not null
);

-- Tabela de livros
create table livros (
  id bigint generated always as identity primary key,
  titulo text not null,
  autor text,
  capa text,
  lancamento date,
  editora text
);

-- Tabela de avaliações
create table avaliacoes (
  id bigint generated always as identity primary key,
  usuario_id bigint references usuarios(id) on delete cascade,
  livro_id bigint references livros(id) on delete cascade,
  descricao text,
  nota int check (nota between 1 and 5),
  data timestamp default now(),
  unique (usuario_id, livro_id)
);

-- Tabela de solicitações
create table solicitacoes (
  id bigint generated always as identity primary key,
  usuario_id bigint references usuarios(id) on delete cascade,
  titulo_desejado text not null,
  autor_desejado text,
  mensagem text,
  data timestamp default now()
);


