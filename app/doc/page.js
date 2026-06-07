const folders = [
  {
    name: "e2e/",
    color: "bg-brand-500",
    title: "Las pruebas (los guiones paso a paso)",
    description:
      "Aquí vive cada prueba: una receta que el robot sigue, como 'entra al login, escribe el correo y la contraseña, y revisa que aparezca tu cuenta'. Están agrupadas por tema (auth, cart, checkout...) para encontrarlas fácil.",
  },
  {
    name: "pages/",
    color: "bg-cta-500",
    title: "El mapa de cada pantalla",
    description:
      "Por cada pantalla de la app guardamos un 'mapa': dónde está el campo de correo, el botón de 'Log in', el mensaje de error... Si la pantalla cambia de diseño, se actualiza ese mapa una sola vez — no cada prueba que lo usa.",
  },
  {
    name: "data/",
    color: "bg-emerald-500",
    title: "Los datos de prueba (los “personajes”)",
    description:
      "Aquí guardamos información predecible: el usuario estándar, su correo, su contraseña, productos de ejemplo, cupones... Las pruebas piden estos datos prestados en vez de escribirlos a mano cada vez.",
  },
  {
    name: "fixtures/",
    color: "bg-violet-500",
    title: "La preparación del escenario",
    description:
      "Antes de que empiece una prueba, a veces hace falta dejar todo listo — por ejemplo 'ya inicié sesión por ti' o 'ya puse un producto en el carrito'. Eso ahorra repetir esos pasos en cada prueba.",
  },
  {
    name: "support/",
    color: "bg-amber-500",
    title: "La configuración segura",
    description:
      "Aquí centralizamos cómo se leen datos sensibles (como contraseñas) desde un lugar protegido fuera del código — variables de entorno — en vez de escribirlos directamente donde cualquiera los vería.",
  },
  {
    name: "utils/",
    color: "bg-sky-500",
    title: "Herramientas reutilizables",
    description:
      "Pequeñas funciones de apoyo que varias pruebas necesitan, como 'toma una captura de pantalla y guárdala con un nombre claro'. Se escriben una vez y se usan donde haga falta.",
  },
  {
    name: ".auth/",
    color: "bg-rose-500",
    title: "Sesiones guardadas",
    description:
      "La primera vez que una prueba inicia sesión, Playwright guarda esa sesión aquí — como cuando un sitio 'recuerda' que ya entraste. Las siguientes pruebas reutilizan esa sesión sin perder tiempo logueándose otra vez.",
  },
  {
    name: "evidence/",
    color: "bg-zinc-500",
    title: "Las pruebas de que todo funcionó",
    description:
      "Cada vez que corre una prueba, aquí se guardan automáticamente capturas de pantalla y datos del resultado (como el número de orden) — una bitácora visual de qué pasó y cuándo.",
  },
];

const loginFlowSteps = [
  {
    step: "1",
    title: "La prueba pide iniciar sesión",
    detail:
      "El archivo dentro de e2e/auth/ describe, en lenguaje sencillo, lo que se quiere comprobar: 'inicia sesión como el usuario estándar y verifica que aparezca su cuenta'.",
  },
  {
    step: "2",
    title: "Pide prestados los datos",
    detail:
      "En vez de escribir el correo y la contraseña directamente, los toma de data/users.js — el directorio de “personajes” de prueba.",
  },
  {
    step: "3",
    title: "Sigue el mapa de la pantalla",
    detail:
      "Usa pages/LoginPage.js para saber exactamente dónde está el campo de correo, el de contraseña y el botón de enviar — y actúa ahí.",
  },
  {
    step: "4",
    title: "Puede saltarse el login si ya hay una sesión guardada",
    detail:
      "fixtures/index.js revisa si ya existe una sesión en .auth/ y la reutiliza — como cuando un sitio 'te recuerda' y ya no pide tu contraseña otra vez.",
  },
  {
    step: "5",
    title: "La contraseña viene de un lugar seguro",
    detail:
      "support/env.js se asegura de que esa contraseña no quede escrita directamente en el código — viene de configuración protegida.",
  },
  {
    step: "6",
    title: "Se guarda evidencia del resultado",
    detail: "utils/evidence.js toma una captura de pantalla y la guarda en evidence/ — la prueba visual de qué pasó.",
  },
];

export const metadata = {
  title: "Cómo funciona nuestra suite de pruebas — MiniCommerce QA Lab",
};

export default function TestSuiteDocPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Cómo funciona nuestra suite de pruebas</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-600">
          Esta página explica, sin tecnicismos, cómo está organizada la carpeta <code>tests/</code> de este proyecto y
          por qué la armamos así. La idea es que puedas explicárselo a alguien más — o llevar la misma idea a otro
          proyecto — sin necesitar saber programar.
        </p>
      </div>

      <section aria-labelledby="map-heading" className="flex flex-col gap-4">
        <h2 id="map-heading" className="text-lg font-semibold text-zinc-900">
          El mapa de la carpeta tests/
        </h2>
        <p className="max-w-3xl text-sm text-zinc-600">
          Piensa en esta carpeta como una pequeña fábrica de pruebas: cada subcarpeta tiene un trabajo específico,
          para que nada quede mezclado ni se repita.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid="doc-folder-grid">
          {folders.map((folder) => (
            <div key={folder.name} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-4">
              <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${folder.color}`} aria-hidden="true" />
              <div>
                <p className="font-mono text-sm font-semibold text-zinc-900">{folder.name}</p>
                <p className="text-sm font-medium text-zinc-800">{folder.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{folder.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="flow-heading" className="flex flex-col gap-4">
        <h2 id="flow-heading" className="text-lg font-semibold text-zinc-900">
          Un ejemplo real: así se conecta todo al probar &ldquo;iniciar sesión&rdquo;
        </h2>
        <p className="max-w-3xl text-sm text-zinc-600">
          Ninguna pieza trabaja sola — se apoyan unas en otras. Así se ve el recorrido completo de una sola prueba:
        </p>
        <ol className="flex flex-col gap-3" data-testid="doc-flow-steps">
          {loginFlowSteps.map((item) => (
            <li key={item.step} className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {item.step}
              </span>
              <div>
                <p className="font-medium text-zinc-900">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="why-heading" className="flex flex-col gap-4">
        <h2 id="why-heading" className="text-lg font-semibold text-zinc-900">
          ¿Por qué no poner todo junto en un solo archivo?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="font-medium text-zinc-900">Sin esta organización</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600">
              <li>Cada prueba repite el mismo correo y contraseña escritos a mano.</li>
              <li>Si la pantalla de login cambia un botón, hay que corregir muchas pruebas, una por una.</li>
              <li>Las contraseñas quedan visibles directamente en el código.</li>
              <li>Nadie sabe si una prueba pasó o falló sin volver a correrla para verla.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="font-medium text-zinc-900">Con esta organización</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600">
              <li>
                Los datos viven en un solo lugar (<code>data/</code>) y todas las pruebas los piden prestados.
              </li>
              <li>
                Si la pantalla cambia, se actualiza un solo &ldquo;mapa&rdquo; (<code>pages/</code>) y todo sigue
                funcionando.
              </li>
              <li>
                Las contraseñas se leen de configuración protegida (<code>support/</code>), nunca del código.
              </li>
              <li>
                Cada corrida deja evidencia (<code>evidence/</code>): capturas y datos de lo que pasó.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="portable-heading"
        className="flex flex-col gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4"
      >
        <h2 id="portable-heading" className="text-lg font-semibold text-zinc-900">
          ¿Cómo llevarías esto a otro proyecto?
        </h2>
        <p className="max-w-3xl text-sm text-zinc-700">
          El esqueleto de carpetas (<code>e2e</code>, <code>pages</code>, <code>data</code>, <code>fixtures</code>,{" "}
          <code>support</code>, <code>utils</code>, <code>evidence</code>) no depende de que sea una tienda en
          línea — funciona igual para cualquier sitio web. Lo único que cambia de un proyecto a otro es el
          contenido: otros &ldquo;mapas&rdquo; de pantalla, otros &ldquo;personajes&rdquo; de prueba, otras pruebas —
          pero la forma de organizarlo se mantiene igual.
        </p>
      </section>
    </div>
  );
}
