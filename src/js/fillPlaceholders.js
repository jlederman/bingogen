const lorem = [
  "Lorem", "Ipsum", "Dolor", "Sit", "Amet",
  "Consectetur", "Adipiscing", "Elit", "Sed", "Do",
  "Eiusmod", "Tempor", "Incididunt", "Ut", "Labore",
  "Et", "Dolore", "Magna", "Aliqua", "Ut", "Enim",
  "Ad", "Minim", "Veniam", "Quis", "Nostrud"
];

export function fillBlanks(inputs, maxLength = 25) {
  let filled = [...inputs];
  let placeholderIndex = 0;

  for (let i = 0; i < filled.length; i++) {
    if (!filled[i]) {
      let word = lorem[placeholderIndex % lorem.length];
      filled[i] = word.slice(0, maxLength);
      placeholderIndex++;
    }
  }

  return filled;
}
