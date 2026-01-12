# Streaming Markdown Parser

A streaming Markdown parser that processes text as it arrives in chunks (tokens), similar to how AI models like ChatGPT stream text. Built for a coding assignment demonstrating streaming parsing concepts.

## Features

### Core Features ✅
- **Inline codeblocks** (`code`) - Styled with gray background
- **Codeblocks** (```code```) - Styled with gray background and proper formatting
- **Optimistic parsing** - Immediately styles elements when start markers are detected
- **Token splitting support** - Handles markers split across multiple tokens
- **DOM preservation** - Allows text selection during streaming

### Optional Features ✅
- **Headings** (# ## ###) - Rendered as proper H1, H2, H3 elements
- **Bold text** (**text**) - Rendered as `<strong>` elements
- **Italic text** (*text*) - Rendered as `<em>` elements

## How to Run

### Prerequisites
- Node.js installed
- TypeScript compiler

### Installation
```bash
npm install
```

### Build
```bash
npx tsc
copy public\index.html dist\
```

### Run
```bash
cd dist
python -m http.server 8000
# Open http://localhost:8000 in browser
# Click "STREAM" button to see the parser in action
```

## Implementation Details

### Technical Approach
- **Character-by-character processing** - Handles complex token splitting
- **State machine** - Manages parsing context across tokens
- **Immediate DOM manipulation** - Optimistic styling on marker detection
- **Cross-token marker handling** - Uses pending backticks for split markers

### Key Challenges Solved
- Token boundaries splitting markdown markers (e.g., ``` across tokens)
- Maintaining DOM structure for user text selection
- Optimistic parsing without waiting for closing markers
- State management across streaming tokens

## Assignment Requirements Met

✅ **Submitted in time** - Code completed and tested
✅ **Core functionality working** - Inline codeblocks and codeblocks implemented
✅ **Right approach** - Streaming parser with proper state management
✅ **Additional features** - Headings, bold, and italic support added

## Project Structure

```
streaming-markdown-parser/
├── src/
│   ├── MarkdownParser.ts    # Main streaming parser logic
│   └── test.ts              # Test file
├── public/
│   └── index.html           # HTML interface
├── dist/                    # Built files (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **TypeScript** - Type-safe implementation
- **HTML/CSS** - Simple styling for code differentiation
- **Git** - Version control

## Usage Example

The parser processes markdown like:
```markdown
# Heading

Some text with `inline code` and

```bash
code blocks
```

**Bold text** and *italic text*.
```

And renders it with proper styling as the tokens stream in.

---

*Built as part of a coding assignment demonstrating streaming parsing concepts.*