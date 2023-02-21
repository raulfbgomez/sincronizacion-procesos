/**
 * La clase semaphore contiene dos propiedades
 * count: Es un contador que representaq el número de recursos disponibles
 * queue: Cola de promesas que se utilizará para almacenar las solicitudes pendientes para obtener un recurso
 */
class Semaphore {
  constructor(count) {
    this.count = count;
    this.queue = [];
  }

  // Obtención del recurso
  async acquire() {
    // Si hay recursos disponibles decrementamos el contador
    if (this.count > 0) {
      this.count--;
    } else {
      // Agregamos una promesa a la cola de solicitudes pendientes
      await new Promise(resolve => this.queue.push(resolve));
    }
  }

  // Liberacion de un recursos
  release() {
    // Incrementamos el contador de recursos disponibles
    this.count++;
    // Si tenemos solicitudes pendientes en la cola sacamos la siguiente promesa y se resuelve
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    }
  }
}

/**
 * Clase BarberShop
 * El constructor recibe el número de sillas que estaran disponibles
 */
class BarberShop {
  constructor(chairs) {
    this.chairs = chairs;
    this.barberSleeping = true;
    // Inicializamos dos semaforos
    this.semBarber = new Semaphore(0);
    this.semCustomer = new Semaphore(0);
  }

  // Bucle infinito (representa al barbero)
  async barber() {
    while (true) {
      console.log('El barbero esta durmiendo');
      this.barberSleeping = true;
      // El cliente despierta al barbero a traves del semáforo semCustomer
      await this.semCustomer.acquire();
      this.barberSleeping = false;
      console.log('El barbero se ha despertado');
      await this.cutHair();
      // Liberamos al barbero mediante el semáforo semBarber
      this.semBarber.release();
    }
  }

  async cutHair() {
    console.log('El barbero esta cortando el pelo del cliente');
    // El tiempo en atender a un cliente es aleatorio
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
    console.log('El barbero ha terminado de cortar el pelo del cliente');
  }

  // Llegada de clientes a la barberia
  async customer() {
    if (this.chairs > 0) {
      this.chairs--;
      console.log('El cliente entra a la barberia y se sienta en una silla de espera');
      if (this.barberSleeping) {
        console.log('El cliente despierta al barbero');
        this.semCustomer.release();
      } else {
        console.log('El cliente espera a ser atendido por el barbero');
      }
      await this.semBarber.acquire();
      this.chairs++;
      console.log('El cliente ha sido atendido por el barbero y se va de la barberia');
    } else {
      console.log('El cliente se va porque no hay sillas de espera disponibles');
    }
  }

  // Creamos un buble infinito para simular el funcionamiento de nuestro programa
  async start() {
    setInterval(async () => {
      await this.customer();
    }, 1000);

    await this.barber();
  }
}

// Instanciamos la clase BarberShop y se le pasa al constructor el numero de sillas disponibles
const barberShop = new BarberShop(5);
// Llamammos al metodo start e inicia el programa
barberShop.start();
