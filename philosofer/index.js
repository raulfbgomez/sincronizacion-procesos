const N = 5; // Número de filósofos

// Función para simular el pensamiento de un filósofo
function pensar(id) {
  console.log("Filósofo", id, "está pensando...");
  setTimeout(() => comer(id), Math.random() * 1000);
}

// Función para simular la comida de un filósofo
function comer(id) {
  console.log("Filósofo", id, "quiere comer.");

  const izquierda = id;
  const derecha = (id + 1) % N;

  // Usar el tenedor izquierdo
  tenedores[izquierda].lock(() => {
    console.log("Filósofo", id, "tiene el tenedor izquierdo", izquierda);

    // Usar el tenedor derecho
    tenedores[derecha].lock(() => {
      console.log("Filósofo", id, "tiene ambos tenedores", izquierda, "y", derecha);
      console.log("Filósofo", id, "está comiendo...");
      setTimeout(() => {
        console.log("Filósofo", id, "ha terminado de comer.");
        tenedores[izquierda].unlock();
        tenedores[derecha].unlock();
        pensar((id + 1) % N);
      }, Math.random() * 1000);
    });
  });
}

// Clase para representar un tenedor
class Tenedor {
  constructor() {
    this.estaOcupado = false;
    this.queue = [];
  }

  lock(cb) {
    if (!this.estaOcupado) {
      this.estaOcupado = true;
      cb();
    } else {
      this.queue.push(cb);
    }
  }

  unlock() {
    if (this.queue.length > 0) {
      const cb = this.queue.shift();
      cb();
    } else {
      this.estaOcupado = false;
    }
  }
}

// Crear los tenedores y filósofos
const tenedores = [];
for (let i = 0; i < N; i++) {
  tenedores.push(new Tenedor());
}

// Empezar programa con cada filósofo pensando
for (let i = 0; i < N; i++) {
  pensar(i);
}
