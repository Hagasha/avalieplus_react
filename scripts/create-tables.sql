-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de filmes
CREATE TABLE IF NOT EXISTS filmes (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  diretor VARCHAR(255) NOT NULL,
  ano_lancamento VARCHAR(4) NOT NULL,
  genero VARCHAR(100) NOT NULL,
  sinopse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id SERIAL PRIMARY KEY,
  filme_id INTEGER REFERENCES filmes(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de watchlist
CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  filme_id INTEGER REFERENCES filmes(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('Para Assistir', 'Assistindo', 'Assistido')) DEFAULT 'Para Assistir',
  prioridade VARCHAR(10) CHECK (prioridade IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
  notas TEXT,
  data_adicionado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_assistido TIMESTAMP,
  UNIQUE(filme_id, usuario_id)
);
