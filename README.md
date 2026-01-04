
---


## Comandos útiles

* Arranca en segundo plano: Mongo + Node:

```bash
docker compose up -d
```

* Ver logs de todos los contenedores:

```bash
docker compose logs -f
```

* Ver contenedores en ejecución:

```bash
docker ps
```

* Detener todo:

```bash
docker compose down
```

* Detener y borrar volúmenes (para reiniciar la DB limpia):

```bash
docker compose down -v
```

---



## 1. ¿Qué es MongoDB?

MongoDB es una **base de datos NoSQL orientada a documentos**, ideal para aplicaciones web modernas que manejan **grandes volúmenes de datos no estructurados o semiestructurados**.

A diferencia de las bases de datos relacionales tradicionales (SQL), MongoDB **no impone un esquema fijo**, lo que permite una gran flexibilidad a la hora de diseñar y evolucionar la estructura de los datos.

---

## 2. ¿Cuándo usar MongoDB?

MongoDB es una excelente opción cuando tu proyecto necesita:

### 🔹 Escalabilidad

MongoDB permite **escalar horizontalmente** mediante **sharding**:

* Los datos se dividen entre múltiples servidores (nodos).
* Cada nodo almacena solo una parte de los datos.
* Ventajas:

  * Mejor rendimiento.
  * Capacidad para manejar grandes volúmenes de datos.
  * Distribución de la carga de trabajo.

### 🔹 Alta disponibilidad

MongoDB utiliza **Replica Sets**:

* Varias copias de la base de datos en distintos servidores.
* Si un nodo falla, otro toma el control automáticamente.
* No se pierde información ni se interrumpe la aplicación.

### 🔹 Flexibilidad

* Los documentos de una misma colección **pueden tener estructuras distintas**.
* Ideal para proyectos que evolucionan con el tiempo.

---

## 3. ¿Cuándo usar SQL?

Las bases de datos SQL suelen ser mejores cuando:

* La estructura de los datos **no cambia** con frecuencia.
* El crecimiento de datos es **moderado**.
* Se necesita **consistencia estricta** y relaciones complejas.

### Limitaciones habituales de SQL tradicionales:

* Escalabilidad horizontal limitada.
* Escala principalmente en **vertical** (mejorar hardware).
* Dependencia de un servidor principal.
* Alta disponibilidad más compleja y costosa.
* Menor flexibilidad ante cambios de esquema.

---

## 4. Enlaces oficiales de interés

* 📥 Instalación MongoDB:
  [https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/)
* 🖥 MongoDB Shell (mongosh):
  [https://www.mongodb.com/docs/mongodb-shell/install/](https://www.mongodb.com/docs/mongodb-shell/install/)
* 🔌 Conexión con mongosh:
  [https://www.mongodb.com/docs/mongodb-shell/connect/](https://www.mongodb.com/docs/mongodb-shell/connect/)
* 🧭 MongoDB Compass (GUI):
  [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
* 📚 CRUD MongoDB:
  [https://www.mongodb.com/docs/manual/crud/](https://www.mongodb.com/docs/manual/crud/)
* 📘 Documentación Shell:
  [https://www.mongodb.com/docs/mongodb-shell/](https://www.mongodb.com/docs/mongodb-shell/)
* 🧩 Mongoose (Node.js):
  [https://mongoosejs.com/](https://mongoosejs.com/)

---

## 5. Instalación y arranque del servicio

### Windows y macOS

Instalar:

* MongoDB Community Server
  [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
* MongoDB Shell
  [https://www.mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell)

---

### 🪟 Windows

Añadir al PATH si es necesario:

```
C:\Program Files\mongosh\
```

Comprobar servicio:

```bash
net start MongoDB
```

Arrancar el shell:

```bash
mongosh
```

Equivalente a:

```bash
mongosh "mongodb://localhost:27017"
```

Si no existe el servicio:

```bash
mongod --dbpath "C:\data\db"
```

> ⚠️ Crear antes la carpeta `C:\data\db`

---

### 🍎 macOS (Homebrew)

```bash
brew services start mongodb-community@8.0
brew services stop mongodb-community@8.0
mongosh
```

---

## 6. Comandos básicos del Shell

```js
show dbs
use basededatos
show collections
```

Ejemplo:

```js
use ejemplo2
```

---

## 7. Inserción de documentos

```js
db.usuarios.insertOne({ id: 1, nombre: "Jaime", edad: 20 })
db.usuarios.insertOne({ id: 2, nombre: "Álvaro", edad: 21 })
```

Inserción múltiple:

```js
db.usuarios.insertMany([
  { id: 3, nombre: "Marta", edad: 21 },
  { id: 4, nombre: "Ian", edad: 22 }
])
```

---

## 8. Consultas básicas (find)

```js
db.usuarios.find().pretty()
db.usuarios.find({ edad: 18 })
db.usuarios.find({ edad: { $gte: 18 } })
db.usuarios.find({ edad: { $gt: 18, $lt: 45 } })
```

---

## 9. Proyección de campos

Mostrar solo algunos campos:

```js
db.usuarios.find({}, { nombre: 1, edad: 1, _id: 0 })
```

Excluir campos:

```js
db.usuarios.find({}, { edad: 0 })
```

---

## 10. Ordenación y límites

```js
db.usuarios.find().sort({ id: 1 })
db.usuarios.find().sort({ id: -1 }).limit(3)
```

---

## 11. Actualización de documentos

```js
db.usuarios.updateOne(
  { id: 2 },
  { $set: { nombre: "DAW2", edad: 18 } }
)
```

> ⚠️ Usar `$set` para no sobrescribir el documento completo.

---

## 12. Documentos anidados

```js
db.usuarios.insertOne({
  id: 10,
  nombre: "Grijander",
  edad: 25,
  direccion: {
    calle: "123 Elm Street",
    ciudad: "Ghotham",
    codigoPostal: "12345"
  }
})
```

Consulta por subcampos:

```js
db.usuarios.find({ "direccion.ciudad": "Ghotham" })
```

---

## 13. Operadores lógicos

```js
db.usuarios.find({
  $or: [
    { edad: { $gte: 18, $lte: 20 } },
    { "direccion.ciudad": "Ghotham" }
  ]
})
```

---

## 14. Aggregations y $lookup (JOIN en MongoDB)

### Usuarios con comentarios

```js
db.usuarios.aggregate([
  {
    $lookup: {
      from: "comments",
      localField: "id",
      foreignField: "idU",
      as: "comentarios"
    }
  },
  {
    $project: {
      _id: 0,
      id: 1,
      nombre: 1,
      comentarios: 1
    }
  }
])
```

---

## 15. Normalización vs Desnormalización

### ✔ Tres colecciones (normalizado)

* Usuarios
* Roles
* RolesAsignados
* Mayor consistencia
* Más flexible a cambios

### ✔ Una colección con roles incrustados

* Consultas más rápidas
* Menos `$lookup`
* Ideal cuando siempre se consultan juntos

Ejemplo:

```js
db.usuariosMongo.insertOne({
  id: 1,
  nombre: "Noelia",
  edad: 18,
  roles: [
    { id: 1, desc: "Admin" },
    { id: 2, desc: "User" }
  ]
})
```

---

## 16. Eliminación de datos

```js
db.usuarios.remove({ id: 2 })
db.usuarios.drop()
db.dropDatabase()
```

---

## 17. Exportar e importar datos

```bash
mongodump -d ejemplo
mongorestore dump/ejemplo --drop
mongoexport -d ejemplo -c usuarios --out usuarios.json
```

---

## 18. Cursores

```js
var cursor = db.usuarios.find()
cursor.forEach(printjson)
```

---

📦 ¿Cuánta información permite la versión gratuita de MongoDB Atlas?
📌 1. Límite de almacenamiento

El plan gratuito M0 permite hasta ~512 MB de almacenamiento total para tus datos y índices en el cluster. 
MongoDB

Ejemplo práctico: si tus documentos son pequeños (p. ej., JSON con campos simples), puedes almacenar muchísimos documentos antes de agotar 512 MB; en cambio, si cada documento contiene muchos campos o datos grandes (imágenes embebidas, cadenas largas), consumirás ese espacio más rápido. 
MongoDB

📌 2. Límite de transferencia de datos

- El plan M0 impone un límite aproximado de 10 GB de datos entrantes y 10 GB salientes en un período de 7 días. Si superas el límite, Atlas puede ralentizar o limitar las operaciones temporariamente. 
MongoDB

📌 3. Otras restricciones importantes en el Free Tier

Además del almacenamiento, Atlas Free Tier tiene estos límites: 
MongoDB

- Máximo de 100 bases de datos y 500 colecciones.
- Hasta 500 conexiones simultáneas.
- Operaciones por segundo limitadas (cortas picos altos).
- No incluye backups automáticos ni funciones avanzadas de rendimiento.
- Cluster compartido (el rendimiento puede ser variable).
MongoDB