// const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");

// (async () => {
//   const client = OPCUAClient.create({
//     endpoint_must_exist: false,
//   });

//   try {
//     // Conéctate al servidor OPC-UA
//     await client.connect("opc.tcp://localhost:26543");

//     // Crea una sesión
//     const session = await client.createSession();

//     // Lee el valor de la variable Temperature
//     const dataValue = await session.readVariableValue("ns=1;s=Temperature");

//     // Imprime el valor
//     console.log("Temperature:", dataValue.value.value);

//     // Cierra la sesión
//     await session.close();
//   } catch (err) {
//     console.error("Error:", err.message);
//   } finally {
//     // Cierra la conexión
//     await client.disconnect();
//   }
// })();

const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");

const durationInMinutes = 0.5;
const durationInMilliseconds = durationInMinutes * 60 * 1000; // Convertir minutos a milisegundos

let disconnectTimer

(async () => {
  const client = OPCUAClient.create({
    endpointMustExist: false,
  });

  try {
    // Conéctate al servidor OPC-UA
    await client.connect("opc.tcp://localhost:4840");

    // Crea una sesión
    const session = await client.createSession();

    // Configura un temporizador para desconectar después de 3 minutos
    disconnectTimer = setTimeout(async () => {
      console.log(`Desconectando después de ${durationInMinutes} minutos.`);
      await session.close();
      await client.disconnect();
    }, durationInMilliseconds);

    // Escucha continuamente durante el tiempo especificado
    while (true) {
      // Lee el valor de la variable Temperature
      const dataValue = await session.readVariableValue("ns=1;s=Temperature");

      // Imprime el valor
      console.log("Temperature:", dataValue.value.value);

      // Espera 1 segundo antes de leer nuevamente
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    // Cierra la sesión y desconecta cuando el temporizador expira o cuando se cierra el bucle
    clearTimeout(disconnectTimer);
    await client.disconnect();
  }
})();
