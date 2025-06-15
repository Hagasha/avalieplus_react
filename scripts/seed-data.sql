-- Inserir usuários de exemplo
INSERT INTO usuarios (nome, email) VALUES
('João Silva', 'joao@email.com'),
('Maria Santos', 'maria@email.com'),
('Pedro Oliveira', 'pedro@email.com')
ON CONFLICT (email) DO NOTHING;

-- Inserir filmes de exemplo
INSERT INTO filmes (titulo, diretor, ano_lancamento, genero, sinopse) VALUES
('Interestelar', 'Christopher Nolan', '2014', 'Ficção Científica', 'Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.'),
('Pulp Fiction', 'Quentin Tarantino', '1994', 'Crime', 'As vidas de dois assassinos da máfia, um boxeador, um gângster e sua esposa, e um par de bandidos se entrelaçam em quatro histórias de violência e redenção.'),
('Parasita', 'Bong Joon-ho', '2019', 'Drama', 'A família Kim, pobre e desempregada, desenvolve interesse pela rica família Park, até que se envolvem em um incidente inesperado.'),
('O Poderoso Chefão', 'Francis Ford Coppola', '1972', 'Crime', 'A saga da família Corleone e sua ascensão no mundo do crime organizado.'),
('Cidade de Deus', 'Fernando Meirelles', '2002', 'Drama', 'A história de crianças e adolescentes de uma favela carioca que crescem em meio à violência.'),
('Matrix', 'Lana e Lilly Wachowski', '1999', 'Ficção Científica', 'Um programador descobre que a realidade como ele conhece é uma simulação computacional.')
ON CONFLICT DO NOTHING;

-- Inserir avaliações de exemplo
INSERT INTO avaliacoes (filme_id, usuario_id, nota, comentario) VALUES
(1, 1, 5, 'Um dos melhores filmes de ficção científica que já assisti!'),
(2, 2, 4, 'Clássico do cinema, diálogos brilhantes.'),
(3, 3, 5, 'Obra-prima do cinema coreano, merece todos os prêmios que recebeu.')
ON CONFLICT DO NOTHING;

-- Inserir itens na watchlist de exemplo
INSERT INTO watchlist (filme_id, usuario_id, status, prioridade, notas) VALUES
(1, 1, 'Para Assistir', 'Alta', 'Recomendado por amigos'),
(4, 2, 'Assistindo', 'Média', 'Clássico que preciso ver'),
(3, 3, 'Assistido', 'Alta', 'Filme incrível, superou expectativas')
ON CONFLICT (filme_id, usuario_id) DO NOTHING;
