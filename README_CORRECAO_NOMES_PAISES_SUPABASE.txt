CORREÇÃO DE NOMES DE PAÍSES E FILTRO DE CLUBES

Alterações realizadas:
1. A lista de países exibida no site agora é montada a partir da tabela public.paises do Supabase.
2. Os clubes continuam vinculados pelo pais_id, evitando depender apenas do texto do nome do país.
3. Foram adicionadas equivalências para nomes diferentes, incluindo:
   - Bielorrússia / Belarus
   - Holanda / Países Baixos
   - Tchéquia / República Tcheca
   - Moldova / Moldávia
4. O filtro da página Clubes compara nomes canônicos, ignorando essas variações.
5. A lista fixa mundial só é usada quando os países do Supabase ainda não estiverem disponíveis.

IMPORTANTE:
Clubes que foram inseridos com pais_id errado precisam ser corrigidos no banco.
Esta atualização corrige o código de exibição e filtro, mas não altera automaticamente os registros SQL já gravados com IDs incorretos.
