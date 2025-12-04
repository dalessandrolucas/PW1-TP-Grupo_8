document.addEventListener('DOMContentLoaded', () => {

    const btnTema = document.querySelector('.fa-moon').parentElement;
    const icono = btnTema.querySelector('i');

    const aplicarTema = (esOscuro) => {
        if (esOscuro) {
            document.body.classList.add('dark-mode');
            icono.classList.remove('fa-moon');
            icono.classList.add('fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            icono.classList.remove('fa-sun');
            icono.classList.add('fa-moon');
        }
    };

    const preferenciaGuardada = localStorage.getItem('tema') === 'oscuro';
    aplicarTema(preferenciaGuardada);


    btnTema.addEventListener('click', (e) => {
        e.preventDefault();

        const esOscuro = document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            icono.classList.remove('fa-moon');
            icono.classList.add('fa-sun');
        } else {
            icono.classList.remove('fa-sun');
            icono.classList.add('fa-moon');
        }

        localStorage.setItem('tema', document.body.classList.contains('dark-mode') ? 'oscuro' : 'claro');
    });
});