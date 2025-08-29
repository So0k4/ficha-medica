document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fichaForm');
    const cerrarBtn = document.getElementById('cerrarBtn');
    const buscarBtn = document.getElementById('buscarBtn');
    const buscarApellido = document.getElementById('buscarApellido');
    const resultados = document.getElementById('resultados');

    // Persistencia local de registros para simular almacenamiento
    function obtenerRegistros() {
        return JSON.parse(localStorage.getItem('fichasMedicas')) || [];
    }

    function guardarRegistros(registros) {
        localStorage.setItem('fichasMedicas', JSON.stringify(registros));
    }

    // Validación de formato RUT chileno
    function validarRut(rut) {
        return /^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]{1}$/.test(rut);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const ficha = {
            rut: form.rut.value.trim(),
            nombres: form.nombres.value.trim(),
            apellidos: form.apellidos.value.trim(),
            direccion: form.direccion.value.trim(),
            ciudad: form.ciudad.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim(),
            fechaNacimiento: form.fechaNacimiento.value,
            estadoCivil: form.estadoCivil.value,
            comentarios: form.comentarios.value.trim()
        };

        if (!validarRut(ficha.rut)) {
            alert('Ingrese un RUT válido (Ej: 12.345.678-9)');
            form.rut.focus();
            return;
        }
        if (!ficha.nombres || !ficha.apellidos || !ficha.direccion || !ficha.ciudad ||
            !ficha.telefono || !ficha.email || !ficha.fechaNacimiento || !ficha.estadoCivil) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        let registros = obtenerRegistros();
        const idx = registros.findIndex(r => r.rut === ficha.rut);

        if (idx !== -1) {
            if (confirm('El RUT ya existe. ¿Desea sobrescribir el registro?')) {
                registros[idx] = ficha;
                guardarRegistros(registros);
                alert('Registro actualizado correctamente.');
                form.reset();
            }
        } else {
            registros.push(ficha);
            guardarRegistros(registros);
            alert('Registro guardado correctamente.');
            form.reset();
        }
    });

    cerrarBtn.addEventListener('click', () => {
        window.location.href = "https://www.google.com";
    });

    buscarBtn.addEventListener('click', () => {
        const apellido = buscarApellido.value.trim().toLowerCase();
        const registros = obtenerRegistros();
        const encontrados = registros.filter(r => r.apellidos.toLowerCase().includes(apellido));
        mostrarResultados(encontrados);
    });

    // Presentación de resultados de búsqueda en tabla
    function mostrarResultados(lista) {
        if (lista.length === 0) {
            resultados.innerHTML = "<p>No se encontraron registros.</p>";
            return;
        }
        let html = `<table>
            <tr>
                <th>RUT</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Ciudad</th>
                <th>Teléfono</th>
                <th>Email</th>
            </tr>`;
        lista.forEach(ficha => {
            html += `<tr>
                <td>${ficha.rut}</td>
                <td>${ficha.nombres}</td>
                <td>${ficha.apellidos}</td>
                <td>${ficha.ciudad}</td>
                <td>${ficha.telefono}</td>
                <td>${ficha.email}</td>
            </tr>`;
        });
        html += `</table>`;
        resultados.innerHTML = html;
    }
});
