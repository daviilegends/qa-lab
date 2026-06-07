# PW-GUIDE — Playwright Testing Playbook

Guía viva del proceso de automatización con Playwright para MiniCommerce QA Lab.
Objetivo: que este documento sirva de receta reusable para automatizar otro proyecto
con Playwright + GitHub Copilot, sin perder el hilo de "qué pedir y en qué orden".

> Regla: cada vez que cambiemos algo del setup, la estructura o la forma de pedirle
> cosas a Copilot, este archivo se actualiza en el mismo paso. No dejarlo desactualizado.

---

## 0. Day 1 Onboarding — checklist para empezar en cualquier proyecto nuevo

Esta sección es la receta para "llego el día 1, ¿qué reviso y en qué orden?" —
pensada para copiar/pegar en el próximo proyecto que automatices, sea cual sea
el stack.

### 0.1 Herramientas a verificar (y cómo)

| Herramienta | Por qué importa | Verificar con |
|---|---|---|
| Node.js (LTS) | Playwright corre sobre Node; versiones viejas rompen instalación/runtime | `node -v` |
| npm | Instala/corre dependencias y scripts del proyecto | `npm -v` |
| Git | Control de versiones, branches, PRs | `git --version` |
| VS Code | IDE — se integra directo con Playwright vía extensión | `code --version` |
| GitHub CLI (`gh`) | Acelera auth, creación de PRs/issues desde terminal | `gh --version` |
| GitHub Copilot / Copilot Chat | Asistente IA para generar/revisar tests | Extensions panel de VS Code |
| Playwright | El framework/test runner en sí | `npx playwright --version` |
| Browsers (Chromium/Firefox/WebKit) | Playwright los gestiona él mismo, no son del SO | `npx playwright install --dry-run` |

Errores comunes:
- `node -v` < 18 → puede fallar la instalación de Playwright; usar `nvm`/`nvm-windows` para cambiar versión.
- `npx playwright test` falla con "browserType.launch: Executable doesn't exist" → falta correr `npx playwright install`.
- `code` no reconocido en terminal → falta agregarlo al PATH (Command Palette → "Shell Command: Install 'code' command in PATH").

### 0.2 Configurar VS Code para Playwright

1. Abrir el proyecto: `code .`
2. Instalar la extensión **Playwright Test for VS Code** → agrega un Test Explorer
   (ícono de matraz) con cada spec/test, botón de correr/depurar, "Pick locator"
   (señalas un elemento en el navegador y te genera el locator).
3. `.vscode/settings.json` recomendado:
```json
{
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true,
  "editor.formatOnSave": true
}
```
4. `.vscode/launch.json` para depurar con breakpoints:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Playwright test",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": ["test", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

Error común: Test Explorer dice "No tests found" → el `testDir` del config no
coincide con la ubicación real de los specs, o el patrón de archivos no es `*.spec.js`.

### 0.3 Extensiones recomendadas de VS Code

| Extensión | Para qué |
|---|---|
| Playwright Test for VS Code (`ms-playwright.playwright`) | Test Explorer, locator picker, trace viewer — la esencial |
| GitHub Copilot + Copilot Chat | Generar specs/POMs, explicar fallos, sugerir locators |
| ESLint | Atrapa problemas antes del commit |
| GitLens | Blame/historia inline — útil cuando un test empieza a fallar |
| Error Lens | Muestra errores de lint inline, no solo en el panel Problems |
| Tailwind CSS IntelliSense | Si el proyecto usa Tailwind (este lo usa) |

Verificar instaladas: `code --list-extensions`

### 0.4 GitHub: setup y clonado

```bash
gh auth login                  # interactivo: GitHub.com → HTTPS/SSH → login por navegador
gh auth status                 # debe mostrar "Logged in to github.com as <user>"
git clone <repo-url>
cd <carpeta-del-repo>
npm install
git remote -v                  # confirma que origin apunta al repo correcto
```

Errores comunes:
- `git clone` pide password repetidamente → GitHub ya no acepta password de cuenta
  por HTTPS; usar un Personal Access Token o dejar que `gh auth login` configure
  el credential helper.
- `npm install` con conflictos de peer-deps → no usar `--legacy-peer-deps` como
  primera salida; reportarlo al equipo, normalmente indica un mismatch real de versiones.

### 0.5 Verificación de Node + Playwright (post-clone)

```bash
node -v && npm -v
npx playwright --version
npx playwright install              # descarga/actualiza binarios de navegadores
npx playwright test --list          # lista los tests SIN correrlos
```

`--list` debe mostrar el árbol de `describe`/tests sin abrir navegador — confirma
que el config carga y los specs se descubren bien. Si devuelve 0 tests, revisar
`testDir` en `playwright.config.js` o el patrón de nombres de archivo.

### 0.6 Estrategia de variables de entorno

Nunca hardcodear URLs ni credenciales. Este proyecto ya lo resuelve así en
`playwright.config.js`:

```js
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
```

Uso por entorno:
```bash
# bash/zsh
BASE_URL=https://qa.example.com npx playwright test

# PowerShell
$env:BASE_URL = "https://qa.example.com"; npx playwright test
```

Recomendaciones para formalizarlo:
- Scripts npm por entorno (`test:dev`, `test:qa`, `test:staging`).
- Credenciales fuera del config — `.env` ignorado por git + `.env.example` documentando
  qué variables se esperan, sin valores reales.
- Nunca poner lógica `if (env === "qa")` dentro de los specs — acopla tests al entorno.

### 0.7 Información a pedir al equipo antes del primer test

- URLs de cada entorno (DEV/QA/STAGING/PROD) y quién las administra.
- Usuarios/datos de prueba ya existentes — no inventar (en este repo: `data/users.js`).
- Qué define un test como "terminado" (¿debe correr en CI? ¿en qué browsers? ¿con qué tag?).
- Qué flujos son críticos → eso define el set `@smoke`.
- Estándares de código/lint/PR existentes.
- Cómo y dónde corre el pipeline de CI, quién es notificado en fallos.
- Cómo se reportan bugs encontrados por automatización (Jira/Linear/GitHub Issues, qué info esperan).

### 0.8 Riesgos y errores comunes de QA automation engineers nuevos

- Selectores frágiles (`nth-child`, clases CSS generadas).
- Esperas fijas (`page.waitForTimeout`) en vez de auto-wait de Playwright.
- URLs/credenciales hardcodeadas.
- Tests dependientes del orden de ejecución (uno deja estado para el siguiente).
- Aserciones sobre datos que cambian (precios/fechas reales) en vez de datos mock controlados.
- Ignorar warnings ("strict mode violation" hoy = suite flaky mañana).
- No leer los artefactos de fallo (trace, screenshots, `error-context.md`) antes de adivinar.
- Commitear secretos, incluso "dummies" que siguen patrones de datos reales.

### 0.9 Checklist Day 1

- [ ] Verificar versiones de Node/npm/Git/VS Code/`gh`
- [ ] Instalar extensiones: Playwright Test, Copilot, Copilot Chat, ESLint, GitLens, Error Lens
- [ ] `gh auth login` + clonar repo
- [ ] `npm install`, `npx playwright install`, `npx playwright test --list`
- [ ] Confirmar estrategia de `BASE_URL` por entorno
- [ ] Leer `tests/pages/`, `tests/e2e/`, `tests/fixtures/` para entender convenciones POM existentes
- [ ] Confirmar estrategia de branches y dónde va el primer PR
- [ ] Correr la suite completa una vez y abrir el reporte HTML
- [ ] Correr solo `@smoke` y confirmar que es rápida y verde
- [ ] Reunir la info de la sección 0.7
- [ ] Escribir UN spec trivial end-to-end (ej. "la página tiene el heading correcto"), correrlo, verlo en el reporte — confirma que todo el toolchain funciona antes de atacar flujos reales

---

## 1. ¿Se puede hacer con Copilot?

Sí. Copilot (o Claude/Copilot Chat dentro del editor) funciona muy bien para:
- Generar Page Objects a partir de una página ya construida.
- Generar specs de Playwright a partir de un flujo descrito en lenguaje natural.
- Sugerir locators estables (role/label/testid) cuando le das el HTML/JSX de la página.
- Revisar specs existentes y detectar selectores frágiles.

Lo que **no** debe hacer por sí solo: decidir la arquitectura de carpetas, los datos
mock o las reglas de negocio — eso lo definimos nosotros (sección 3 y 4) y se lo
damos como contexto.

### 1.1 ¿Copilot ya tiene el contexto de `CLAUDE.md` y este `PW-GUIDE.md`?

**No automáticamente.** `CLAUDE.md` es una convención propia de Claude Code (lo
carga solo). Copilot Chat tiene su propio mecanismo equivalente:

- **`.github/copilot-instructions.md`** — si existe en el repo y está activado el
  setting `github.copilot.chat.codeGeneration.useInstructionFiles`, Copilot lo
  incluye automáticamente en cada chat, sin que tengas que adjuntarlo.
- Alternativa manual: referenciar archivos puntuales en el prompt con `#file:CLAUDE.md`
  o `#file:PW-GUIDE.md` — funciona, pero hay que repetirlo cada vez.

**2026-06-07** — Creamos `.github/copilot-instructions.md`. Decisión clave: lo
hicimos **autocontenido** (no referencia a `CLAUDE.md`/`PW-GUIDE.md`), porque la
idea es reusar este archivo en otros proyectos que no tendrán esos documentos.
Incluye en forma resumida: enfoque caja negra, estructura POM, prioridad de
locators (con ejemplos reales de colisiones que ya nos pasaron), naming/tags y
la regla de no hardcodear URLs. Es el "kit portable" de convenciones de testing;
`CLAUDE.md`/`PW-GUIDE.md` siguen siendo la fuente de verdad *de este proyecto*
(reglas de negocio, UX, alcance), pero lo que Copilot necesita para escribir
tests ya vive también en `.github/copilot-instructions.md`.

Con esto, cuando le pidas a Copilot algo como *"crea un test de login con estos
locators"*, ya entra alineado con nuestras convenciones — tú sigues aportando los
locators (los datos de la página real, que él no puede inventar) y la estrategia;
Copilot aporta la velocidad de escritura del código siguiendo el formato acordado.

---

## 2. Setup inicial (qué instalar y pedir)

Comandos base (uno por línea, con su propósito):

```bash
npm init playwright@latest      # instala Playwright, crea config y carpeta de ejemplo
npx playwright install          # descarga los navegadores (chromium/firefox/webkit)
npx playwright test             # corre la suite completa
npx playwright show-report      # abre el último reporte HTML
```

Prompt inicial recomendado para Copilot (adaptar el nombre del proyecto):

> "Configura Playwright para un proyecto Next.js/React llamado [nombre]. Usa
> JavaScript, testDir `tests/e2e`, reporter HTML, un proyecto chromium, y un
> webServer que levante `npm run dev` contra `http://localhost:3000`. Permite
> sobreescribir la base URL con la variable de entorno `BASE_URL`."

### Config de referencia (este proyecto: `playwright.config.js`)

```js
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
```

Puntos clave a pedir siempre:
- `baseURL` configurable por variable de entorno (nunca hardcodeada) → ver sección 6.
- `trace: "on-first-retry"` para depurar fallos sin pagar el costo en cada corrida.
- `webServer` para que Playwright levante la app solo si no hay una corriendo.

---

## 2.1 Reinicio: reconstruyendo la suite en modo "caja negra" (black-box)

**2026-06-07** — Archivamos la primera suite (24 tests, 5 specs, 6 page objects)
en `tests-legacy-poc/` (con su propio README explicando por qué). Esa suite se
escribió **con acceso al código fuente** (white-box) y cumplió su propósito:
demostrar que los flujos de la app funcionan de punta a punta.

A partir de ahora reconstruimos `tests/` **desde cero, en modo caja negra**:
simulamos no tener acceso al código — solo al sitio corriendo — tal como
llegaríamos a un proyecto real de QA donde no escribimos la app. Esto fuerza
a practicar la habilidad real del rol: **descubrir** locators y flujos
inspeccionando la UI renderizada, no leyendo el JSX.

### Proceso paso a paso (a seguir en cada flujo nuevo)

1. **Explorar el flujo manualmente en el navegador** — anotar qué pasos sigue
   un usuario real, qué estados visibles existen (loading, error, vacío, éxito).
2. **Inspeccionar elementos con las DevTools / "Pick locator" de la extensión
   de Playwright** — identificar el locator más estable disponible, en este
   orden de preferencia: rol accesible (`getByRole`) → label (`getByLabel`) →
   texto visible (`getByText`) → placeholder → `data-testid` (si existe en el
   HTML renderizado — lo tratamos como dato observable, no como "trampa" de
   leer el código).
3. **Anotar los locators candidatos** antes de escribir el Page Object —
   evita construir sobre un selector que en realidad matchea 2 elementos.
4. **Crear el Page Object** con esos locators + métodos que describan acciones
   de usuario (sin asserts).
5. **Escribir el/los test(s)** sobre ese Page Object — casos felices primero,
   luego negativos/edge cases.
6. **Correr y validar** (`npx playwright test -g "..."`) — si hay
   "strict mode violation", volver al paso 2 y refinar el locator (escopear al
   contenedor correcto, o cambiar de estrategia).
7. **Etiquetar** el test (`@smoke`/`@regression`/`@negative` + dominio) y
   actualizar este archivo si aprendimos algo reusable (sección "Historial de
   decisiones").

### Carpeta legacy

```
tests-legacy-poc/   # suite original (white-box) — solo de referencia, no corre
tests/              # suite nueva (black-box) — la activa, vacía por ahora
```

---

## 3. Estructura de carpetas (Page Object Model, escalable por dominio)

**2026-06-07** — Reemplazamos la estructura plana por una agrupada por dominio
de negocio (auth, catalog, cart, checkout, account...), pensada para que un
e-commerce con muchos flujos no termine siendo un montón de archivos sueltos.
La versión completa y autocontenida vive en `.github/copilot-instructions.md`
(es la que portamos a otros proyectos); aquí dejamos el resumen + el porqué.

```
tests/
├── e2e/<dominio>/*.spec.js   # specs agrupados: auth/, catalog/, cart/,
│                             # checkout/, account/, order-confirmation/
├── pages/                    # Page Objects (mismos dominios) +
│                             # pages/components/ para modales/widgets reusados
├── data/                     # mock data estática y predecible (objetos planos)
├── fixtures/                 # fixtures de Playwright (test.extend) — sesiones
│                             # logueadas, carritos pre-armados, etc.
├── support/                  # infraestructura de test: env.js, globalSetup.js
└── utils/                    # funciones puras reusables: dates.js, money.js,
                              # assertions.js — sin acoplamiento a env/test
```

**Por qué separamos `data/` de `fixtures/`** — "fixture" en Playwright significa
algo específico: setup reusable que extiende `test` (ej. "dame una página ya
logueada como usuario suscrito"). Eso es distinto de los *datos mock* estáticos
(usuarios, productos, cupones como objetos planos). Separarlos evita que
`fixtures/` se vuelva un cajón de sastre — los fixtures hacen `import` de `data/`
y se componen limpiamente.

**Por qué separamos `support/` de `utils/`** — `support/` es *infraestructura*:
sabe de `process.env`, de `test`, de setup global. `utils/` es *lógica pura*:
funciones input → output (manejo de fechas, parseo de precios, asserts
compartidos) que no saben que corren dentro de un test. Esto las hace triviales
de probar por separado y seguras de reusar desde page objects, fixtures o specs
sin arrastrar acoplamiento a env. Pregunta para decidir dónde va algo: "¿necesita
saber que está en un test?" → `support/`; "¿solo transforma datos?" → `utils/`.

Prompt para generar un Page Object nuevo:

> "Crea un Page Object para [Página] siguiendo el patrón de `tests/pages/LoginPage.js`:
> locators por rol/label/testid en el constructor, métodos que describen acciones de
> usuario (no implementación), sin asserts dentro del page object."

### Convenciones del proyecto (mantenerlas al portar a otro proyecto)

- El **constructor** solo define locators (preferir `getByLabel`, `getByRole`,
  `getByTestId` — evitar `nth-child` y clases CSS).
- Los **métodos** describen comportamiento de usuario: `loginAs(email, password)`,
  `openProduct(name)`, `subscribeWithFrequency(months)` — no "clickButton1".
- Las **aserciones viven en el spec**, no en el page object.
- Si un locator puede chocar con otro elemento de la página (ej. un `<nav aria-label="...">`
  cuyo nombre accesible contiene la misma palabra que un `<label>`), usar
  `data-testid` en vez de `getByLabel`/`getByRole` para evitar violaciones de
  modo estricto (`strict mode violation: resolved to N elements`).
- Si una sección reutiliza el mismo componente en dos lugares de la página (ej.
  "Popular products" y "All products" ambos renderizan `ProductCard`), **escopear**
  el locator al contenedor correcto: `page.getByTestId("product-grid").getByTestId("product-card")`.

---

## 4. Datos de prueba (fixtures)

- Mantener los datos **predecibles y deterministas** — nada de `faker`/random.
- Un archivo por dominio: `testUsers.js`, y luego (a futuro) `testProducts.js`,
  `testAddresses.js`, etc., según lo vayamos necesitando.
- Los fixtures reflejan los "usuarios dummy" ya definidos en `data/users.js` del
  proyecto (standard, new, subscribed, blocked, saved-address, saved-payment...).

Prompt para generar/expandir fixtures:

> "Genera un fixture `testUsers.js` con un objeto por cada estado de usuario dummy
> definido en `data/users.js` (email, password, estado). No inventes usuarios nuevos:
> usa solo los que ya existen en la app."

---

## 5. Cómo correr los tests

```bash
npm run test:e2e             # toda la suite (headless)
npm run test:e2e:headed      # con navegador visible
npm run test:e2e:ui          # modo UI interactivo (recomendado para depurar)
npm run test:e2e:smoke       # solo @smoke
npm run test:e2e:report      # abrir el último reporte HTML
npx playwright test -g "texto del test"      # correr un test puntual por nombre
npx playwright test --debug                  # abrir el inspector paso a paso
```

Para investigar un fallo puntual:
1. `npx playwright test <archivo> -g "<nombre del test>"` para aislarlo.
2. Revisar `test-results/.../error-context.md` — incluye snapshot accesible de
   la página al momento del fallo (clave para detectar locators ambiguos).
3. `npx playwright show-report` para ver trazas, screenshots y video.

Limpieza tras una corrida de verificación manual:

```bash
rm -rf test-results playwright-report
```

---

## 6. Entornos (local / qa / staging)

- Nunca hardcodear URLs dentro de los specs ni en los page objects.
- Usar `BASE_URL` (ya soportado en `playwright.config.js`) y correr así:

```bash
BASE_URL=http://localhost:3000 npx playwright test           # local
BASE_URL=https://qa.example.com npx playwright test          # qa
BASE_URL=https://staging.example.com npx playwright test     # staging
```

(En PowerShell: `$env:BASE_URL = "https://qa.example.com"; npx playwright test`)

---

## 7. Categorías / tags de tests

Convención usada en este proyecto — etiquetar en el `test.describe`:

| Tag            | Uso                                              |
|----------------|--------------------------------------------------|
| `@smoke`       | Flujos críticos (login, PLP→PDP, add to cart...) |
| `@sanity`      | Cambios recientes                                |
| `@regression`  | Cobertura amplia de reglas de negocio            |
| `@negative`    | Casos de error / validaciones                    |
| `@auth` `@cart` `@checkout` `@promotions` `@subscriptions` | Por dominio/feature |

Ejemplo real (`auth.spec.js`):

```js
test.describe("Login @auth @smoke", () => { ... });
test.describe("Login @auth @negative", () => { ... });
```

Correr por tag: `npx playwright test --grep @smoke`

---

## 8. Prompt template para generar un nuevo spec

Usar esta plantilla y rellenar los corchetes — funciona bien tanto con Copilot
como con Claude:

> "Actúa como QA automation engineer senior. Crea tests de Playwright en JavaScript
> para [feature/flujo]. Usa el Page Object [Nombre] (créalo si no existe, siguiendo
> el patrón de `tests/pages/LoginPage.js`). Usa locators por rol/label/testid,
> datos del fixture `testUsers`/`[otro fixture]`, pasos legibles para QA y negocio,
> casos positivos, negativos y edge cases. Clasifica cada test como @smoke, @sanity
> o @regression y etiqueta el dominio (@cart, @checkout, etc). Evita selectores fragiles."

---

## 9. Checklist antes de dar por "hecho" un spec nuevo

- [ ] Corre en aislamiento (`-g "nombre"`) y en la suite completa sin flakiness.
- [ ] No usa `nth-child`, clases CSS generadas, ni textos que cambian (precios
      dinámicos, fechas relativas) salvo que estén controlados por datos mock.
- [ ] Los locators no chocan con otros elementos de la página (revisar
      `error-context.md` si hay "strict mode violation").
- [ ] Usa datos de los fixtures, no datos inventados al vuelo.
- [ ] El nombre del test describe la precondición + acción + resultado esperado.
- [ ] Está clasificado con el tag correcto (sección 7).

---

## 10. Historial de decisiones / aprendizajes

> Ir agregando entradas cortas con fecha cuando aprendamos algo reusable.

- **2026-06-06** — `getByLabel("X")` hace matching por substring, sin distinguir
  mayúsculas/minúsculas, contra el *accessible name*. Si la página tiene un `<nav
  aria-label="Shop by category">` y un `<select>` con `<label>Category</label>`,
  ambos matchean `getByLabel("Category")` → "strict mode violation". Solución:
  usar `data-testid` para el control de formulario cuando haya landmarks/regiones
  con nombres accesibles parecidos.
- **2026-06-06** — Cuando un componente (ej. `ProductCard`) se reutiliza en más
  de una sección de una página (catálogo "Popular" + "All products"), escopear
  siempre el locator de la lista al contenedor correcto (`product-grid`) para
  no contar/filtrar elementos de ambas secciones.
- **2026-06-07** — Añadimos a `.github/copilot-instructions.md` una regla de
  buena práctica: usar `dotenv` + `.env` (con `.env.example` versionado y
  `.env` en `.gitignore`) para cualquier base URL, credencial o token, en vez
  de hardcodearlos — incluso en proyectos dummy sin secretos reales. El
  objetivo es el hábito y la portabilidad entre entornos, no este proyecto en
  particular.
- **2026-06-07** — Definimos el patrón completo para no exponer datos sensibles
  ni hardcodear nada en los specs: `.env`/`.env.<entorno>` con los valores reales
  (ignorados en git, con `.env.example` versionado) → `support/env.js` como
  **único** punto que lee/valida `process.env` → `data/*.js` importa de ahí para
  rellenar campos sensibles (password, número de tarjeta) → los specs consumen
  `data/users.js` (`users.standard`), nunca un literal. Así un test nunca dice
  "usa el SKU X con la tarjeta 4111..."; siempre lee de datos centralizados.
  Pendiente: configurar `dotenv` real en `playwright.config.js` y crear
  `support/env.js` + `.env.example` cuando arranquemos la suite nueva (sección 6).

---

## 11. Próximos pasos / pendientes de documentar

- [ ] Agregar sección de CI (GitHub Actions) cuando se configure.
- [ ] Documentar fixtures de productos/direcciones/pagos cuando se creen.
- [ ] Agregar ejemplos de specs para checkout con suscripciones y cupones.
