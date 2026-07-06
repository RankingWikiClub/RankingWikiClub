FutPédia - cadastro de competições corrigido com alternância Clube/Seleção e tipos específicos.


## Configuração do login Supabase

1. No Supabase, acesse **Project Settings > API**.
2. Copie a **Project URL** e a **anon public key**.
3. Abra o arquivo `js/auth.js` e substitua:
   - `https://uypihtlcwgqkciyrzjkb.supabase.co`
   - `sb_publishable_U2pudVBg3h6Yb-OjS3ALKQ_bNVAPJgV`
4. No Supabase, confirme que existe a tabela `perfis` e que seu usuário está com `perfil = 'admin'`.
5. Abra `login.html` e entre com o e-mail e senha criados no Supabase.

Permissões:
- Visitante: visualiza páginas públicas.
- Editor: acessa Inserir e Edições, mas não vê botões de excluir.
- Admin: acesso total.


## Configuração do Supabase

A conexão com o Supabase agora está centralizada em:

```text
js/supabase.js
```

Se precisar trocar a URL ou a Publishable Key no futuro, altere somente esse arquivo.

Essa reorganização não apaga nem altera os dados já cadastrados no banco de dados do Supabase.
