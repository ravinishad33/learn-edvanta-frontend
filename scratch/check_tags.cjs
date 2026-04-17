const fs = require('fs');
const content = fs.readFileSync('d:\\College\\Major\\Edvanta-LMS\\frontend\\src\\pages\\LearningInterface.jsx', 'utf8');

function countTags(content) {
    const opening = (content.match(/<[a-zA-Z0-9\.]+/g) || []).length;
    const closing = (content.match(/<\/[a-zA-Z0-9\.]+/g) || []).length;
    const selfClosing = (content.match(/\/>/g) || []).length;

    console.log(`Opening: ${opening}`);
    console.log(`Closing: ${closing}`);
    console.log(`Self-Closing: ${selfClosing}`);
    console.log(`Total active: ${opening - closing - selfClosing}`);
}

countTags(content);

// Check specific divs
function checkBrackets(content) {
    let parens = 0;
    let curly = 0;
    let square = 0;

    for (let char of content) {
        if (char === '(') parens++;
        if (char === ')') parens--;
        if (char === '{') curly++;
        if (char === '}') curly--;
        if (char === '[') square++;
        if (char === ']') square--;
    }

    console.log(`Parens: ${parens}`);
    console.log(`Curly: ${curly}`);
    console.log(`Square: ${square}`);
}

checkBrackets(content);
