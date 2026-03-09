class LottoGenerator extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-wrapper');

        const style = document.createElement('style');
        style.textContent = `
            .lotto-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem;
                border-radius: 15px;
                background-color: var(--container-bg, #fff);
                box-shadow: 0 10px 20px var(--shadow-color, rgba(0,0,0,0.1));
                transition: background-color 0.3s, box-shadow 0.3s;
            }

            button {
                padding: 1rem 2rem;
                font-size: 1.2rem;
                color: #fff;
                background: var(--button-gradient, linear-gradient(45deg, #6a11cb, #2575fc));
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            }

            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(0,0,0,0.3);
            }

            .numbers {
                display: flex;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            }

            .number {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                margin: 0.5rem;
                border-radius: 50%;
                font-size: 1.5rem;
                font-weight: bold;
                color: #fff;
                background-color: #333;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        `;

        const button = document.createElement('button');
        button.textContent = 'Generate Numbers';

        const numbersDiv = document.createElement('div');
        numbersDiv.setAttribute('class', 'numbers');

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(button);
        wrapper.appendChild(numbersDiv);

        button.addEventListener('click', () => {
            this.generateNumbers(numbersDiv);
        });
    }

    generateNumbers(container) {
        container.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach(number => {
            const numberDiv = document.createElement('div');
            numberDiv.setAttribute('class', 'number');
            numberDiv.textContent = number;
            const color = this.getNumberColor(number);
            numberDiv.style.backgroundColor = color;
            container.appendChild(numberDiv);
        });
    }

    getNumberColor(number) {
        if (number <= 10) return '#fbc400';
        if (number <= 20) return '#69c8f2';
        if (number <= 30) return '#ff7272';
        if (number <= 40) return '#aaa';
        return '#b0d840';
    }
}

customElements.define('lotto-generator', LottoGenerator);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.textContent = 'Light Mode';
    }
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Light Mode';
    }
});
