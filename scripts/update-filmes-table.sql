-- Adicionar coluna para URL da capa dos filmes
ALTER TABLE filmes ADD COLUMN IF NOT EXISTS capa_url TEXT;

-- Atualizar alguns filmes com URLs de exemplo (opcional)
UPDATE filmes SET capa_url = 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' WHERE titulo = 'Interestelar';
UPDATE filmes SET capa_url = 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' WHERE titulo = 'Pulp Fiction';
UPDATE filmes SET capa_url = 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' WHERE titulo = 'Parasita';
