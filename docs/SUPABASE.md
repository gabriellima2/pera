# Supabase no Pera

O schema do banco (tabelas, RLS, funções RPC e trigger de cadastro) fica versionado em `supabase/migrations/`. Os dados iniciais de situações ficam em `supabase/seed.sql`.

## Rodar o backend localmente

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) em execução e [Supabase CLI](https://supabase.com/docs/guides/cli) (por exemplo via `npx supabase`).

Na raiz do repositório:

```bash
npx supabase start
```

Na primeira subida, as migrações e o seed são aplicados automaticamente. Para recriar o banco do zero a qualquer momento:

```bash
npx supabase db reset
```

Variáveis para o app (copie `.env.example` para `.env` ou `.env.local`):

```bash
cp .env.example .env
```

Conferir URL e chave publicável após subir os containers:

```bash
npx supabase status
```

Copie o valor **Publishable** de `npx supabase status` para `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (não use a chave do projeto na nuvem).

Escolha `EXPO_PUBLIC_SUPABASE_URL` conforme o dispositivo (porta `54321`); o arquivo `.env.example` traz exemplos comentados:

- **Mesma máquina / iOS Simulator:** `http://127.0.0.1:54321`
- **Emulador Android:** `http://10.0.2.2:54321` (`127.0.0.1` no emulador não aponta para o Docker no PC)
- **Celular físico na Wi‑Fi:** `http://<IP-da-máquina>:54321`

Auth local: confirmação de e-mail desligada em `supabase/config.toml` (`enable_confirmations = false`). E-mails de teste aparecem no [Mailpit](http://127.0.0.1:54324) (`npx supabase status` mostra a URL).

Studio local: `npx supabase status` (porta 54323).

Parar os containers:

```bash
npx supabase stop
```

## Versionar o schema (mantenedor)

Use isto quando alterar o banco no Dashboard ou quiser trazer o remoto para o Git.

### 1. Login e link (uma vez por máquina)

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

O `project-ref` é o subdomínio do projeto (ex.: `https://<project-ref>.supabase.co`).

### 2. Gerar a migração baseline a partir do remoto (feito uma vez)

Quando o remoto já é a fonte da verdade e o repo ainda não tinha o schema completo:

```bash
npx supabase db dump --remote --schema public -f supabase/.schema_dump.sql
```

Ajuste o SQL (remova owners/privileges desnecessários se quiser) e inclua o trigger em `auth.users`:

```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user();
```

Salve em `supabase/migrations/<timestamp>_initial_schema.sql`.

### 3. Seed das situações

```bash
npx supabase db dump --remote --data-only --schema public
```

Extraia só os `INSERT` da tabela `situations` para `supabase/seed.sql`. Não versione dados de usuários ou registros pessoais.

### 4. Novas alterações (fluxo contínuo)

```bash
npx supabase migration new descricao_da_mudanca
# edite o arquivo em supabase/migrations/
npx supabase db reset    # valida localmente
npx supabase db push --remote   # aplica só migrações novas na nuvem
```

Evite `db push` de um baseline inteiro em um projeto que já tem o schema; use apenas para migrações incrementais depois do baseline.

### 5. Conflito de histórico (`db pull`)

Se o remoto registrou uma migração antiga com conteúdo diferente do arquivo local, o CLI pode acusar divergência. Ambientes novos usam `db reset` local. Na produção, alinhe com a [documentação de repair](https://supabase.com/docs/guides/cli/managing-environments) só se souber exatamente qual versão já foi aplicada.

## Conteúdo do baseline

- Tabelas: `auth_users`, `daily_entries`, `moment_entries`, `situations`
- RPC: `create_daily_entry`, `create_moment_entry`, `edit_moment_entry`
- Trigger: `on_auth_user_created` em `auth.users`
- RLS: acesso apenas aos próprios registros; `situations` somente leitura para autenticados
