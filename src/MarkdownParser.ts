const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;

let currentContainer: HTMLElement | null = null; 
// Global state for parsing
let inInlineCode = false;
let inCodeBlock = false;
let currentElement: HTMLElement | null = null;
let pendingBackticks = 0;
let atLineStart = true;
let inBold = false;
let inItalic = false;

// Do not edit this method
function runStream() {
    // Reset state
    inInlineCode = false;
    inCodeBlock = false;
    pendingBackticks = 0;
    atLineStart = true;
    inBold = false;
    inItalic = false;
    
    currentContainer = document.getElementById('markdownContainer')!;
    // Clear previous content
    currentContainer.innerHTML = '';
    // Initialize first element
    currentElement = document.createElement('span');
    currentContainer.appendChild(currentElement);

    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    const tokens: string[] = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }

    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        } else {
            clearInterval(toCancel);
        }
    }, 20);
}


/* 
Please edit the addToken method to support at least inline codeblocks and codeblocks. Feel free to add any other methods you need.
This starter code does token streaming with no styling right now. Your job is to write the parsing logic to make the styling work.

Note: don't be afraid of using globals for state. For this challenge, speed is preferred over cleanliness.
 */
function addToken(token: string) {
    if(!currentContainer) return;

    // Prepend pending backticks from previous token
    let text = '`'.repeat(pendingBackticks) + token;
    pendingBackticks = 0;

    let i = 0;
    while (i < text.length) {
        const char = text[i];

        if (char === '`') {
            // Handle backticks for code
            let backtickCount = 1;
            while (i + backtickCount < text.length && text[i + backtickCount] === '`') {
                backtickCount++;
            }

            if (!inInlineCode && !inCodeBlock) {
                // Starting code element
                if (backtickCount >= 3) {
                    // Start codeblock
                    if (currentElement && currentElement.textContent) {
                        currentContainer.appendChild(currentElement);
                    }
                    const pre = document.createElement('pre');
                    pre.style.backgroundColor = '#f4f4f4';
                    pre.style.padding = '10px';
                    pre.style.borderRadius = '4px';
                    pre.style.margin = '10px 0';
                    pre.style.fontFamily = 'monospace';
                    const code = document.createElement('code');
                    pre.appendChild(code);
                    currentContainer.appendChild(pre);
                    currentElement = code;
                    inCodeBlock = true;
                    i += 3;
                    continue;
                } else if (backtickCount >= 1) {
                    // Start inline code
                    if (currentElement && currentElement.textContent) {
                        currentContainer.appendChild(currentElement);
                    }
                    const span = document.createElement('span');
                    span.style.backgroundColor = '#f0f0f0';
                    span.style.padding = '2px 4px';
                    span.style.borderRadius = '3px';
                    span.style.fontFamily = 'monospace';
                    currentContainer.appendChild(span);
                    currentElement = span;
                    inInlineCode = true;
                    i += 1;
                    continue;
                }
            } else if (inInlineCode) {
                // Ending inline code
                if (backtickCount >= 1) {
                    inInlineCode = false;
                    currentElement = document.createElement('span');
                    currentContainer.appendChild(currentElement);
                    i += 1;
                    continue;
                }
            } else if (inCodeBlock) {
                // Ending codeblock
                if (backtickCount >= 3) {
                    inCodeBlock = false;
                    currentElement = document.createElement('span');
                    currentContainer.appendChild(currentElement);
                    i += 3;
                    continue;
                }
            }

            // If we didn't handle the backticks above, treat them as regular characters
            for (let j = 0; j < backtickCount; j++) {
                if (!currentElement) {
                    currentElement = document.createElement('span');
                    currentContainer.appendChild(currentElement);
                }
                currentElement.textContent += '`';
            }
            i += backtickCount;
            continue;
        } else if (!inInlineCode && !inCodeBlock && atLineStart && char === '#') {
            // Check for heading
            let headingLevel = 1;
            while (i + headingLevel < text.length && text[i + headingLevel] === '#' && headingLevel < 6) {
                headingLevel++;
            }
            if (i + headingLevel < text.length && text[i + headingLevel] === ' ') {
                // Valid heading
                if (currentElement && currentElement.textContent) {
                    currentContainer.appendChild(currentElement);
                }
                const heading = document.createElement(`h${headingLevel}`);
                heading.style.margin = '10px 0';
                heading.style.fontWeight = 'bold';
                currentContainer.appendChild(heading);
                currentElement = heading;
                atLineStart = false;
                i += headingLevel + 1; // Skip #s and space
                continue;
            }
        } else if (!inInlineCode && !inCodeBlock && char === '*') {
            // Check for bold/italic
            let asteriskCount = 1;
            while (i + asteriskCount < text.length && text[i + asteriskCount] === '*') {
                asteriskCount++;
            }

            if (asteriskCount >= 2 && !inBold) {
                // Start bold
                if (currentElement && currentElement.textContent) {
                    currentContainer.appendChild(currentElement);
                }
                const strong = document.createElement('strong');
                currentContainer.appendChild(strong);
                currentElement = strong;
                inBold = true;
                i += 2;
                continue;
            } else if (asteriskCount >= 1 && !inItalic && !inBold) {
                // Start italic
                if (currentElement && currentElement.textContent) {
                    currentContainer.appendChild(currentElement);
                }
                const em = document.createElement('em');
                currentContainer.appendChild(em);
                currentElement = em;
                inItalic = true;
                i += 1;
                continue;
            } else if (inBold && asteriskCount >= 2) {
                // End bold
                inBold = false;
                currentElement = document.createElement('span');
                currentContainer.appendChild(currentElement);
                i += 2;
                continue;
            } else if (inItalic && asteriskCount >= 1) {
                // End italic
                inItalic = false;
                currentElement = document.createElement('span');
                currentContainer.appendChild(currentElement);
                i += 1;
                continue;
            }
        }

        // Handle newlines for line start tracking
        if (char === '\n') {
            atLineStart = true;
        } else if (char !== ' ' && char !== '\t') {
            atLineStart = false;
        }

        // Add character to current element
        if (!currentElement) {
            currentElement = document.createElement('span');
            currentContainer.appendChild(currentElement);
        }
        currentElement.textContent += char;
        i++;
    }

    // Check for trailing backticks to handle across tokens
    let trailingBackticks = 0;
    for (let j = text.length - 1; j >= 0 && text[j] === '`'; j--) {
        trailingBackticks++;
    }
    
    // If we're not in a code state and the last characters are backticks, keep them pending
    if (!inInlineCode && !inCodeBlock && trailingBackticks > 0 && atLineStart === false) {
        pendingBackticks = trailingBackticks;
        // Remove trailing backticks from current element
        if (currentElement && currentElement.textContent) {
            currentElement.textContent = currentElement.textContent.slice(0, -trailingBackticks);
        }
    }
}