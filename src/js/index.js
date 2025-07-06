import '../css/index.less';
import { fillBlanks } from './fillPlaceholders.js';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateBingoCards(inputs, cardCount) {
  const cards = [];
  for (let n = 0; n < cardCount; n++) {
    const shuffled = shuffleArray(inputs);
    const card = [];
    let index = 0;
    for (let row = 0; row < 5; row++) {
      card[row] = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          card[row][col] = "FREE";
        } else {
          card[row][col] = shuffled[index++];
        }
      }
    }
    cards.push(card);
  }
  return cards;
}

function createUI() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <form id="bingo-form">
      <div id="inputs" class="grid-input"></div>
      <label>Card Title:
        <input type="text" id="card-title" placeholder="My Bingo Card" maxlength="50" />
      </label>
      <label>Number of Cards:
        <input type="number" id="card-count" value="1" min="1" max="100" />
      </label>
      <button type="submit">Generate Cards</button>
    </form>
    <div id="cards-output"></div>
  `;
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.id = 'toggle-inputs';
  toggleBtn.textContent = 'Hide Item Inputs';
  toggleBtn.style.marginBottom = '1rem';
  toggleBtn.addEventListener('click', () => {
    const inputsDiv = document.getElementById('inputs');
    const isHidden = inputsDiv.style.display === 'none';
    inputsDiv.style.display = isHidden ? 'grid' : 'none';
    toggleBtn.textContent = isHidden ? 'Hide Item Inputs' : 'Show Item Inputs';
  });
  app.prepend(toggleBtn);

  const cardCountInput = document.getElementById('card-count');
  cardCountInput.addEventListener('focus', () => {
    setTimeout(() => {
      cardCountInput.select();
    }, 0);
  });


  const inputsDiv = document.getElementById('inputs');
  for (let i = 0; i < 24; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Item ${i + 1}`;
    input.name = 'item';
    input.addEventListener('input', () => {
      if (input.value.length > 128) {
        input.value = input.value.slice(0, 128);
      }

    });
    input.addEventListener('focus', () => {
      input.select();
    });


    inputsDiv.appendChild(input);
  }

  document.getElementById('bingo-form').addEventListener('submit', e => {
    e.preventDefault();

    let inputs = Array.from(inputsDiv.querySelectorAll('input')).map(i => i.value.trim());
    inputs = fillBlanks(inputs);

    const cardCount = parseInt(document.getElementById('card-count').value);
    const cards = generateBingoCards(inputs, cardCount);

    const output = document.getElementById('cards-output');
    output.innerHTML = '';

    cards.forEach((card, i) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card';
      const title = document.getElementById('card-title').value.trim() || `Card ${i + 1}`;
      const titleHeading = document.createElement('h3');
      titleHeading.textContent = `${title}`;
      cardContainer.appendChild(titleHeading);
      // Create card grid
      const grid = document.createElement('div');
      grid.className = 'card-grid';

      card.flat().forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'cell';
        cellDiv.textContent = cell;
        grid.appendChild(cellDiv);
      });

      const printBtn = document.createElement('button');
      printBtn.textContent = 'Print this card';
      printBtn.className = 'card-print-btn';
      printBtn.addEventListener('click', () => {
        const clone = cardContainer.cloneNode(true);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Bingo Card</title>
              <style>
                <style>
                  @page {
                    size: 8.5in 11in;
                    margin: 1in;
                  }

                  body {
                    font-family: sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                  }

                  .card {
                    width: 100%;
                    max-width: 7.5in;
                    aspect-ratio: 1 / 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1rem;
                    box-sizing: border-box;
                    page-break-inside: avoid;
                  }

                  .card h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-size: 1.25rem;
                  }

                  .card-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 0.25rem;
                    width: 100%;
                    height: 100%;
                  }

                  .cell {
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 0.85rem;
                    padding: 0.5rem;
                    aspect-ratio: 1 / 1;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  button {
                    display: none;
                  }
              </style>
            </head>
            <body></body>
          </html>
        `);

        printWindow.document.body.appendChild(clone);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      });



      cardContainer.appendChild(grid);
      cardContainer.appendChild(printBtn);
      output.appendChild(cardContainer);
    });
  });
}

document.addEventListener('DOMContentLoaded', createUI);
